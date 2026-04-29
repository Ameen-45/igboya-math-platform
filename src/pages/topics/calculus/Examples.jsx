import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function CalculusExamples() {
  const [currentExample, setCurrentExample] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const speechSynth = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const examples = [
    {
      title: "Finding Limits",
      type: "limits",
      equation: "lim(x→2) (x² - 4)/(x - 2)",
      voiceText: "Example 1: Finding limits. Limit as x approaches 2 of x squared minus 4 over x minus 2.",
      steps: [
        {
          title: "Step 1: Identify the Problem",
          content: "Find the limit: lim(x→2) (x² - 4)/(x - 2)",
          explanation: "If we simply substitute x=2, we get 0/0 which is indeterminate. We need to simplify first.",
          voiceText: "If we simply substitute x equals 2, we get zero over zero which is indeterminate. We need to simplify first."
        },
        {
          title: "Step 2: Factor the Numerator",
          content: "x² - 4 = (x - 2)(x + 2)",
          explanation: "The numerator is a difference of squares.",
          working: "x² - 4 = (x - 2)(x + 2)",
          voiceText: "Factor the numerator. x squared minus 4 equals x minus 2 times x plus 2."
        },
        {
          title: "Step 3: Cancel Common Factors",
          content: "[(x - 2)(x + 2)]/(x - 2) = x + 2 (for x ≠ 2)",
          explanation: "Cancel the (x - 2) term in numerator and denominator.",
          working: "[(x - 2)(x + 2)]/(x - 2) = x + 2",
          voiceText: "Cancel the common factor x minus 2 in numerator and denominator. The expression simplifies to x plus 2."
        },
        {
          title: "Step 4: Evaluate the Limit",
          content: "lim(x→2) (x + 2) = 2 + 2 = 4",
          explanation: "Now we can substitute x = 2 into the simplified expression.",
          working: "lim(x→2) (x + 2) = 4",
          voiceText: "Now substitute x equals 2 into the simplified expression. x plus 2 gives 2 plus 2 equals 4."
        },
        {
          title: "Final Answer",
          content: "The limit is 4",
          explanation: "lim(x→2) (x² - 4)/(x - 2) = 4",
          voiceText: "The limit is 4.",
          interactive: {
            question: "Find lim(x→3) (x² - 9)/(x - 3)",
            answer: "6",
            hint: "Factor the numerator as a difference of squares, cancel, then substitute.",
            voiceText: "Find the limit as x approaches 3 of x squared minus 9 over x minus 3."
          }
        }
      ]
    },
    {
      title: "Power Rule",
      type: "derivative",
      equation: "f(x) = 3x⁴",
      voiceText: "Example 2: Power Rule. Find the derivative of f of x equals 3x to the fourth.",
      steps: [
        {
          title: "Step 1: Identify the Power Rule",
          content: "The power rule states: d/dx (xⁿ) = n·xⁿ⁻¹",
          explanation: "For f(x) = 3x⁴, we can apply the power rule to the x⁴ term.",
          voiceText: "The power rule states that derivative of x to the n is n times x to the n minus 1."
        },
        {
          title: "Step 2: Apply the Rule",
          content: "d/dx (x⁴) = 4x³",
          explanation: "Bring down the exponent (4) and subtract 1 from the exponent.",
          working: "d/dx (x⁴) = 4x³",
          voiceText: "Bring down the exponent 4 and subtract 1 from the exponent. Derivative of x to the fourth is 4x cubed."
        },
        {
          title: "Step 3: Multiply by the Coefficient",
          content: "f'(x) = 3 × 4x³ = 12x³",
          explanation: "Don't forget the coefficient 3 in front.",
          working: "f'(x) = 12x³",
          voiceText: "Don't forget the coefficient 3. Multiply 3 times 4x cubed to get 12x cubed."
        },
        {
          title: "Final Answer",
          content: "f'(x) = 12x³",
          explanation: "The derivative of f(x) = 3x⁴ is f'(x) = 12x³.",
          voiceText: "The derivative of 3x to the fourth is 12x cubed.",
          interactive: {
            question: "Find the derivative of f(x) = 5x³",
            answer: "15x^2",
            hint: "Apply power rule: multiply by exponent, subtract 1 from exponent.",
            voiceText: "Find the derivative of f of x equals 5x cubed."
          }
        }
      ]
    },
    {
      title: "Product Rule",
      type: "derivative",
      equation: "f(x) = x²·sin(x)",
      voiceText: "Example 3: Product Rule. Find the derivative of f of x equals x squared times sine of x.",
      steps: [
        {
          title: "Step 1: Identify the Product Rule",
          content: "Product Rule: d/dx [u·v] = u'·v + u·v'",
          explanation: "Let u = x² and v = sin(x). Then find u' and v'.",
          voiceText: "The product rule says derivative of u times v equals u prime times v plus u times v prime."
        },
        {
          title: "Step 2: Find Individual Derivatives",
          content: "u = x² → u' = 2x\nv = sin(x) → v' = cos(x)",
          explanation: "Find the derivative of each part separately.",
          working: "u' = 2x, v' = cos(x)",
          voiceText: "Derivative of x squared is 2x. Derivative of sine of x is cosine of x."
        },
        {
          title: "Step 3: Apply Product Rule",
          content: "f'(x) = u'·v + u·v' = (2x)(sin x) + (x²)(cos x)",
          explanation: "Substitute the values into the product rule formula.",
          working: "f'(x) = 2x·sin(x) + x²·cos(x)",
          voiceText: "Applying the product rule: f prime of x equals 2x times sine x plus x squared times cosine x."
        },
        {
          title: "Final Answer",
          content: "f'(x) = 2x sin(x) + x² cos(x)",
          explanation: "The derivative cannot be simplified further.",
          voiceText: "The derivative is 2x sine x plus x squared cosine x.",
          interactive: {
            question: "Find the derivative of f(x) = x·cos(x)",
            answer: "cos(x) - x·sin(x)",
            hint: "Use product rule with u = x, v = cos(x).",
            voiceText: "Find the derivative of f of x equals x times cosine of x."
          }
        }
      ]
    },
    {
      title: "Chain Rule",
      type: "derivative",
      equation: "f(x) = (2x + 1)⁵",
      voiceText: "Example 4: Chain Rule. Find the derivative of f of x equals 2x plus 1 to the fifth power.",
      steps: [
        {
          title: "Step 1: Identify Inner and Outer Functions",
          content: "Outer: u⁵, Inner: u = 2x + 1",
          explanation: "The chain rule is used for composite functions.",
          voiceText: "Identify inner and outer functions. Outer function is u to the fifth. Inner function is u equals 2x plus 1."
        },
        {
          title: "Step 2: Apply Chain Rule",
          content: "Chain Rule: d/dx [f(g(x))] = f'(g(x))·g'(x)",
          explanation: "Derivative of outer times derivative of inner.",
          voiceText: "Chain rule derivative of f of g of x equals f prime of g of x times g prime of x."
        },
        {
          title: "Step 3: Differentiate Outer Function",
          content: "d/du (u⁵) = 5u⁴",
          explanation: "Derivative of outer with respect to inner.",
          working: "5u⁴ = 5(2x + 1)⁴",
          voiceText: "Derivative of outer function u to the fifth is 5 u to the fourth, which is 5 times 2x plus 1 to the fourth."
        },
        {
          title: "Step 4: Multiply by Derivative of Inner",
          content: "d/dx (2x + 1) = 2",
          explanation: "Derivative of inner function.",
          working: "f'(x) = 5(2x + 1)⁴ × 2",
          voiceText: "Derivative of inner function 2x plus 1 is 2. Multiply to get f prime of x equals 10 times 2x plus 1 to the fourth."
        },
        {
          title: "Final Answer",
          content: "f'(x) = 10(2x + 1)⁴",
          explanation: "Simplify by multiplying the constants.",
          voiceText: "The final derivative is 10 times 2x plus 1 to the fourth.",
          interactive: {
            question: "Find the derivative of f(x) = (3x - 2)⁴",
            answer: "12(3x-2)^3",
            hint: "Chain rule: derivative of outer × derivative of inner.",
            voiceText: "Find the derivative of f of x equals 3x minus 2 to the fourth."
          }
        }
      ]
    },
    {
      title: "Finding Antiderivatives",
      type: "integral",
      equation: "∫ 4x³ dx",
      voiceText: "Example 5: Finding Antiderivatives. Find the integral of 4x cubed dx.",
      steps: [
        {
          title: "Step 1: Apply Power Rule for Integration",
          content: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (for n ≠ -1)",
          explanation: "Integration is the reverse of differentiation.",
          voiceText: "The power rule for integration says integral of x to the n dx equals x to the n plus 1 over n plus 1, plus C."
        },
        {
          title: "Step 2: Apply to x³",
          content: "∫ x³ dx = x⁴/4 + C",
          explanation: "Add 1 to exponent, divide by new exponent.",
          working: "∫ x³ dx = x⁴/4",
          voiceText: "Integral of x cubed is x to the fourth over 4."
        },
        {
          title: "Step 3: Multiply by Coefficient",
          content: "∫ 4x³ dx = 4·(x⁴/4) + C = x⁴ + C",
          explanation: "The constant 4 can be factored out.",
          working: "4 × (x⁴/4) = x⁴",
          voiceText: "Multiply 4 times x to the fourth over 4 gives x to the fourth plus C."
        },
        {
          title: "Final Answer",
          content: "∫ 4x³ dx = x⁴ + C",
          explanation: "C is the constant of integration.",
          voiceText: "The antiderivative is x to the fourth plus C.",
          interactive: {
            question: "Find ∫ 6x² dx",
            answer: "2x^3 + C",
            hint: "Add 1 to exponent, divide by new exponent, then multiply by coefficient.",
            voiceText: "Find the integral of 6x squared dx."
          }
        }
      ]
    },
    {
      title: "Area Under a Curve",
      type: "definite integral",
      equation: "∫₁³ x² dx",
      voiceText: "Example 6: Area Under a Curve. Evaluate the definite integral from 1 to 3 of x squared dx.",
      steps: [
        {
          title: "Step 1: Find the Antiderivative",
          content: "∫ x² dx = x³/3",
          explanation: "First find the indefinite integral.",
          working: "F(x) = x³/3",
          voiceText: "First find the antiderivative. Integral of x squared is x cubed over 3."
        },
        {
          title: "Step 2: Apply the Fundamental Theorem",
          content: "∫ₐᵇ f(x) dx = F(b) - F(a)",
          explanation: "Evaluate the antiderivative at the upper and lower limits.",
          voiceText: "The definite integral from a to b equals F of b minus F of a."
        },
        {
          title: "Step 3: Evaluate at Upper Limit (x=3)",
          content: "F(3) = 3³/3 = 27/3 = 9",
          explanation: "Substitute x = 3 into the antiderivative.",
          working: "F(3) = 27/3 = 9",
          voiceText: "At x equals 3, we get 27 over 3 which is 9."
        },
        {
          title: "Step 4: Evaluate at Lower Limit (x=1)",
          content: "F(1) = 1³/3 = 1/3",
          explanation: "Substitute x = 1 into the antiderivative.",
          working: "F(1) = 1/3",
          voiceText: "At x equals 1, we get 1 over 3."
        },
        {
          title: "Step 5: Subtract",
          content: "∫₁³ x² dx = F(3) - F(1) = 9 - 1/3 = 26/3 ≈ 8.67",
          explanation: "The area under the curve from x=1 to x=3 is 26/3 square units.",
          working: "9 - 1/3 = 27/3 - 1/3 = 26/3",
          voiceText: "Subtract: 9 minus 1 third equals 26 thirds, approximately 8 point 6 7 square units.",
          interactive: {
            question: "Evaluate ∫₀² x dx",
            answer: "2",
            hint: "Antiderivative is x²/2. Evaluate at 2 and subtract value at 0.",
            voiceText: "Evaluate the definite integral from 0 to 2 of x dx."
          }
        }
      ]
    }
  ]

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

  const nextStep = () => {
    stopSpeech()
    if (currentStep < examples[currentExample].steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      setTimeout(() => {
        const nextStepData = examples[currentExample].steps[currentStep + 1]
        if (nextStepData) {
          speakText(nextStepData.voiceText || `${nextStepData.title}. ${nextStepData.content} ${nextStepData.explanation || ''}`)
        }
      }, 200)
    }
  }

  const prevStep = () => {
    stopSpeech()
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      setTimeout(() => {
        const prevStepData = examples[currentExample].steps[currentStep - 1]
        if (prevStepData) {
          speakText(prevStepData.voiceText || `${prevStepData.title}. ${prevStepData.content} ${prevStepData.explanation || ''}`)
        }
      }, 200)
    }
  }

  const checkAnswer = () => {
    const currentInteractive = examples[currentExample].steps[currentStep]?.interactive
    if (!currentInteractive) return
    
    const normalizedInput = userInput.trim().toLowerCase().replace(/\s/g, '')
    const normalizedAnswer = currentInteractive.answer.toLowerCase().replace(/\s/g, '')
    const isAnswerCorrect = normalizedInput === normalizedAnswer
    
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      speakText(`Correct! ${currentInteractive.answer} is right. Well done!`)
    } else {
      speakText(`Not quite. ${currentInteractive.hint}`)
    }
  }

  const handleExampleChange = (index) => {
    stopSpeech()
    setCurrentExample(index)
    setCurrentStep(0)
    setUserInput('')
    setShowHint(false)
    setIsCorrect(null)
    setTimeout(() => {
      speakText(`${examples[index].title}. ${examples[index].voiceText || examples[index].equation}`)
    }, 200)
  }

  useEffect(() => {
    setTimeout(() => {
      speakText(`${examples[0].title}. ${examples[0].voiceText}`)
    }, 500)
    return () => stopSpeech()
  }, [])

  const currentExampleData = examples[currentExample]
  const currentStepData = currentExampleData.steps[currentStep]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/topics/calculus" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EF4444',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Calculus Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #EF4444, #DC2626, #B91C1C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Calculus Examples
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Step-by-step examples to master limits, derivatives, and integrals
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          
          {/* Sidebar - Example List */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: isMobile ? '16px' : '20px',
              border: '1px solid #E2E8F0',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>Examples</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleChange(index)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: isMobile ? '12px' : '14px',
                      borderRadius: '14px',
                      border: currentExample === index ? '2px solid #EF4444' : '1px solid #E2E8F0',
                      background: currentExample === index ? '#FEE2E2' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '10px',
                        background: currentExample === index ? '#EF4444' : '#E2E8F0',
                        color: currentExample === index ? 'white' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: currentExample === index ? '#DC2626' : '#0F172A' }}>
                          {example.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {example.steps.length} steps
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 3 }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '20px' : '28px',
              border: '1px solid #E2E8F0'
            }}>
              
              {/* Example Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                    {currentExampleData.title}
                  </h2>
                  <div style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontFamily: 'monospace',
                    color: '#DC2626',
                    fontWeight: '600'
                  }}>
                    {currentExampleData.equation}
                  </div>
                </div>
                
                <button 
                  onClick={() => speakText(currentStepData.voiceText || `${currentStepData.title}. ${currentStepData.content} ${currentStepData.explanation || ''}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: isPlaying ? '#EF4444' : '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <span>{isPlaying ? '🔊' : '🔈'}</span>
                  <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
                </button>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                  <span>Step {currentStep + 1} of {currentExampleData.steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / currentExampleData.steps.length) * 100)}%</span>
                </div>
                <div style={{
                  width: '100%',
                  background: '#E2E8F0',
                  borderRadius: '9999px',
                  height: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((currentStep + 1) / currentExampleData.steps.length) * 100}%`,
                    background: 'linear-gradient(90deg, #EF4444, #DC2626)',
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.5s'
                  }}></div>
                </div>
              </div>

              {/* Current Step Content */}
              <div>
                {/* Step Title and Content */}
                <div style={{
                  background: '#FEE2E2',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  borderLeft: '4px solid #DC2626'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#991B1B', marginBottom: '12px' }}>
                    {currentStepData.title}
                  </h3>
                  <p style={{ color: '#7F1D1D', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {currentStepData.content}
                  </p>
                </div>

                {/* Explanation */}
                {currentStepData.explanation && (
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #F59E0B'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>Explanation:</h4>
                    <p style={{ color: '#78350F', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {currentStepData.explanation}
                    </p>
                  </div>
                )}

                {/* Working */}
                {currentStepData.working && (
                  <div style={{
                    background: '#F3E8FF',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #8B5CF6'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#5B21B6', marginBottom: '8px' }}>Working:</h4>
                    <pre style={{
                      color: '#4C1D95',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      whiteSpace: 'pre-wrap',
                      margin: 0
                    }}>
                      {currentStepData.working}
                    </pre>
                  </div>
                )}

                {/* Interactive Question */}
                {currentStepData.interactive && (
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #F59E0B'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
                      Your Turn! 💡
                    </h4>
                    <p style={{ color: '#92400E', marginBottom: '16px' }}>
                      {currentStepData.interactive.question}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your answer here..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #FDE68A',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#FDE68A'}
                      />
                      
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={checkAnswer}
                          style={{
                            padding: '8px 20px',
                            background: '#F59E0B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '13px'
                          }}
                        >
                          Check Answer
                        </button>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          style={{
                            padding: '8px 20px',
                            background: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #FDE68A',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '13px'
                          }}
                        >
                          {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                      </div>

                      {showHint && (
                        <div style={{
                          background: '#FEF3C7',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #FDE68A'
                        }}>
                          <p style={{ fontSize: '13px', color: '#92400E' }}>💡 {currentStepData.interactive.hint}</p>
                        </div>
                      )}

                      {isCorrect !== null && (
                        <div style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: isCorrect ? '#D1FAE5' : '#FEE2E2',
                          border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`
                        }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: isCorrect ? '#065F46' : '#991B1B' }}>
                            {isCorrect ? '✅ Correct! Well done!' : '❌ Not quite. Try again!'}
                          </p>
                          {!isCorrect && (
                            <p style={{ fontSize: '12px', marginTop: '4px', color: '#991B1B' }}>
                              Hint: {currentStepData.interactive.answer}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Motivational Messages */}
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  {currentStep === currentExampleData.steps.length - 1 ? (
                    <div style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      borderRadius: '16px',
                      padding: '16px',
                      color: 'white'
                    }}>
                      <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎉 Amazing! You completed this example!</p>
                      <p style={{ fontSize: '13px', opacity: 0.9 }}>Ready to try another one?</p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#64748B', fontStyle: 'italic' }}>
                      {currentStep === 0 ? "Ready to begin our calculus journey? 🔥" :
                       currentStep < currentExampleData.steps.length - 2 ? "Great progress! Keep going! 💪" :
                       "Almost there! You're doing fantastic! 🌟"}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #E2E8F0',
                gap: '12px'
              }}>
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: currentStep === 0 ? '#F1F5F9' : 'white',
                    color: currentStep === 0 ? '#94A3B8' : '#64748B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={currentStep === currentExampleData.steps.length - 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: currentStep === currentExampleData.steps.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: currentStep === currentExampleData.steps.length - 1 ? '#94A3B8' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: currentStep === currentExampleData.steps.length - 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Example Navigation Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              {currentExampleData.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index)
                    setUserInput('')
                    setShowHint(false)
                    setIsCorrect(null)
                    speakText(currentExampleData.steps[index].voiceText || `${currentExampleData.steps[index].title}`)
                  }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentStep ? '#EF4444' : index < currentStep ? '#10B981' : '#E2E8F0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}