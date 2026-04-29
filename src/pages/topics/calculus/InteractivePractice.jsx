import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function CalculusInteractivePractice() {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [practiceHistory, setPracticeHistory] = useState([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const speechSynth = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const practiceProblems = [
    {
      id: 1,
      type: 'limits',
      difficulty: 'beginner',
      problem: "Find the limit: lim(x→2) (x² - 4)/(x - 2)",
      hint: "Factor the numerator as a difference of squares, then cancel common factors.",
      stepByStep: [
        "Step 1: Factor the numerator: x² - 4 = (x - 2)(x + 2)",
        "Step 2: Rewrite the expression: [(x - 2)(x + 2)]/(x - 2)",
        "Step 3: Cancel (x - 2): x + 2",
        "Step 4: Substitute x = 2: 2 + 2 = 4"
      ],
      answer: "4",
      explanation: "The limit equals 4. After factoring and canceling, we get x + 2, and plugging in x = 2 gives 4.",
      voiceText: "Find the limit as x approaches 2 of x squared minus 4 over x minus 2."
    },
    {
      id: 2,
      type: 'derivatives',
      difficulty: 'beginner',
      problem: "Find the derivative: f(x) = 5x³",
      hint: "Use the power rule: multiply by the exponent, then subtract 1 from the exponent.",
      stepByStep: [
        "Step 1: Identify the power rule: d/dx (xⁿ) = n·xⁿ⁻¹",
        "Step 2: Apply to x³: d/dx (x³) = 3x²",
        "Step 3: Multiply by the coefficient 5: 5 × 3x² = 15x²"
      ],
      answer: "15x^2",
      explanation: "f'(x) = 15x². The derivative of 5x³ is 5 × 3x² = 15x².",
      voiceText: "Find the derivative of f of x equals 5x cubed."
    },
    {
      id: 3,
      type: 'derivatives',
      difficulty: 'intermediate',
      problem: "Find the derivative: f(x) = (2x + 1)⁴",
      hint: "Use the chain rule: derivative of outer × derivative of inner.",
      stepByStep: [
        "Step 1: Identify outer and inner functions: outer = u⁴, inner = u = 2x + 1",
        "Step 2: Derivative of outer: d/du (u⁴) = 4u³ = 4(2x + 1)³",
        "Step 3: Derivative of inner: d/dx (2x + 1) = 2",
        "Step 4: Multiply: f'(x) = 4(2x + 1)³ × 2 = 8(2x + 1)³"
      ],
      answer: "8(2x+1)^3",
      explanation: "f'(x) = 8(2x + 1)³. Using chain rule: 4(2x + 1)³ × 2 = 8(2x + 1)³.",
      voiceText: "Find the derivative of f of x equals 2x plus 1 to the fourth power."
    },
    {
      id: 4,
      type: 'derivatives',
      difficulty: 'intermediate',
      problem: "Find the derivative: f(x) = x²·cos(x)",
      hint: "Use the product rule: u'·v + u·v'",
      stepByStep: [
        "Step 1: Let u = x² and v = cos(x)",
        "Step 2: Find u' = 2x and v' = -sin(x)",
        "Step 3: Apply product rule: f'(x) = u'·v + u·v'",
        "Step 4: Substitute: f'(x) = (2x)(cos x) + (x²)(-sin x)",
        "Step 5: Simplify: f'(x) = 2x cos x - x² sin x"
      ],
      answer: "2x cos(x) - x^2 sin(x)",
      explanation: "f'(x) = 2x cos x - x² sin x. Using product rule with u = x², v = cos x.",
      voiceText: "Find the derivative of f of x equals x squared times cosine of x."
    },
    {
      id: 5,
      type: 'integration',
      difficulty: 'beginner',
      problem: "Find the antiderivative: ∫ 6x⁵ dx",
      hint: "Use the power rule for integration: add 1 to exponent, divide by new exponent.",
      stepByStep: [
        "Step 1: Power rule: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
        "Step 2: Apply to x⁵: ∫ x⁵ dx = x⁶/6",
        "Step 3: Multiply by coefficient 6: 6 × (x⁶/6) = x⁶",
        "Step 4: Add constant of integration: x⁶ + C"
      ],
      answer: "x^6 + C",
      explanation: "∫ 6x⁵ dx = x⁶ + C. The antiderivative of 6x⁵ is x⁶ plus the constant of integration C.",
      voiceText: "Find the antiderivative of 6x to the fifth dx."
    },
    {
      id: 6,
      type: 'integration',
      difficulty: 'intermediate',
      problem: "Evaluate the definite integral: ∫₀² 4x dx",
      hint: "Find the antiderivative, then evaluate at upper minus lower limit.",
      stepByStep: [
        "Step 1: Find antiderivative: ∫ 4x dx = 4·(x²/2) = 2x²",
        "Step 2: Evaluate at upper limit x=2: F(2) = 2(2)² = 2(4) = 8",
        "Step 3: Evaluate at lower limit x=0: F(0) = 2(0)² = 0",
        "Step 4: Subtract: ∫₀² 4x dx = F(2) - F(0) = 8 - 0 = 8"
      ],
      answer: "8",
      explanation: "The definite integral equals 8. ∫₀² 4x dx = [2x²]₀² = 8 - 0 = 8.",
      voiceText: "Evaluate the definite integral from 0 to 2 of 4x dx."
    },
    {
      id: 7,
      type: 'applications',
      difficulty: 'intermediate',
      problem: "Find the slope of f(x) = x² at x = 3",
      hint: "The slope is the derivative evaluated at the given point.",
      stepByStep: [
        "Step 1: Find the derivative: f'(x) = 2x",
        "Step 2: Substitute x = 3: f'(3) = 2(3) = 6"
      ],
      answer: "6",
      explanation: "The slope at x = 3 is 6. The derivative f'(x) = 2x gives the slope at any point x.",
      voiceText: "Find the slope of f of x equals x squared at x equals 3."
    },
    {
      id: 8,
      type: 'limits',
      difficulty: 'advanced',
      problem: "Find the limit: lim(x→∞) (3x² + 2x)/(5x² - 4)",
      hint: "Divide numerator and denominator by the highest power of x (x²).",
      stepByStep: [
        "Step 1: Divide numerator and denominator by x²: (3 + 2/x)/(5 - 4/x²)",
        "Step 2: As x → ∞, 2/x → 0 and 4/x² → 0",
        "Step 3: The limit becomes: 3/5"
      ],
      answer: "3/5",
      explanation: "lim(x→∞) (3x² + 2x)/(5x² - 4) = 3/5. When x approaches infinity, the limit equals the ratio of the leading coefficients.",
      voiceText: "Find the limit as x approaches infinity of 3x squared plus 2x over 5x squared minus 4."
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

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('calculusPracticeHistory')) || []
    setPracticeHistory(savedHistory)
    return () => stopSpeech()
  }, [stopSpeech])

  const saveToHistory = (problem, userAnswer, correct) => {
    const historyItem = {
      id: Date.now(),
      problem: problem.problem,
      userAnswer,
      correctAnswer: problem.answer,
      correct,
      timestamp: new Date().toLocaleTimeString(),
      difficulty: problem.difficulty,
      type: problem.type
    }
    const updatedHistory = [historyItem, ...practiceHistory.slice(0, 9)]
    setPracticeHistory(updatedHistory)
    localStorage.setItem('calculusPracticeHistory', JSON.stringify(updatedHistory))
  }

  const checkAnswer = () => {
    const current = practiceProblems[currentProblem]
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s/g, '')
    const normalizedCorrectAnswer = current.answer.toLowerCase().replace(/\s/g, '')
    
    const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer
    
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      setShowCelebration(true)
      speakText(`Correct! ${current.explanation}`)
      setTimeout(() => setShowCelebration(false), 2000)
    } else {
      speakText(`Not quite right. ${current.hint}`)
    }
    
    saveToHistory(current, userAnswer, isAnswerCorrect)
  }

  const handleNextProblem = () => {
    stopSpeech()
    setCurrentProblem(prev => (prev + 1) % practiceProblems.length)
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
    speakText(`Moving to problem ${(currentProblem + 2) % practiceProblems.length + 1}. ${practiceProblems[(currentProblem + 1) % practiceProblems.length].problem}`)
  }

  const handleShowHint = () => {
    setShowHint(true)
    speakText(`Hint: ${practiceProblems[currentProblem].hint}`)
  }

  const handleShowSolution = () => {
    setShowSolution(true)
    speakText(`Here's the solution. ${practiceProblems[currentProblem].explanation}`)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' }
      case 'intermediate': return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' }
      case 'advanced': return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' }
      default: return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' }
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'limits': return '📈'
      case 'derivatives': return '📊'
      case 'integration': return '∫'
      case 'applications': return '🎯'
      default: return '❓'
    }
  }

  const currentProblemData = practiceProblems[currentProblem]
  const difficultyColors = getDifficultyColor(currentProblemData.difficulty)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Celebration Animation */}
        {showCelebration && (
          <div style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '80px', animation: 'bounce 0.5s ease-in-out' }}>🎉</div>
          </div>
        )}

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
            🔄 Interactive Practice
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Hands-on practice problems with hints and step-by-step solutions
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          
          {/* Main Practice Area */}
          <div style={{ flex: 3 }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '20px' : '24px',
              border: '1px solid #E2E8F0',
              marginBottom: '24px'
            }}>
              
              {/* Problem Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                    Practice Problem
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: difficultyColors.bg,
                      color: difficultyColors.text
                    }}>
                      {currentProblemData.difficulty}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: '#FEE2E2',
                      color: '#DC2626'
                    }}>
                      {getTypeIcon(currentProblemData.type)} {currentProblemData.type}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      Problem {currentProblem + 1} of {practiceProblems.length}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => isPlaying ? stopSpeech() : speakText(currentProblemData.voiceText)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: isPlaying ? '#EF4444' : '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <span>{isPlaying ? '🔊' : '🔈'}</span>
                  <span>{isPlaying ? 'Playing...' : 'Read Problem'}</span>
                </button>
              </div>

              {/* Problem Display */}
              <div style={{
                background: '#FEE2E2',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                textAlign: 'center',
                border: '1px solid #FECACA'
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontFamily: 'monospace',
                  color: '#991B1B',
                  marginBottom: '24px',
                  fontWeight: '600'
                }}>
                  {currentProblemData.problem}
                </div>
                
                {/* Answer Input */}
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#7F1D1D',
                    marginBottom: '12px'
                  }}>
                    Enter your answer:
                  </label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      border: '2px solid #FECACA',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      textAlign: 'center',
                      fontFamily: 'monospace'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#EF4444'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#FECACA'}
                  />
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                    💡 Use ^ for exponents (e.g., x^2)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: !userAnswer.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    opacity: !userAnswer.trim() ? 0.5 : 1
                  }}
                >
                  🎯 Check Answer
                </button>
                
                <button
                  onClick={handleShowHint}
                  disabled={showHint}
                  style={{
                    padding: '12px 24px',
                    background: showHint ? '#D1D5DB' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: showHint ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  {showHint ? '💡 Hint Shown' : '💡 Get Hint'}
                </button>
                
                <button
                  onClick={handleShowSolution}
                  disabled={showSolution}
                  style={{
                    padding: '12px 24px',
                    background: showSolution ? '#D1D5DB' : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: showSolution ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  {showSolution ? '📖 Solution Shown' : '📖 Show Solution'}
                </button>
              </div>

              {/* Answer Feedback */}
              {isCorrect !== null && (
                <div style={{
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  background: isCorrect ? '#D1FAE5' : '#FEE2E2',
                  border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '28px' }}>{isCorrect ? '🎉' : '💡'}</div>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: isCorrect ? '#065F46' : '#991B1B',
                        marginBottom: '8px'
                      }}>
                        {isCorrect ? 'Excellent! You got it right! 🏆' : 'Almost there! Keep trying! 💪'}
                      </h3>
                      <p style={{ color: isCorrect ? '#065F46' : '#991B1B', fontSize: '14px' }}>
                        {currentProblemData.explanation}
                      </p>
                      {isCorrect && (
                        <button
                          onClick={handleNextProblem}
                          style={{
                            marginTop: '16px',
                            padding: '8px 20px',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '13px'
                          }}
                        >
                          Next Challenge →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Hint Section */}
              {showHint && (
                <div style={{
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  background: '#FEF3C7',
                  border: '1px solid #F59E0B'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>💡</div>
                    <div>
                      <h3 style={{ fontWeight: '700', color: '#92400E', marginBottom: '8px' }}>Helpful Hint</h3>
                      <p style={{ color: '#92400E', fontSize: '14px' }}>{currentProblemData.hint}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution Section */}
              {showSolution && (
                <div style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: '#FEE2E2',
                  border: '1px solid #EF4444'
                }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '24px' }}>📖</div>
                    <h3 style={{ fontWeight: '700', color: '#991B1B' }}>Step-by-Step Solution</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentProblemData.stepByStep.map((step, index) => (
                      <div key={index} style={{
                        padding: '12px',
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #FECACA'
                      }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: '#EF4444',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </div>
                          <pre style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#7F1D1D',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            flex: 1
                          }}>
                            {step}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleNextProblem}
                    style={{
                      marginTop: '20px',
                      width: '100%',
                      padding: '12px',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Next Problem →
                  </button>
                </div>
              )}
            </div>

            {/* Problem Navigation */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>
                Practice Problems
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '12px'
              }}>
                {practiceProblems.map((problem, index) => {
                  const colors = getDifficultyColor(problem.difficulty)
                  return (
                    <button
                      key={problem.id}
                      onClick={() => {
                        setCurrentProblem(index)
                        setUserAnswer('')
                        setShowHint(false)
                        setShowSolution(false)
                        setIsCorrect(null)
                        speakText(`Problem ${index + 1}: ${problem.problem}`)
                      }}
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        textAlign: 'center',
                        border: currentProblem === index ? `2px solid #EF4444` : '1px solid #E2E8F0',
                        background: currentProblem === index ? '#FEE2E2' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{getTypeIcon(problem.type)}</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: currentProblem === index ? '#DC2626' : '#64748B' }}>
                        {index + 1}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: 1 }}>
            {/* Recent Activity */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>Recent Practice</h3>
                {practiceHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setPracticeHistory([])
                      localStorage.removeItem('calculusPracticeHistory')
                    }}
                    style={{ fontSize: '11px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {practiceHistory.length > 0 ? (
                  practiceHistory.slice(0, 5).map((item) => (
                    <div key={item.id} style={{
                      padding: '12px',
                      marginBottom: '8px',
                      borderRadius: '12px',
                      background: item.correct ? '#D1FAE5' : '#FEE2E2',
                      border: `1px solid ${item.correct ? '#10B981' : '#EF4444'}`
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '14px' }}>{item.correct ? '✓' : '✗'}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '11px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>{item.problem}</p>
                          <p style={{ fontSize: '10px', color: '#64748B' }}>Your answer: {item.userAnswer}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                    <p style={{ fontSize: '13px', color: '#64748B' }}>No practice history yet</p>
                    <p style={{ fontSize: '11px', color: '#94A3B8' }}>Start solving to see your progress!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              borderRadius: '20px',
              padding: '20px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>🚀 Calculus Tips</h3>
              <ul style={{ fontSize: '13px', opacity: 0.95, listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📈</span> Limits: Factor first
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📊</span> Derivatives: Use power rule
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>∫</span> Integrals: Add + C
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>🎯</span> Practice daily for mastery
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  )
}