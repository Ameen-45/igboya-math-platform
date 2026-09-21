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

  const stopSpeech = useCallback(() => {
    if (speakTimer.current) { clearTimeout(speakTimer.current); speakTimer.current = null }
    if (speechSynth.current) window.speechSynthesis.cancel()
    setIsPlaying(false)
  }, [])

  const speakText = useCallback((text, delay = 0) => {
    if (!text) return
    stopSpeech()
    if (!("speechSynthesis" in window)) return
    const doSpeak = () => {
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.85; u.pitch = 1.05; u.volume = 1
      u.onstart = () => setIsPlaying(true)
      u.onend = () => setIsPlaying(false)
      u.onerror = () => setIsPlaying(false)
      speechSynth.current = u
      window.speechSynthesis.speak(u)
    }
    if (delay > 0) speakTimer.current = setTimeout(doSpeak, delay)
    else doSpeak()
  }, [stopSpeech])

  /* ============================================================
     NORMALIZE INPUT
     ============================================================ */
  const normalize = (raw) =>
    raw.replace(/\s+/g, '')
       .replace(/²/g, '^2')
       .replace(/×/g, '*')
       .replace(/÷/g, '/')
       .replace(/−/g, '-')

  /* ============================================================
     FIND THE SINGLE VARIABLE LETTER (a-z) IN THE EQUATION
     ============================================================ */
  const findVariable = (eq) => {
    const matches = eq.match(/[a-zA-Z]/g)
    if (!matches) return null
    return matches[0].toLowerCase()
  }

  /* ============================================================
     COUNT DISTINCT LETTERS (to detect systems)
     ============================================================ */
  const countDistinctLetters = (eq) => {
    const matches = eq.match(/[a-zA-Z]/g) || []
    return new Set(matches.map(l => l.toLowerCase())).size
  }

  /* ============================================================
     EXPAND SIMPLE PARENTHESES:
       2(y+3)  →  2y+6
       -(y+3)  →  -y-3
       (y+3)   →  y+3
     ============================================================ */
  const expandParentheses = (expr) => {
    // Match  NUMBER*(...)  or  NUMBER(...)  or  -(...)  or  +(...)  or  (...)
    const parenRegex = /([+-]?\d*\.?\d*)\*?\(([^()]+)\)/g
    let result = expr
    let iterations = 0
    while (parenRegex.test(result) && iterations < 10) {
      result = result.replace(parenRegex, (match, coefRaw, inner) => {
        let coef = 1
        if (coefRaw === '' || coefRaw === '+') coef = 1
        else if (coefRaw === '-') coef = -1
        else coef = parseFloat(coefRaw)
        if (isNaN(coef)) coef = 1

        // Split inner into terms, preserving signs
        const innerTerms = inner.match(/[+-]?[^+-]+/g) || []
        const expanded = innerTerms.map(term => {
          const t = term.trim()
          let sign = 1
          let body = t
          if (t.startsWith('-')) { sign = -1; body = t.slice(1) }
          else if (t.startsWith('+')) { body = t.slice(1) }
          const newCoef = coef * sign
          const signStr = newCoef < 0 ? '-' : '+'
          const coefStr = Math.abs(newCoef) === 1 ? '' : Math.abs(newCoef)
          return signStr + coefStr + body
        }).join('')
        return expanded
      })
      iterations++
    }
    // Remove leading +
    return result.startsWith('+') ? result.slice(1) : result
  }

  /* ============================================================
     PARSE A LINEAR SIDE → { coeff, constant }
     Supports terms like:
       2y      -7       m/2      y/3      3.5y     -y      +5
     ============================================================ */
  const parseLinearSide = (rawSide, variable) => {
    let side = normalize(rawSide)
    side = expandParentheses(side)

    // Convert subtraction into addition of negative
    let flat = side.replace(/-/g, '+-')
    if (flat.startsWith('+')) flat = flat.slice(1)

    const terms = flat.split('+').map(t => t.trim()).filter(Boolean)

    let coeff = 0
    let constant = 0

    for (const term of terms) {
      if (!term) continue

      // Pattern A: <number>/<number> followed by variable? Or variable/number?
      // varName/number    e.g.  y/3
      const varDivNum = term.match(new RegExp(`^([+-]?\\d*\\.?\\d*)${variable}/(\\d*\\.?\\d+)$`, 'i'))
      if (varDivNum) {
        const numCoef = varDivNum[1] === '' || varDivNum[1] === '+' ? 1 :
                        varDivNum[1] === '-' ? -1 : parseFloat(varDivNum[1])
        const denom = parseFloat(varDivNum[2])
        if (denom === 0) throw new Error('Division by zero')
        coeff += numCoef / denom
        continue
      }

      // number/variable    e.g.  5/y  → not linear
      const numDivVar = term.match(new RegExp(`^([+-]?\\d*\\.?\\d*)/(\\d*\\.?\\d*)${variable}$`, 'i'))
      if (numDivVar) {
        throw new Error('Division by variable is not supported')
      }

      // Pattern B: coefficient*variable   (e.g., 2y, -3y, y)
      const varTerm = term.match(new RegExp(`^([+-]?\\d*\\.?\\d*)${variable}$`, 'i'))
      if (varTerm) {
        const c = varTerm[1]
        if (c === '' || c === '+') coeff += 1
        else if (c === '-') coeff -= 1
        else coeff += parseFloat(c)
        continue
      }

      // Pattern C: pure constant
      const num = parseFloat(term)
      if (!isNaN(num) && /^[+-]?\d*\.?\d+$/.test(term)) {
        constant += num
        continue
      }

      throw new Error(`Cannot parse term: "${term}"`)
    }

    return { coeff, constant }
  }

  /* ============================================================
     PARSE A QUADRATIC SIDE → { a, b, c }  where a·v² + b·v + c
     ============================================================ */
  const parseQuadraticSide = (rawSide, variable) => {
    let side = normalize(rawSide)
    side = expandParentheses(side)

    let flat = side.replace(/-/g, '+-')
    if (flat.startsWith('+')) flat = flat.slice(1)

    const terms = flat.split('+').map(t => t.trim()).filter(Boolean)

    let a = 0, b = 0, c = 0

    for (const term of terms) {
      if (!term) continue

      // v² term
      const v2 = term.match(new RegExp(`^([+-]?\\d*\\.?\\d*)${variable}\\^2$`, 'i'))
      if (v2) {
        const c2 = v2[1]
        if (c2 === '' || c2 === '+') a += 1
        else if (c2 === '-') a -= 1
        else a += parseFloat(c2)
        continue
      }

      // v term
      const v1 = term.match(new RegExp(`^([+-]?\\d*\\.?\\d*)${variable}$`, 'i'))
      if (v1) {
        const c1 = v1[1]
        if (c1 === '' || c1 === '+') b += 1
        else if (c1 === '-') b -= 1
        else b += parseFloat(c1)
        continue
      }

      // constant
      const num = parseFloat(term)
      if (!isNaN(num) && /^[+-]?\d*\.?\d+$/.test(term)) {
        c += num
        continue
      }
      throw new Error(`Cannot parse term: "${term}"`)
    }
    return { a, b, c }
  }

  /* ============================================================
     SOLVE LINEAR
     ============================================================ */
  const solveLinear = (rawEq) => {
    const eq = normalize(rawEq)
    const [left, right] = eq.split('=')
    if (!left || !right) throw new Error('Missing one side of the equation')

    const variable = findVariable(eq)
    if (!variable) throw new Error('No variable found (a–z)')

    const L = parseLinearSide(left, variable)
    const R = parseLinearSide(right, variable)

    const totalCoeff = L.coeff - R.coeff
    const totalConst = L.constant - R.constant

    const steps = []
    steps.push({
      title: 'Original Equation',
      content: rawEq,
      explanation: `We solve for the variable "${variable}".`,
      voiceText: `Original equation: ${rawEq}. We solve for ${variable}.`
    })

    steps.push({
      title: 'Move All Terms to One Side',
      content: `${totalCoeff}${variable} ${totalConst >= 0 ? '+ ' + totalConst : '- ' + Math.abs(totalConst)} = 0`,
      explanation: 'Bring all terms to the left-hand side.',
      voiceText: `Moving all terms to one side gives ${totalCoeff} ${variable} plus ${totalConst} equals zero.`
    })

    if (totalCoeff === 0) {
      if (totalConst === 0) {
        return {
          solution: 'Infinite solutions (all real numbers)',
          steps,
          type: 'linear'
        }
      }
      return {
        solution: 'No solution',
        steps,
        type: 'linear'
      }
    }

    const sol = -totalConst / totalCoeff
    const solRounded = Math.round(sol * 1e6) / 1e6

    steps.push({
      title: `Isolate ${variable}`,
      content: `${totalCoeff}${variable} = ${-totalConst}`,
      explanation: 'Move constants to the right-hand side.',
      voiceText: `Isolating ${variable}: ${totalCoeff} ${variable} equals ${-totalConst}.`
    })

    steps.push({
      title: `Divide by the Coefficient`,
      content: `${variable} = ${-totalConst} ÷ ${totalCoeff}`,
      explanation: 'Divide both sides by the coefficient of the variable.',
      voiceText: `Dividing both sides gives ${variable} equals ${solRounded}.`
    })

    steps.push({
      title: 'Final Solution',
      content: `${variable} = ${solRounded}`,
      explanation: `Solution: ${variable} = ${solRounded}`,
      voiceText: `The final answer is ${variable} equals ${solRounded}.`
    })

    return {
      solution: `${variable} = ${solRounded}`,
      steps,
      type: 'linear'
    }
  }

  /* ============================================================
     SOLVE QUADRATIC
     ============================================================ */
  const solveQuadratic = (rawEq) => {
    const eq = normalize(rawEq)
    const [left, right] = eq.split('=')
    if (!left || !right) throw new Error('Missing one side of the equation')

    const variable = findVariable(eq)
    if (!variable) throw new Error('No variable found (a–z)')

    const L = parseQuadraticSide(left, variable)
    const R = parseQuadraticSide(right, variable)

    const a = L.a - R.a
    const b = L.b - R.b
    const c = L.c - R.c

    if (a === 0) {
      // fall back to linear
      return solveLinear(rawEq)
    }

    const steps = []
    steps.push({
      title: 'Original Equation',
      content: rawEq,
      explanation: `We solve the quadratic for "${variable}".`,
      voiceText: `Original equation: ${rawEq}.`
    })

    steps.push({
      title: 'Standard Form',
      content: `${a}${variable}² ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}${variable} ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = 0`,
      explanation: `Standard form a·${variable}² + b·${variable} + c = 0`,
      voiceText: `Standard form: ${a} ${variable} squared plus ${b} ${variable} plus ${c} equals zero.`
    })

    steps.push({
      title: 'Identify Coefficients',
      content: `a = ${a}, b = ${b}, c = ${c}`,
      explanation: 'These feed into the quadratic formula.',
      voiceText: `Coefficients: a equals ${a}, b equals ${b}, c equals ${c}.`
    })

    const disc = b * b - 4 * a * c
    steps.push({
      title: 'Compute Discriminant',
      content: `D = b² − 4ac = (${b})² − 4(${a})(${c}) = ${disc}`,
      explanation: 'The discriminant tells us the nature of the roots.',
      voiceText: `The discriminant is ${disc}.`
    })

    if (disc > 0) {
      const r1 = Math.round(((-b + Math.sqrt(disc)) / (2 * a)) * 1e6) / 1e6
      const r2 = Math.round(((-b - Math.sqrt(disc)) / (2 * a)) * 1e6) / 1e6
      steps.push({
        title: 'Apply Quadratic Formula',
        content: `${variable} = (−b ± √D) ÷ 2a = (${-b} ± √${disc}) ÷ ${2 * a}`,
        explanation: 'Two distinct real roots.',
        voiceText: `The roots are ${variable} equals ${r1} and ${variable} equals ${r2}.`
      })
      return {
        solution: `${variable} = ${r1} or ${variable} = ${r2}`,
        steps,
        type: 'quadratic'
      }
    } else if (disc === 0) {
      const r = Math.round((-b / (2 * a)) * 1e6) / 1e6
      steps.push({
        title: 'Repeated Root',
        content: `${variable} = ${r}`,
        explanation: 'Discriminant is zero — one repeated root.',
        voiceText: `Repeated root: ${variable} equals ${r}.`
      })
      return { solution: `${variable} = ${r}`, steps, type: 'quadratic' }
    } else {
      const rp = Math.round((-b / (2 * a)) * 1e4) / 1e4
      const ip = Math.round((Math.sqrt(-disc) / (2 * a)) * 1e4) / 1e4
      steps.push({
        title: 'Complex Roots',
        content: `${variable} = ${rp} ± ${ip}i`,
        explanation: 'Discriminant is negative.',
        voiceText: `Complex roots: ${variable} equals ${rp} plus or minus ${ip} i.`
      })
      return { solution: `${variable} = ${rp} ± ${ip}i`, steps, type: 'quadratic' }
    }
  }

  /* ============================================================
     SOLVE SYSTEM
     ============================================================ */
  const solveSystem = (rawEq) => {
    const parts = rawEq.split(';').map(s => s.trim()).filter(Boolean)
    if (parts.length !== 2) throw new Error('System must have exactly two equations separated by ;')

    const eq1 = normalize(parts[0])
    const eq2 = normalize(parts[1])

    const allLetters = (eq1 + eq2).match(/[a-zA-Z]/g) || []
    const distinct = [...new Set(allLetters.map(l => l.toLowerCase()))]
    if (distinct.length < 2) throw new Error('System needs two distinct variables')
    const [v1, v2] = distinct

    const parseSide = (side) => {
      let flat = side.replace(/-/g, '+-')
      if (flat.startsWith('+')) flat = flat.slice(1)
      const terms = flat.split('+').map(t => t.trim()).filter(Boolean)
      let aC = 0, bC = 0, kC = 0
      for (const term of terms) {
        if (!term) continue
        const lower = term.toLowerCase()
        if (lower.includes(v1)) {
          const coefStr = term.replace(new RegExp(v1, 'ig'), '')
          aC += coefStr === '' || coefStr === '+' ? 1 :
                coefStr === '-' ? -1 : parseFloat(coefStr)
        } else if (lower.includes(v2)) {
          const coefStr = term.replace(new RegExp(v2, 'ig'), '')
          bC += coefStr === '' || coefStr === '+' ? 1 :
                coefStr === '-' ? -1 : parseFloat(coefStr)
        } else {
          const n = parseFloat(term)
          if (!isNaN(n)) kC += n
        }
      }
      return { aC, bC, kC }
    }

    const buildCoeffs = (eqStr) => {
      const [l, r] = eqStr.split('=')
      const L = parseSide(l)
      const R = parseSide(r)
      return {
        a: L.aC - R.aC,
        b: L.bC - R.bC,
        c: R.kC - L.kC
      }
    }

    const e1 = buildCoeffs(eq1)
    const e2 = buildCoeffs(eq2)
    const det = e1.a * e2.b - e2.a * e1.b

    const steps = []
    steps.push({
      title: 'System of Equations',
      content: parts.join('\n'),
      explanation: `Two equations in ${v1} and ${v2}.`,
      voiceText: `Solving the system for ${v1} and ${v2}.`
    })

    if (det === 0) {
      return {
        solution: 'No unique solution',
        steps,
        type: 'system'
      }
    }

    const x = Math.round(((e1.c * e2.b - e2.c * e1.b) / det) * 1e6) / 1e6
    const y = Math.round(((e1.a * e2.c - e2.a * e1.c) / det) * 1e6) / 1e6

    steps.push({
      title: `Solve for ${v1}`,
      content: `${v1} = ${x}`,
      explanation: 'Using Cramer\'s rule.',
      voiceText: `${v1} equals ${x}.`
    })
    steps.push({
      title: `Solve for ${v2}`,
      content: `${v2} = ${y}`,
      explanation: 'Using Cramer\'s rule.',
      voiceText: `${v2} equals ${y}.`
    })

    return {
      solution: `${v1} = ${x}, ${v2} = ${y}`,
      steps,
      type: 'system'
    }
  }

  /* ============================================================
     DISPATCHER
     ============================================================ */
  const solveEquationText = (rawEq) => {
    const eq = normalize(rawEq)

    if (eq.includes(';')) {
      return solveSystem(rawEq)
    }

    const distinctLetters = countDistinctLetters(eq)
    if (distinctLetters > 1) {
      throw new Error('Only one variable is allowed (for two variables, separate with ";")')
    }

    if (/\^2/.test(eq)) {
      return solveQuadratic(rawEq)
    }

    return solveLinear(rawEq)
  }

  /* ============================================================
     UI HANDLER
     ============================================================ */
  const handleSolve = () => {
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
        setError('Equation must contain an "=" sign')
        setIsSolving(false)
        return
      }
      const eqParts = eq.split('=')
      if (eqParts.length !== 2 || !eqParts[0] || !eqParts[1]) {
        setError('Please enter a valid equation with one "=" sign')
        setIsSolving(false)
        return
      }

      const result = solveEquationText(equation)
      if (result) {
        setSolution(result)
        setHistory(prev => {
          if (prev[0]?.equation === equation) return prev
          return [{
            equation,
            solution: result.solution,
            timestamp: new Date().toLocaleTimeString(),
            type: result.type
          }, ...prev.slice(0, 4)]
        })
        speakText(`Solution found. ${result.solution}`)
      } else {
        setError('Could not solve this equation.')
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
      speakText(`Error: ${err.message}`)
    } finally {
      setIsSolving(false)
    }
  }

  const handleExampleClick = (ex) => {
    setEquation(ex)
    setShowEquationTypes(false)
  }

  const nextStep = () => {
    if (solution && currentStep < solution.steps.length - 1) {
      const n = currentStep + 1
      setCurrentStep(n)
      const s = solution.steps[n]
      speakText(s.voiceText || `${s.title}. ${s.explanation}`)
    }
  }
  const prevStep = () => {
    if (currentStep > 0) {
      const p = currentStep - 1
      setCurrentStep(p)
      const s = solution.steps[p]
      speakText(s.voiceText || `${s.title}. ${s.explanation}`)
    }
  }
  const clearEquation = () => {
    setEquation('')
    setSolution(null)
    setError('')
    setCurrentStep(0)
  }

  useEffect(() => () => stopSpeech(), [stopSpeech])

  /* ============================================================
     UI
     ============================================================ */
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)', padding: isMobile ? '16px' : '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/topics/algebra" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6366F1', textDecoration: 'none', marginBottom: '16px', fontSize: '14px' }}>← Back to Algebra Topics</Link>
          <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '700', background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>🧩 Equation Solver</h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>Solve any equation with any variable (a – z) — step by step</p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          <div style={{ flex: 2 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '20px' : '28px', border: '1px solid #E2E8F0' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>Enter Your Equation:</label>
                  <button onClick={clearEquation} style={{ fontSize: '12px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="e.g., 2x+5=13 | 3y-7=14 | x^2-5x+6=0 | 2a+b=7; a-b=1"
                    style={{ flex: 1, padding: '14px 18px', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '14px', outline: 'none' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                    onKeyPress={(e) => e.key === 'Enter' && handleSolve()}
                  />
                  <button onClick={handleSolve} disabled={isSolving} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: 'white', border: 'none', borderRadius: '16px', cursor: isSolving ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px', opacity: isSolving ? 0.7 : 1 }}>
                    {isSolving ? '...' : 'Solve'}
                  </button>
                </div>
                {error && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#FEE2E2', borderRadius: '12px', border: '1px solid #FECACA' }}>
                    <p style={{ fontSize: '13px', color: '#991B1B' }}>{error}</p>
                  </div>
                )}
              </div>

              {solution && (
                <div style={{ marginBottom: '24px', background: '#ECFDF5', borderRadius: '20px', padding: '20px', border: '1px solid #D1FAE5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#065F46' }}>Solution</h3>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: '#10B981', color: 'white' }}>{solution.type}</span>
                    <button onClick={() => speakText(solution.solution)} style={{ padding: '6px 12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '11px' }}>🔊 Read Solution</button>
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: isMobile ? '18px' : '20px', fontFamily: 'monospace', fontWeight: '700', color: '#065F46' }}>{solution.solution}</div>
                  </div>
                  {solution.steps.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
                      <button onClick={prevStep} disabled={currentStep === 0} style={{ padding: '8px 16px', background: currentStep === 0 ? '#F1F5F9' : '#D1FAE5', color: currentStep === 0 ? '#94A3B8' : '#065F46', border: 'none', borderRadius: '12px', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', fontWeight: '500' }}>← Previous</button>
                      <div style={{ fontSize: '13px', color: '#047857' }}>Step {currentStep + 1} of {solution.steps.length}</div>
                      <button onClick={nextStep} disabled={currentStep === solution.steps.length - 1} style={{ padding: '8px 16px', background: currentStep === solution.steps.length - 1 ? '#F1F5F9' : '#10B981', color: currentStep === solution.steps.length - 1 ? '#94A3B8' : 'white', border: 'none', borderRadius: '12px', cursor: currentStep === solution.steps.length - 1 ? 'not-allowed' : 'pointer', fontWeight: '500' }}>Next →</button>
                    </div>
                  )}
                  {solution.steps[currentStep] && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', borderLeft: '4px solid #10B981' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46' }}>{solution.steps[currentStep].title}</h4>
                        <button onClick={() => speakText(solution.steps[currentStep].voiceText || `${solution.steps[currentStep].title}. ${solution.steps[currentStep].explanation}`)} style={{ padding: '4px 10px', background: '#D1FAE5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', color: '#065F46' }}>🔊 Listen</button>
                      </div>
                      <div style={{ fontFamily: 'monospace', background: '#F8FAFC', padding: '12px', borderRadius: '10px', marginBottom: '12px', fontSize: '13px' }}>{solution.steps[currentStep].content}</div>
                      <p style={{ fontSize: '13px', color: '#047857' }}>{solution.steps[currentStep].explanation}</p>
                    </div>
                  )}
                  {solution.steps.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
                      {solution.steps.map((_, i) => (
                        <button key={i} onClick={() => setCurrentStep(i)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === currentStep ? '#10B981' : i < currentStep ? '#D1FAE5' : '#E2E8F0', border: 'none', cursor: 'pointer' }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <button onClick={() => setShowEquationTypes(!showEquationTypes)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>📚 Supported Equation Types & Examples</h3>
                  <span style={{ transform: showEquationTypes ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {showEquationTypes && (
                  <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
                    {[
                      { name: 'Linear Equations', examples: ['2x+5=13', '3y-7=14', 'm/2+3=7', '2(a+3)=16', '-b+4=10'] },
                      { name: 'Quadratic Equations', examples: ['x^2-5x+6=0', '2b^2+3b-2=0', 't^2=16', 'y^2+4y+4=0'] },
                      { name: 'Systems of Equations', examples: ['2x+y=7; x-y=1', '2a+b=7; a-b=1', '3m+2n=12; m-n=1'] }
                    ].map((type, i) => (
                      <div key={i} style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }}>
                        <h4 style={{ fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>{type.name}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {type.examples.map((ex, j) => (
                            <button key={j} onClick={() => handleExampleClick(ex)} style={{ textAlign: 'left', fontSize: '13px', color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>{ex}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>Recent Solutions</h3>
              {history.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '20px' }}>Your solved equations will appear here</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {history.map((item, i) => (
                    <div key={i} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>{item.timestamp}</span>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', background: '#E0E7FF', color: '#4338CA' }}>{item.type}</span>
                      </div>
                      <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#0F172A', marginBottom: '4px' }}>{item.equation}</p>
                      <p style={{ fontSize: '12px', fontWeight: '500', color: '#10B981' }}>{item.solution}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)', borderRadius: '20px', padding: '20px', border: '1px solid #C7D2FE' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E3A8A', marginBottom: '16px' }}>💡 Solving Tips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Works with any variable a – z',
                  'Include an equals sign (=)',
                  'Use ^2 for quadratic equations',
                  'For systems, separate with (;)',
                  'Parentheses and fractions are supported'
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E3A8A' }}>
                    <span>•</span><span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px', background: 'white', borderRadius: '24px', padding: isMobile ? '20px' : '24px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px', textAlign: 'center' }}>🎯 Practice Problems</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { problem: '3x-7=14', difficulty: 'Easy' },
              { problem: 'x^2-5x+6=0', difficulty: 'Medium' },
              { problem: '2(a+3)=16', difficulty: 'Easy' },
              { problem: '2a+b=7; a-b=1', difficulty: 'Hard' }
            ].map((item, i) => (
              <div key={i} style={{ background: '#F8FAFC', borderRadius: '16px', padding: '16px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#0F172A', marginBottom: '8px' }}>{item.problem}</div>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', background: item.difficulty === 'Easy' ? '#DCFCE7' : item.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2', color: item.difficulty === 'Easy' ? '#166534' : item.difficulty === 'Medium' ? '#92400E' : '#991B1B' }}>{item.difficulty}</span>
                <button onClick={() => handleExampleClick(item.problem)} style={{ width: '100%', marginTop: '12px', padding: '8px', background: '#6366F1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}>Try This</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}