import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function EquationSolver() {
  const [equation, setEquation] = useState('')
  const [solution, setSolution] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSolving, setIsSolving] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [showEquationTypes, setShowEquationTypes] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const speechSynth = useRef(null)
  const speakTimer = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ============================================================
     SPEECH
     ============================================================ */
  const stopSpeech = useCallback(() => {
    if (speakTimer.current) {
      clearTimeout(speakTimer.current)
      speakTimer.current = null
    }
    if (speechSynth.current) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }, [])

  const speakText = useCallback((text, delay = 0) => {
    if (!text) return
    stopSpeech()
    if (!("speechSynthesis" in window)) return

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.85
      utterance.pitch = 1.05
      utterance.volume = 1
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      speechSynth.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    if (delay > 0) {
      speakTimer.current = setTimeout(doSpeak, delay)
    } else {
      doSpeak()
    }
  }, [stopSpeech])

  /* ============================================================
     HELPERS — NORMALIZATION & PARSING
     ============================================================ */

  // Clean raw input: remove spaces, unify symbols
  const normalize = (raw) =>
    raw
      .replace(/\s+/g, '')
      .replace(/²/g, '^2')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')

  // Find all distinct variable letters in an expression
  const extractVariables = (expr) => {
    const letters = expr.match(/[a-zA-Z]/g) || []
    return [...new Set(letters.map(l => l.toLowerCase()))]
  }

  // Safe numeric parse (returns null if not a number)
  const safeNum = (s) => {
    if (s === '' || s === undefined || s === null) return null
    const n = Number(s)
    return Number.isFinite(n) ? n : null
  }

  /* ============================================================
     EXPRESSION EVALUATOR (for one side of an equation)
     Returns { coeff, constant } for linear
     i.e. value = coeff * variable + constant
     Supports: +, -, *, /, parentheses, fractions, decimals
     ============================================================ */
  const evaluateExpression = (expr, variable) => {
    // Shunting-yard with single variable support
    // Tokenize
    const tokens = []
    let i = 0
    while (i < expr.length) {
      const ch = expr[i]

      if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '(' || ch === ')') {
        // Handle unary minus / plus at start or after operator or '('
        if ((ch === '-' || ch === '+') && (tokens.length === 0 || ['+', '-', '*', '/', '('].includes(tokens[tokens.length - 1]))) {
          tokens.push('u' + ch) // unary
        } else {
          tokens.push(ch)
        }
        i++
        continue
      }

      if (/\d/.test(ch) || ch === '.') {
        let num = ''
        while (i < expr.length && /[\d.]/.test(expr[i])) {
          num += expr[i]
          i++
        }
        tokens.push(Number(num))
        continue
      }

      if (ch.toLowerCase() === variable.toLowerCase()) {
        tokens.push({ var: variable })
        i++
        continue
      }

      // Unknown character — throw
      throw new Error(`Unsupported character: ${ch}`)
    }

    // Shunting-yard to RPN
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, 'u+': 3, 'u-': 3 }
    const output = []
    const ops = []

    for (const t of tokens) {
      if (typeof t === 'number' || (typeof t === 'object' && t.var)) {
        output.push(t)
      } else if (t === '(') {
        ops.push(t)
      } else if (t === ')') {
        while (ops.length && ops[ops.length - 1] !== '(') {
          output.push(ops.pop())
        }
        if (!ops.length) throw new Error('Mismatched parentheses')
        ops.pop() // remove '('
      } else {
        while (
          ops.length &&
          ops[ops.length - 1] !== '(' &&
          precedence[ops[ops.length - 1]] >= precedence[t]
        ) {
          output.push(ops.pop())
        }
        ops.push(t)
      }
    }
    while (ops.length) {
      const op = ops.pop()
      if (op === '(') throw new Error('Mismatched parentheses')
      output.push(op)
    }

    // Evaluate RPN → gives { coeff, constant }
    const stack = []
    for (const t of output) {
      if (typeof t === 'number') {
        stack.push({ coeff: 0, constant: t })
      } else if (typeof t === 'object' && t.var) {
        stack.push({ coeff: 1, constant: 0 })
      } else if (t === 'u-' || t === 'u+') {
        const a = stack.pop()
        if (!a) throw new Error('Invalid expression')
        if (t === 'u-') stack.push({ coeff: -a.coeff, constant: -a.constant })
        else stack.push(a)
      } else {
        const b = stack.pop()
        const a = stack.pop()
        if (!a || !b) throw new Error('Invalid expression')
        if (t === '+') {
          stack.push({ coeff: a.coeff + b.coeff, constant: a.constant + b.constant })
        } else if (t === '-') {
          stack.push({ coeff: a.coeff - b.coeff, constant: a.constant - b.constant })
        } else if (t === '*') {
          // multiplication: (aC + aK)(bC + bK) — linear only if one side has coeff 0
          if (a.coeff !== 0 && b.coeff !== 0) {
            throw new Error('Non-linear multiplication (variable × variable)')
          }
          stack.push({
            coeff: a.coeff * b.constant + b.coeff * a.constant,
            constant: a.constant * b.constant
          })
        } else if (t === '/') {
          if (b.coeff !== 0) throw new Error('Division by variable not supported')
          if (b.constant === 0) throw new Error('Division by zero')
          stack.push({
            coeff: a.coeff / b.constant,
            constant: a.constant / b.constant
          })
        }
      }
    }
    if (stack.length !== 1) throw new Error('Invalid expression')
    return stack[0]
  }

  /* ============================================================
     LINEAR SOLVER — any variable a→z
     ============================================================ */
  const solveLinearEquation = (rawEq) => {
    const eq = normalize(rawEq)
    const [leftStr, rightStr] = eq.split('=')
    if (!leftStr || !rightStr) return null

    const vars = extractVariables(eq)
    if (vars.length === 0) return null
    // For linear, we solve for the first variable found
    const variable = vars[0]

    const left = evaluateExpression(leftStr, variable)
    const right = evaluateExpression(rightStr, variable)

    const totalCoeff = left.coeff - right.coeff
    const totalConst = left.constant - right.constant

    const steps = []
    steps.push({
      title: "Original Equation",
      content: rawEq,
      explanation: `We identify "${variable}" as the unknown variable.`,
      voiceText: `Original equation: ${rawEq}. We solve for ${variable}.`
    })

    steps.push({
      title: "Move All Terms to Left Side",
      content: `${totalCoeff}${variable} ${totalConst >= 0 ? '+ ' + totalConst : '- ' + Math.abs(totalConst)} = 0`,
      explanation: `Bring all terms to one side to set the equation to zero.`,
      voiceText: `Moving all terms to the left side gives ${totalCoeff}${variable} plus ${totalConst} equals zero.`
    })

    if (totalCoeff !== 0) {
      const sol = -totalConst / totalCoeff
      const solRounded = Math.round(sol * 1e6) / 1e6

      steps.push({
        title: `Isolate ${variable}`,
        content: `${totalCoeff}${variable} = ${-totalConst}`,
        explanation: `Move the constant term to the right side.`,
        voiceText: `Isolating ${variable}: ${totalCoeff}${variable} equals ${-totalConst}.`
      })

      steps.push({
        title: `Solve for ${variable}`,
        content: `${variable} = ${-totalConst} / ${totalCoeff}`,
        explanation: `Divide both sides by the coefficient of ${variable}.`,
        voiceText: `Dividing both sides gives ${variable} = ${solRounded}.`
      })

      steps.push({
        title: "Final Solution",
        content: `${variable} = ${solRounded}`,
        explanation: `The solution is ${variable} = ${solRounded}.`,
        voiceText: `The final solution is ${variable} equals ${solRounded}.`
      })

      return {
        solution: `${variable} = ${solRounded}`,
        steps,
        type: "linear",
        exactSolution: solRounded
      }
    } else {
      if (totalConst === 0) {
        return {
          solution: "Infinite solutions (all real numbers)",
          steps: [...steps, {
            title: "Special Case",
            content: "0 = 0",
            explanation: "The equation is always true, so there are infinite solutions.",
            voiceText: "This equation has infinite solutions."
          }],
          type: "linear"
        }
      }
      return {
        solution: "No solution",
        steps: [...steps, {
          title: "Special Case",
          content: `${totalConst} = 0`,
          explanation: "This is a contradiction, so there is no solution.",
          voiceText: "This equation has no solution."
        }],
        type: "linear"
      }
    }
  }

  /* ============================================================
     QUADRATIC SOLVER — any variable a→z
     ============================================================ */
  const solveQuadraticEquation = (rawEq) => {
    const eq = normalize(rawEq)
    const [leftStr, rightStr] = eq.split('=')
    if (!leftStr || !rightStr) return null

    const vars = extractVariables(eq)
    if (vars.length === 0) return null
    const v = vars[0]

    // Move everything to left
    // Build a general expression: LEFT - (RIGHT) = 0
    const combined = `(${leftStr})-(${rightStr})`

    // Extract coefficients a, b, c where a*v² + b*v + c = 0
    // Strategy: manually scan for v^2, v, and constant terms
    const getCoeff = (expr, varName) => {
      let a = 0, b = 0, c = 0

      // Replace subtraction with +- for clean split
      const cleaned = expr.replace(/-/g, '+-').replace(/\(/g, '').replace(/\)/g, '')
      const terms = cleaned.split('+').filter(t => t !== '')

      for (const term of terms) {
        if (term.includes(`${varName}^2`)) {
          const coef = term.replace(`${varName}^2`, '')
          a += coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef)
        } else if (term.includes(varName)) {
          const coef = term.replace(varName, '')
          b += coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef)
        } else {
          const num = parseFloat(term)
          if (!isNaN(num)) c += num
        }
      }
      return { a, b, c }
    }

    const { a, b, c } = getCoeff(combined, v)

    if (a === 0) {
      // Actually linear
      return solveLinearEquation(rawEq)
    }

    const steps = []
    steps.push({
      title: "Original Equation",
      content: rawEq,
      explanation: `We identify "${v}" as the unknown variable.`,
      voiceText: `Original equation: ${rawEq}. We solve for ${v}.`
    })

    steps.push({
      title: "Standard Form",
      content: `${a}${v}² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}${v} ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = 0`,
      explanation: `Write the equation in standard form a${v}² + b${v} + c = 0.`,
      voiceText: `Standard form: ${a}${v} squared plus ${b}${v} plus ${c} equals zero.`
    })

    steps.push({
      title: "Identify Coefficients",
      content: `a = ${a}, b = ${b}, c = ${c}`,
      explanation: "Identify the coefficients for the quadratic formula.",
      voiceText: `Coefficients are a = ${a}, b = ${b}, c = ${c}.`
    })

    const disc = b * b - 4 * a * c
    steps.push({
      title: "Calculate Discriminant",
      content: `D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${disc}`,
      explanation: "The discriminant tells us about the nature of the roots.",
      voiceText: `The discriminant is ${disc}.`
    })

    if (disc > 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a)
      const r2 = (-b - Math.sqrt(disc)) / (2 * a)
      const r1r = Math.round(r1 * 1e6) / 1e6
      const r2r = Math.round(r2 * 1e6) / 1e6

      steps.push({
        title: "Apply Quadratic Formula",
        content: `${v} = [-b ± √D] / 2a = [${-b} ± √${disc}] / ${2 * a}`,
        explanation: `Using the quadratic formula: ${v} = [-b ± √(b²-4ac)] / 2a`,
        voiceText: `Using the quadratic formula gives ${v} equals ${r1r} or ${v} equals ${r2r}.`
      })
      steps.push({
        title: "Calculate Roots",
        content: `${v}₁ = ${r1r}, ${v}₂ = ${r2r}`,
        explanation: "Two distinct real roots.",
        voiceText: `Two distinct real roots.`
      })

      return {
        solution: `${v} = ${r1r} or ${v} = ${r2r}`,
        steps,
        type: "quadratic",
        exactSolution: [r1r, r2r]
      }
    } else if (disc === 0) {
      const r = Math.round((-b / (2 * a)) * 1e6) / 1e6
      steps.push({
        title: "Repeated Root",
        content: `${v} = ${r}`,
        explanation: "The discriminant is zero, so we have one repeated real root.",
        voiceText: `The discriminant is zero, so the repeated root is ${v} = ${r}.`
      })
      return {
        solution: `${v} = ${r}`,
        steps,
        type: "quadratic",
        exactSolution: [r]
      }
    } else {
      const rp = Math.round((-b / (2 * a)) * 1e4) / 1e4
      const ip = Math.round((Math.sqrt(-disc) / (2 * a)) * 1e4) / 1e4
      steps.push({
        title: "Complex Roots",
        content: `${v} = ${rp} ± ${ip}i`,
        explanation: "The discriminant is negative, so we have complex roots.",
        voiceText: `The discriminant is negative, so we have complex roots: ${v} equals ${rp} plus or minus ${ip} i.`
      })
      return {
        solution: `${v} = ${rp} ± ${ip}i`,
        steps,
        type: "quadratic"
      }
    }
  }

  /* ============================================================
     SYSTEM OF EQUATIONS — any two letters
     ============================================================ */
  const solveSystemOfEquations = (rawEq) => {
    const parts = rawEq.split(';').map(s => s.trim()).filter(Boolean)
    if (parts.length !== 2) return null

    const eq1 = normalize(parts[0])
    const eq2 = normalize(parts[1])

    const vars = extractVariables(eq1 + eq2)
    if (vars.length < 2) return null
    const [v1, v2] = vars

    const buildCoeffs = (eqStr) => {
      const [l, r] = eqStr.split('=')
      const L = evaluateExpression(l, v1)   // but this only supports ONE variable at a time
      // For multi-variable, evaluateExpression cannot be used directly.
      // So we manually parse.
      return null
    }

    // Manual linear-system parser (2 variables)
    const parseLinear2Var = (eqStr, varA, varB) => {
      const [l, r] = eqStr.split('=')
      const parse = (side) => {
        let aC = 0, bC = 0, kC = 0
        const cleaned = side.replace(/-/g, '+-').replace(/\(/g, '').replace(/\)/g, '')
        const terms = cleaned.split('+').filter(t => t !== '')
        for (const term of terms) {
          if (term.toLowerCase().includes(varA)) {
            const coef = term.replace(varA, '')
            aC += coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef)
          } else if (term.toLowerCase().includes(varB)) {
            const coef = term.replace(varB, '')
            bC += coef === '' ? 1 : coef === '-' ? -1 : parseFloat(coef)
          } else {
            const n = parseFloat(term)
            if (!isNaN(n)) kC += n
          }
        }
        return { aC, bC, kC }
      }
      const L = parse(l)
      const R = parse(r)
      return {
        a: L.aC - R.aC,
        b: L.bC - R.bC,
        c: R.kC - L.kC   // move constant to right:  ax + by = c
      }
    }

    const e1 = parseLinear2Var(eq1, v1, v2)
    const e2 = parseLinear2Var(eq2, v1, v2)

    const det = e1.a * e2.b - e2.a * e1.b
    const steps = []

    steps.push({
      title: "System of Equations",
      content: parts.join('\n'),
      explanation: `Two equations with variables ${v1} and ${v2}.`,
      voiceText: `System of equations: ${parts[0]} and ${parts[1]}.`
    })

    steps.push({
      title: "Extract Coefficients",
      content: `${e1.a}${v1} + ${e1.b}${v2} = ${e1.c}\n${e2.a}${v1} + ${e2.b}${v2} = ${e2.c}`,
      explanation: "Identify coefficients for each variable in both equations.",
      voiceText: `Equation one: ${e1.a} ${v1} plus ${e1.b} ${v2} equals ${e1.c}. Equation two: ${e2.a} ${v1} plus ${e2.b} ${v2} equals ${e2.c}.`
    })

    if (det === 0) {
      return {
        solution: "No unique solution (dependent or inconsistent system)",
        steps: [...steps, {
          title: "Special Case",
          content: "Determinant = 0",
          explanation: "The system has either no solution or infinitely many solutions.",
          voiceText: "The determinant is zero, so there is no unique solution."
        }],
        type: "system"
      }
    }

    const xVal = (e1.c * e2.b - e2.c * e1.b) / det
    const yVal = (e1.a * e2.c - e2.a * e1.c) / det
    const xR = Math.round(xVal * 1e6) / 1e6
    const yR = Math.round(yVal * 1e6) / 1e6

    steps.push({
      title: "Calculate Determinant",
      content: `D = (${e1.a})(${e2.b}) - (${e2.a})(${e1.b}) = ${det}`,
      explanation: "The determinant tells us if the system has a unique solution.",
      voiceText: `The determinant is ${det}.`
    })

    steps.push({
      title: `Solve for ${v1}`,
      content: `${v1} = ${xR}`,
      explanation: `Using Cramer's rule.`,
      voiceText: `${v1} equals ${xR}.`
    })

    steps.push({
      title: `Solve for ${v2}`,
      content: `${v2} = ${yR}`,
      explanation: `Using Cramer's rule.`,
      voiceText: `${v2} equals ${yR}.`
    })

    return {
      solution: `${v1} = ${xR}, ${v2} = ${yR}`,
      steps,
      type: "system",
      exactSolution: { [v1]: xR, [v2]: yR }
    }
  }

  /* ============================================================
     DISPATCHER
     ============================================================ */
  const detectAndSolve = (rawEq) => {
    const eq = normalize(rawEq)

    if (eq.includes(';')) return solveSystemOfEquations(rawEq)

    if (/\^2/.test(eq)) return solveQuadraticEquation(rawEq)

    return solveLinearEquation(rawEq)
  }

  /* ============================================================
     SOLVE HANDLER
     ============================================================ */
  const solveEquation = () => {
    if (!equation.trim()) {
      setError('Please enter an equation')
      speakText('Please enter an equation')
      return
    }

    setIsSolving(true)
    setError('')
    setSolution(null)
    setCurrentStep(0)

    try {
      const eq = normalize(equation)

      if (!eq.includes('=')) {
        setError('Equation must contain an equals sign (=)')
        speakText('Equation must contain an equals sign')
        setIsSolving(false)
        return
      }

      const parts = eq.split('=')
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        setError('Please enter a valid equation with one equals sign')
        speakText('Please enter a valid equation')
        setIsSolving(false)
        return
      }

      const result = detectAndSolve(equation)

      if (result) {
        setSolution(result)
        setHistory(prev => {
          const alreadyExists = prev[0]?.equation === equation
          if (alreadyExists) return prev
          return [{
            equation,
            solution: result.solution,
            timestamp: new Date().toLocaleTimeString(),
            type: result.type
          }, ...prev.slice(0, 4)]
        })
        speakText(`Solution found. ${result.solution}`)
      } else {
        setError('Could not solve this equation. Please check the format.')
        speakText('Could not solve this equation. Please check the format.')
      }
    } catch (err) {
      console.error('Solving error:', err)
      setError(`Error: ${err.message || 'Please check the format and try again.'}`)
      speakText('Error solving equation.')
    } finally {
      setIsSolving(false)
    }
  }

  /* ============================================================
     UI HANDLERS
     ============================================================ */
  const handleExampleClick = (example) => {
    setEquation(example)
    setShowEquationTypes(false)
    speakText(`Example equation: ${example}`)
  }

  const nextStep = () => {
    if (solution && currentStep < solution.steps.length - 1) {
      const nextIdx = currentStep + 1
      setCurrentStep(nextIdx)
      const s = solution.steps[nextIdx]
      speakText(s.voiceText || `${s.title}. ${s.explanation}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1
      setCurrentStep(prevIdx)
      const s = solution.steps[prevIdx]
      speakText(s.voiceText || `${s.title}. ${s.explanation}`)
    }
  }

  const clearEquation = () => {
    setEquation('')
    setSolution(null)
    setError('')
    setCurrentStep(0)
    speakText('Equation cleared')
  }

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/topics/algebra" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#6366F1', textDecoration: 'none', marginBottom: '16px', fontSize: '14px'
          }}>
            ← Back to Algebra Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            🧩 Equation Solver
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Solve any equation with any variable (a – z) — step by step
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          
          {/* Input Section */}
          <div style={{ flex: 2 }}>
            <div style={{
              background: 'white', borderRadius: '24px',
              padding: isMobile ? '20px' : '28px', border: '1px solid #E2E8F0'
            }}>
              
              {/* Equation Input */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                    Enter Your Equation:
                  </label>
                  <button onClick={clearEquation}
                    style={{ fontSize: '12px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Clear
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="e.g., 2x+5=13  |  3y-7=14  |  x^2-5x+6=0  |  2a+b=7; a-b=1"
                    style={{
                      flex: 1, padding: '14px 18px', border: '1px solid #E2E8F0',
                      borderRadius: '16px', fontSize: '14px', outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                    onKeyPress={(e) => e.key === 'Enter' && solveEquation()}
                  />
                  <button onClick={solveEquation} disabled={isSolving}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      color: 'white', border: 'none', borderRadius: '16px',
                      cursor: isSolving ? 'not-allowed' : 'pointer',
                      fontWeight: '600', fontSize: '14px', opacity: isSolving ? 0.7 : 1
                    }}>
                    {isSolving ? '...' : 'Solve'}
                  </button>
                </div>
                
                {error && (
                  <div style={{
                    marginTop: '12px', padding: '12px', background: '#FEE2E2',
                    borderRadius: '12px', border: '1px solid #FECACA'
                  }}>
                    <p style={{ fontSize: '13px', color: '#991B1B' }}>{error}</p>
                  </div>
                )}
              </div>

              {/* Solution Display */}
              {solution && (
                <div style={{
                  marginBottom: '24px', background: '#ECFDF5',
                  borderRadius: '20px', padding: '20px', border: '1px solid #D1FAE5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#065F46' }}>Solution</h3>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                      fontWeight: '500', background: '#10B981', color: 'white'
                    }}>
                      {solution.type}
                    </span>
                    <button onClick={() => speakText(solution.solution)}
                      style={{
                        padding: '6px 12px', background: '#10B981', color: 'white',
                        border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '11px'
                      }}>
                      🔊 Read Solution
                    </button>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                      fontSize: isMobile ? '18px' : '20px',
                      fontFamily: 'monospace', fontWeight: '700', color: '#065F46'
                    }}>
                      {solution.solution}
                    </div>
                  </div>

                  {solution.steps.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
                      <button onClick={prevStep} disabled={currentStep === 0}
                        style={{
                          padding: '8px 16px',
                          background: currentStep === 0 ? '#F1F5F9' : '#D1FAE5',
                          color: currentStep === 0 ? '#94A3B8' : '#065F46',
                          border: 'none', borderRadius: '12px',
                          cursor: currentStep === 0 ? 'not-allowed' : 'pointer', fontWeight: '500'
                        }}>
                        ← Previous
                      </button>
                      <div style={{ fontSize: '13px', color: '#047857' }}>
                        Step {currentStep + 1} of {solution.steps.length}
                      </div>
                      <button onClick={nextStep} disabled={currentStep === solution.steps.length - 1}
                        style={{
                          padding: '8px 16px',
                          background: currentStep === solution.steps.length - 1 ? '#F1F5F9' : '#10B981',
                          color: currentStep === solution.steps.length - 1 ? '#94A3B8' : 'white',
                          border: 'none', borderRadius: '12px',
                          cursor: currentStep === solution.steps.length - 1 ? 'not-allowed' : 'pointer', fontWeight: '500'
                        }}>
                        Next →
                      </button>
                    </div>
                  )}

                  {solution.steps[currentStep] && (
                    <div style={{
                      background: 'white', borderRadius: '16px',
                      padding: '20px', borderLeft: '4px solid #10B981'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46' }}>
                          {solution.steps[currentStep].title}
                        </h4>
                        <button
                          onClick={() => speakText(solution.steps[currentStep].voiceText || `${solution.steps[currentStep].title}. ${solution.steps[currentStep].explanation}`)}
                          style={{
                            padding: '4px 10px', background: '#D1FAE5', border: 'none',
                            borderRadius: '8px', cursor: 'pointer', fontSize: '11px', color: '#065F46'
                          }}>
                          🔊 Listen
                        </button>
                      </div>
                      <div style={{
                        fontFamily: 'monospace', background: '#F8FAFC',
                        padding: '12px', borderRadius: '10px', marginBottom: '12px', fontSize: '13px'
                      }}>
                        {solution.steps[currentStep].content}
                      </div>
                      <p style={{ fontSize: '13px', color: '#047857' }}>
                        {solution.steps[currentStep].explanation}
                      </p>
                    </div>
                  )}

                  {solution.steps.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                      {solution.steps.map((_, index) => (
                        <button key={index}
                          onClick={() => {
                            setCurrentStep(index)
                            const s = solution.steps[index]
                            speakText(s.voiceText || `${s.title}. ${s.explanation}`)
                          }}
                          style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: index === currentStep ? '#10B981' : index < currentStep ? '#D1FAE5' : '#E2E8F0',
                            border: 'none', cursor: 'pointer'
                          }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Equation Types - Collapsible */}
              <div>
                <button onClick={() => setShowEquationTypes(!showEquationTypes)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '16px', background: '#F8FAFC',
                    borderRadius: '16px', border: '1px solid #E2E8F0', cursor: 'pointer'
                  }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                    📚 Supported Equation Types & Examples
                  </h3>
                  <span style={{ transform: showEquationTypes ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                
                {showEquationTypes && (
                  <div style={{
                    marginTop: '16px',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '16px'
                  }}>
                    {[
                      {
                        name: "Linear Equations",
                        examples: ["2x+5=13", "3y-7=14", "m/2+3=7", "2(a+3)=16", "-b+4=10"],
                        voiceText: "Linear equations have variables raised to the first power only."
                      },
                      {
                        name: "Quadratic Equations",
                        examples: ["x^2-5x+6=0", "2b^2+3b-2=0", "t^2=16", "y^2+4y+4=0"],
                        voiceText: "Quadratic equations have variables raised to the second power."
                      },
                      {
                        name: "Systems of Equations",
                        examples: ["2x+y=7; x-y=1", "2a+b=7; a-b=1", "3m+2n=12; m-n=1"],
                        voiceText: "Systems of equations involve two equations with two unknowns."
                      }
                    ].map((type, index) => (
                      <div key={index} style={{
                        background: '#F8FAFC', borderRadius: '16px',
                        padding: '16px', border: '1px solid #E2E8F0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <h4 style={{ fontWeight: '600', color: '#0F172A' }}>{type.name}</h4>
                          <button onClick={() => speakText(type.voiceText)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                            🔊
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {type.examples.map((example, exIndex) => (
                            <button key={exIndex} onClick={() => handleExampleClick(example)}
                              style={{
                                textAlign: 'left', fontSize: '13px', color: '#6366F1',
                                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0'
                              }}>
                              {example}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white', borderRadius: '20px',
              padding: '20px', border: '1px solid #E2E8F0', marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>Recent Solutions</h3>
              {history.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '20px' }}>
                  Your solved equations will appear here
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {history.map((item, index) => (
                    <div key={index} style={{
                      background: '#F8FAFC', borderRadius: '12px',
                      padding: '12px', border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>{item.timestamp}</span>
                        <span style={{
                          fontSize: '10px', padding: '2px 8px', borderRadius: '12px',
                          background: '#E0E7FF', color: '#4338CA'
                        }}>
                          {item.type}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#0F172A', marginBottom: '4px' }}>
                        {item.equation}
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: '500', color: '#10B981' }}>
                        {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              borderRadius: '20px', padding: '20px', border: '1px solid #C7D2FE'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E3A8A', marginBottom: '16px' }}>💡 Solving Tips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  "Works with any variable a – z",
                  "Include an equals sign (=)",
                  "Use ^2 for quadratic equations",
                  "For systems, separate with (;)",
                  "Parentheses and fractions are supported",
                  "Click examples to auto-fill"
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E3A8A' }}>
                    <span>•</span><span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Practice Section */}
        <div style={{
          marginTop: '32px', background: 'white', borderRadius: '24px',
          padding: isMobile ? '20px' : '24px', border: '1px solid #E2E8F0'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px', textAlign: 'center' }}>
            🎯 Practice Problems
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            {[
              { problem: "3x-7=14", difficulty: "Easy" },
              { problem: "x^2-5x+6=0", difficulty: "Medium" },
              { problem: "2(a+3)=16", difficulty: "Easy" },
              { problem: "2a+b=7; a-b=1", difficulty: "Hard" }
            ].map((item, index) => (
              <div key={index} style={{
                background: '#F8FAFC', borderRadius: '16px',
                padding: '16px', textAlign: 'center', border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#0F172A', marginBottom: '8px' }}>
                  {item.problem}
                </div>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '10px',
                  background: item.difficulty === 'Easy' ? '#DCFCE7' : item.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                  color: item.difficulty === 'Easy' ? '#166534' : item.difficulty === 'Medium' ? '#92400E' : '#991B1B'
                }}>
                  {item.difficulty}
                </span>
                <button onClick={() => handleExampleClick(item.problem)}
                  style={{
                    width: '100%', marginTop: '12px', padding: '8px',
                    background: '#6366F1', color: 'white', border: 'none',
                    borderRadius: '10px', cursor: 'pointer', fontSize: '12px'
                  }}>
                  Try This
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}