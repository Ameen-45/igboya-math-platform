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

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const stopSpeech = useCallback(() => {
    if (speechSynth.current) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }, [])

  const speakText = useCallback((text) => {
    stopSpeech()
    if (!("speechSynthesis" in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 1.05
    utterance.volume = 1
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    speechSynth.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [stopSpeech])

  const equationTypes = [
    {
      name: "Linear Equations",
      examples: ["2x + 5 = 13", "3(x - 2) = 12", "x/2 + 3 = 7"],
      pattern: /[x]=/,
      solver: solveLinearEquation,
      voiceText: "Linear equations have variables raised to the first power only."
    },
    {
      name: "Quadratic Equations",
      examples: ["x^2 - 5x + 6 = 0", "2x^2 + 3x - 2 = 0", "x^2 = 16"],
      pattern: /x\^2|x²/,
      solver: solveQuadraticEquation,
      voiceText: "Quadratic equations have variables raised to the second power. They can have up to two solutions."
    },
    {
      name: "Systems of Equations",
      examples: ["2x + y = 7; x - y = 1", "x + y = 5; 2x - y = 4"],
      pattern: /[;]/,
      solver: solveSystemOfEquations,
      voiceText: "Systems of equations involve two or more equations with multiple variables. We solve them simultaneously."
    }
  ]

  // Proper equation parser
  function parseEquation(eq) {
    let cleanEq = eq.replace(/\s/g, '').replace(/²/g, '^2')
    if (!cleanEq.includes('=')) return null
    const [left, right] = cleanEq.split('=')
    return { left, right }
  }

  // Parse linear terms
  function parseLinearTerms(expression) {
    let xCoefficient = 0
    let constant = 0
    
    if (expression === 'x') return { xCoefficient: 1, constant: 0 }
    if (expression === '-x') return { xCoefficient: -1, constant: 0 }
    
    const terms = expression.split(/(?=[+-])/).filter(term => term !== '')
    
    terms.forEach(term => {
      if (term.includes('x')) {
        let coef = term.replace('x', '')
        if (coef === '' || coef === '+') {
          xCoefficient += 1
        } else if (coef === '-') {
          xCoefficient -= 1
        } else {
          xCoefficient += parseFloat(coef)
        }
      } else {
        constant += parseFloat(term)
      }
    })
    
    return { xCoefficient, constant }
  }

  function solveLinearEquation(eq) {
    const steps = []
    const parsed = parseEquation(eq)
    if (!parsed) return null

    steps.push({
      title: "Original Equation",
      content: eq,
      explanation: "We start with the given linear equation.",
      voiceText: `Original equation: ${eq}`
    })

    const leftTerms = parseLinearTerms(parsed.left)
    const rightTerms = parseLinearTerms(parsed.right)

    const totalXCoefficient = leftTerms.xCoefficient - rightTerms.xCoefficient
    const totalConstant = leftTerms.constant - rightTerms.constant

    steps.push({
      title: "Move All Terms to Left Side",
      content: `${totalXCoefficient === 1 ? '' : totalXCoefficient}x ${totalConstant >= 0 ? '+ ' + totalConstant : totalConstant} = 0`,
      explanation: `Bring all terms to one side to set the equation to zero.`,
      voiceText: `Moving all terms to the left side gives ${totalXCoefficient}x plus ${totalConstant} equals zero.`
    })

    if (totalXCoefficient !== 0) {
      const solution = -totalConstant / totalXCoefficient
      
      steps.push({
        title: "Isolate x",
        content: `${totalXCoefficient}x = ${-totalConstant}`,
        explanation: `Move the constant term to the right side.`,
        voiceText: `Isolating x: ${totalXCoefficient}x equals ${-totalConstant}.`
      })

      steps.push({
        title: "Solve for x",
        content: `x = ${-totalConstant} / ${totalXCoefficient}`,
        explanation: `Divide both sides by the coefficient of x.`,
        voiceText: `Dividing both sides gives x = ${solution}.`
      })

      steps.push({
        title: "Final Solution",
        content: `x = ${solution}`,
        explanation: `The solution to the equation is x = ${solution}.`,
        voiceText: `The final solution is x = ${solution}.`
      })

      return {
        solution: `x = ${solution}`,
        steps,
        type: "linear",
        exactSolution: solution
      }
    } else {
      if (totalConstant === 0) {
        return {
          solution: "Infinite solutions (all real numbers)",
          steps: [...steps, {
            title: "Special Case",
            content: "0 = 0",
            explanation: "The equation is always true, so there are infinite solutions.",
            voiceText: "This equation has infinite solutions because it's always true."
          }],
          type: "linear"
        }
      } else {
        return {
          solution: "No solution",
          steps: [...steps, {
            title: "Special Case",
            content: `${totalConstant} = 0`,
            explanation: "This is a contradiction, so there is no solution.",
            voiceText: "This equation has no solution because it leads to a contradiction."
          }],
          type: "linear"
        }
      }
    }
  }

  function solveQuadraticEquation(eq) {
    const steps = []
    const parsed = parseEquation(eq)
    if (!parsed) return null

    steps.push({
      title: "Original Equation",
      content: eq,
      explanation: "We start with the given quadratic equation.",
      voiceText: `Original equation: ${eq}`
    })

    let a = 0, b = 0, c = 0
    
    const x2Match = parsed.left.match(/([+-]?\d*)x\^2/)
    if (x2Match) {
      a = x2Match[1] === '' ? 1 : x2Match[1] === '-' ? -1 : parseFloat(x2Match[1])
    }

    const xMatch = parsed.left.match(/([+-]?\d*)x(?!\^)/)
    if (xMatch) {
      b = xMatch[1] === '' ? 1 : xMatch[1] === '-' ? -1 : parseFloat(xMatch[1])
    }

    const constantMatch = parsed.left.match(/([+-]?\d+)(?!.*x)/)
    if (constantMatch) {
      c = parseFloat(constantMatch[1])
    }

    if (parsed.right !== '0') {
      const rightConstant = parseFloat(parsed.right) || 0
      c -= rightConstant
    }

    steps.push({
      title: "Standard Form",
      content: `${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c} = 0`,
      explanation: "Write the equation in standard form ax² + bx + c = 0.",
      voiceText: `The equation in standard form is ${a}x squared plus ${b}x plus ${c} equals zero.`
    })

    steps.push({
      title: "Identify Coefficients",
      content: `a = ${a}, b = ${b}, c = ${c}`,
      explanation: "Identify the coefficients for the quadratic formula.",
      voiceText: `Coefficients are a = ${a}, b = ${b}, c = ${c}.`
    })

    const discriminant = b * b - 4 * a * c
    
    steps.push({
      title: "Calculate Discriminant",
      content: `D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${discriminant}`,
      explanation: "The discriminant tells us about the nature of the roots.",
      voiceText: `The discriminant is ${discriminant}.`
    })

    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a)
      
      steps.push({
        title: "Apply Quadratic Formula",
        content: `x = [-b ± √D] / 2a = [${-b} ± √${discriminant}] / ${2*a}`,
        explanation: "Using the quadratic formula: x = [-b ± √(b²-4ac)] / 2a",
        voiceText: `Using the quadratic formula gives x equals ${root1.toFixed(4)} or x equals ${root2.toFixed(4)}.`
      })

      steps.push({
        title: "Calculate Roots",
        content: `x₁ = ${root1.toFixed(4)}, x₂ = ${root2.toFixed(4)}`,
        explanation: "Two distinct real roots.",
        voiceText: `Two distinct real roots.`
      })

      return {
        solution: `x = ${root1.toFixed(4)} or x = ${root2.toFixed(4)}`,
        steps,
        type: "quadratic",
        exactSolution: [root1, root2]
      }
    } else if (discriminant === 0) {
      const root = -b / (2 * a)
      steps.push({
        title: "Repeated Root",
        content: `x = ${root}`,
        explanation: "The discriminant is zero, so we have one repeated real root.",
        voiceText: `The discriminant is zero, so we have one repeated real root: x = ${root}.`
      })

      return {
        solution: `x = ${root}`,
        steps,
        type: "quadratic",
        exactSolution: [root]
      }
    } else {
      const realPart = -b / (2 * a)
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a)
      
      steps.push({
        title: "Complex Roots",
        content: `x = ${realPart.toFixed(4)} ± ${imaginaryPart.toFixed(4)}i`,
        explanation: "The discriminant is negative, so we have complex roots.",
        voiceText: `The discriminant is negative, so we have complex roots: x equals ${realPart.toFixed(4)} plus or minus ${imaginaryPart.toFixed(4)}i.`
      })

      return {
        solution: `x = ${realPart.toFixed(4)} ± ${imaginaryPart.toFixed(4)}i`,
        steps,
        type: "quadratic"
      }
    }
  }

  function solveSystemOfEquations(eq) {
    const steps = []
    const equations = eq.split(';').map(e => e.trim())
    
    if (equations.length !== 2) return null

    steps.push({
      title: "System of Equations",
      content: equations.join('\n'),
      explanation: "We have a system of two linear equations to solve.",
      voiceText: `System of equations: ${equations[0]} and ${equations[1]}`
    })

    const eq1 = parseEquation(equations[0])
    const eq2 = parseEquation(equations[1])
    
    if (!eq1 || !eq2) return null

    let a1 = 0, b1 = 0, c1 = 0
    let a2 = 0, b2 = 0, c2 = 0

    const left1 = eq1.left
    if (left1.includes('x')) {
      const xMatch = left1.match(/([+-]?\d*)x/)
      a1 = xMatch ? (xMatch[1] === '' ? 1 : xMatch[1] === '-' ? -1 : parseFloat(xMatch[1])) : 0
    }
    if (left1.includes('y')) {
      const yMatch = left1.match(/([+-]?\d*)y/)
      b1 = yMatch ? (yMatch[1] === '' ? 1 : yMatch[1] === '-' ? -1 : parseFloat(yMatch[1])) : 0
    }
    c1 = parseFloat(eq1.right)

    const left2 = eq2.left
    if (left2.includes('x')) {
      const xMatch = left2.match(/([+-]?\d*)x/)
      a2 = xMatch ? (xMatch[1] === '' ? 1 : xMatch[1] === '-' ? -1 : parseFloat(xMatch[1])) : 0
    }
    if (left2.includes('y')) {
      const yMatch = left2.match(/([+-]?\d*)y/)
      b2 = yMatch ? (yMatch[1] === '' ? 1 : yMatch[1] === '-' ? -1 : parseFloat(yMatch[1])) : 0
    }
    c2 = parseFloat(eq2.right)

    steps.push({
      title: "Extract Coefficients",
      content: `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
      explanation: "Identify coefficients for each variable in both equations.",
      voiceText: `Equation one: ${a1}x plus ${b1}y equals ${c1}. Equation two: ${a2}x plus ${b2}y equals ${c2}.`
    })

    const determinant = a1 * b2 - a2 * b1
    
    if (determinant !== 0) {
      const x = (c1 * b2 - c2 * b1) / determinant
      const y = (a1 * c2 - a2 * c1) / determinant

      steps.push({
        title: "Calculate Determinant",
        content: `D = a₁b₂ - a₂b₁ = (${a1})(${b2}) - (${a2})(${b1}) = ${determinant}`,
        explanation: "The determinant helps us check if the system has a unique solution.",
        voiceText: `The determinant is ${determinant}.`
      })

      steps.push({
        title: "Solve for x",
        content: `x = (c₁b₂ - c₂b₁)/D = (${c1}×${b2} - ${c2}×${b1})/${determinant} = ${x.toFixed(4)}`,
        explanation: "Using Cramer's rule to solve for x.",
        voiceText: `Solving for x gives ${x.toFixed(4)}.`
      })

      steps.push({
        title: "Solve for y",
        content: `y = (a₁c₂ - a₂c₁)/D = (${a1}×${c2} - ${a2}×${c1})/${determinant} = ${y.toFixed(4)}`,
        explanation: "Using Cramer's rule to solve for y.",
        voiceText: `Solving for y gives ${y.toFixed(4)}.`
      })

      return {
        solution: `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`,
        steps,
        type: "system",
        exactSolution: { x, y }
      }
    } else {
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
  }

  const solveEquation = async () => {
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
      if (!equation.includes('=')) {
        setError('Equation must contain an equals sign (=)')
        speakText('Equation must contain an equals sign')
        return
      }

      if (equation.includes('/0')) {
        setError('Division by zero is not allowed')
        speakText('Division by zero is not allowed')
        return
      }

      let solver = null
      for (const type of equationTypes) {
        if (type.pattern.test(equation)) {
          solver = type.solver
          break
        }
      }

      if (!solver) {
        solver = solveLinearEquation
      }

      const result = solver(equation)
      if (result) {
        setSolution(result)
        setHistory(prev => [{
          equation,
          solution: result.solution,
          timestamp: new Date().toLocaleTimeString(),
          type: result.type
        }, ...prev.slice(0, 4)])
        speakText(`Solution found. ${result.solution}`)
        // Auto-read first step
        setTimeout(() => {
          if (result.steps[0]) {
            speakText(result.steps[0].voiceText || `${result.steps[0].title}. ${result.steps[0].explanation}`)
          }
        }, 500)
      } else {
        setError('Could not solve this equation. Please check the format.')
        speakText('Could not solve this equation. Please check the format.')
      }
    } catch (err) {
      console.error('Solving error:', err)
      setError('Error solving equation. Please check the format and try again.')
      speakText('Error solving equation. Please check the format and try again.')
    } finally {
      setIsSolving(false)
    }
  }

  const handleExampleClick = (example) => {
    setEquation(example)
    setShowEquationTypes(false)
    speakText(`Example equation: ${example}`)
  }

  const nextStep = () => {
    if (solution && currentStep < solution.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      const nextStepData = solution.steps[currentStep + 1]
      speakText(nextStepData.voiceText || `${nextStepData.title}. ${nextStepData.explanation}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      const prevStepData = solution.steps[currentStep - 1]
      speakText(prevStepData.voiceText || `${prevStepData.title}. ${prevStepData.explanation}`)
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
          <Link 
            to="/topics/algebra" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6366F1',
              textDecoration: 'none',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
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
            Practice solving different types of equations with our interactive step-by-step solver
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          
          {/* Input Section */}
          <div style={{ flex: 2 }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '20px' : '28px',
              border: '1px solid #E2E8F0'
            }}>
              
              {/* Equation Input */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                    Enter Your Equation:
                  </label>
                  <button
                    onClick={clearEquation}
                    style={{ fontSize: '12px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="e.g., 2x + 5 = 13, x^2 - 5x + 6 = 0, 2x + y = 7; x - y = 1"
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                    onKeyPress={(e) => e.key === 'Enter' && solveEquation()}
                  />
                  <button
                    onClick={solveEquation}
                    disabled={isSolving}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      cursor: isSolving ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      opacity: isSolving ? 0.7 : 1
                    }}
                  >
                    {isSolving ? '...' : 'Solve'}
                  </button>
                </div>
                
                {error && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#FEE2E2',
                    borderRadius: '12px',
                    border: '1px solid #FECACA'
                  }}>
                    <p style={{ fontSize: '13px', color: '#991B1B' }}>{error}</p>
                  </div>
                )}
              </div>

              {/* Solution Display */}
              {solution && (
                <div style={{
                  marginBottom: '24px',
                  background: '#ECFDF5',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid #D1FAE5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#065F46' }}>Solution</h3>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: '#10B981',
                      color: 'white'
                    }}>
                      {solution.type}
                    </span>
                    <button
                      onClick={() => speakText(solution.solution)}
                      style={{
                        padding: '6px 12px',
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      🔊 Read Solution
                    </button>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                      fontSize: isMobile ? '18px' : '20px',
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      color: '#065F46'
                    }}>
                      {solution.solution}
                    </div>
                  </div>

                  {/* Step Navigation */}
                  {solution.steps.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        style={{
                          padding: '8px 16px',
                          background: currentStep === 0 ? '#F1F5F9' : '#D1FAE5',
                          color: currentStep === 0 ? '#94A3B8' : '#065F46',
                          border: 'none',
                          borderRadius: '12px',
                          cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ← Previous
                      </button>

                      <div style={{ fontSize: '13px', color: '#047857' }}>
                        Step {currentStep + 1} of {solution.steps.length}
                      </div>

                      <button
                        onClick={nextStep}
                        disabled={currentStep === solution.steps.length - 1}
                        style={{
                          padding: '8px 16px',
                          background: currentStep === solution.steps.length - 1 ? '#F1F5F9' : '#10B981',
                          color: currentStep === solution.steps.length - 1 ? '#94A3B8' : 'white',
                          border: 'none',
                          borderRadius: '12px',
                          cursor: currentStep === solution.steps.length - 1 ? 'not-allowed' : 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}

                  {/* Current Step */}
                  {solution.steps[currentStep] && (
                    <div style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '20px',
                      borderLeft: '4px solid #10B981'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46' }}>
                          {solution.steps[currentStep].title}
                        </h4>
                        <button
                          onClick={() => speakText(solution.steps[currentStep].voiceText || `${solution.steps[currentStep].title}. ${solution.steps[currentStep].explanation}`)}
                          style={{
                            padding: '4px 10px',
                            background: '#D1FAE5',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: '#065F46'
                          }}
                        >
                          🔊 Listen
                        </button>
                      </div>
                      <div style={{
                        fontFamily: 'monospace',
                        background: '#F8FAFC',
                        padding: '12px',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        fontSize: '13px'
                      }}>
                        {solution.steps[currentStep].content}
                      </div>
                      <p style={{ fontSize: '13px', color: '#047857' }}>
                        {solution.steps[currentStep].explanation}
                      </p>
                    </div>
                  )}

                  {/* Progress Dots */}
                  {solution.steps.length > 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '20px'
                    }}>
                      {solution.steps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentStep(index)
                            speakText(solution.steps[index].voiceText || `${solution.steps[index].title}. ${solution.steps[index].explanation}`)
                          }}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: index === currentStep ? '#10B981' : index < currentStep ? '#D1FAE5' : '#E2E8F0',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Equation Types - Collapsible */}
              <div>
                <button
                  onClick={() => setShowEquationTypes(!showEquationTypes)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '16px',
                    background: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>📚 Supported Equation Types & Examples</h3>
                  <span style={{ transform: showEquationTypes ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                
                {showEquationTypes && (
                  <div style={{
                    marginTop: '16px',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '16px'
                  }}>
                    {equationTypes.map((type, index) => (
                      <div key={index} style={{
                        background: '#F8FAFC',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid #E2E8F0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <h4 style={{ fontWeight: '600', color: '#0F172A' }}>{type.name}</h4>
                          <button
                            onClick={() => speakText(type.voiceText)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                          >
                            🔊
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {type.examples.map((example, exIndex) => (
                            <button
                              key={exIndex}
                              onClick={() => handleExampleClick(example)}
                              style={{
                                textAlign: 'left',
                                fontSize: '13px',
                                color: '#6366F1',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 0'
                              }}
                            >
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
            {/* History */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
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
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>{item.timestamp}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: '#E0E7FF',
                          color: '#4338CA'
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

            {/* Tips */}
            <div style={{
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #C7D2FE'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E3A8A', marginBottom: '16px' }}>💡 Solving Tips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E3A8A' }}>
                  <span>•</span>
                  <span>Always include an equals sign (=)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E3A8A' }}>
                  <span>•</span>
                  <span>Use x^2 for quadratic equations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E3A8A' }}>
                  <span>•</span>
                  <span>For systems, separate equations with semicolon (;)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E3A8A' }}>
                  <span>•</span>
                  <span>Use parentheses for complex expressions</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#1E3A8A' }}>
                  <span>•</span>
                  <span>Click examples to automatically fill them</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Section */}
        <div style={{
          marginTop: '32px',
          background: 'white',
          borderRadius: '24px',
          padding: isMobile ? '20px' : '24px',
          border: '1px solid #E2E8F0'
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
              { problem: "3x - 7 = 14", difficulty: "Easy" },
              { problem: "x^2 - 5x + 6 = 0", difficulty: "Medium" },
              { problem: "2(x + 3) = 16", difficulty: "Easy" },
              { problem: "2x + y = 7; x - y = 1", difficulty: "Hard" }
            ].map((item, index) => (
              <div key={index} style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: '#0F172A',
                  marginBottom: '8px'
                }}>
                  {item.problem}
                </div>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  background: item.difficulty === 'Easy' ? '#DCFCE7' : item.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                  color: item.difficulty === 'Easy' ? '#166534' : item.difficulty === 'Medium' ? '#92400E' : '#991B1B'
                }}>
                  {item.difficulty}
                </span>
                <button
                  onClick={() => handleExampleClick(item.problem)}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '8px',
                    background: '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
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