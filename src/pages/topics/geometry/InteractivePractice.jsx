import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function GeometryInteractivePractice() {
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
      type: 'area',
      difficulty: 'beginner',
      problem: "Find the area of a rectangle with length 15 m and width 8 m.",
      hint: "Area = length × width",
      stepByStep: [
        "Step 1: Recall the area formula for rectangle: A = l × w",
        "Step 2: Substitute values: l = 15 m, w = 8 m",
        "Step 3: Calculate: 15 × 8 = 120",
        "Step 4: Area = 120 square meters"
      ],
      answer: "120",
      unit: "m²",
      explanation: "Area = length × width = 15 × 8 = 120 square meters",
      voiceText: "Problem 1. Find the area of a rectangle with length 15 meters and width 8 meters."
    },
    {
      id: 2,
      type: 'perimeter',
      difficulty: 'beginner',
      problem: "Find the perimeter of a square with side length 9 cm.",
      hint: "Perimeter = 4 × side",
      stepByStep: [
        "Step 1: Recall the perimeter formula for square: P = 4 × s",
        "Step 2: Substitute values: s = 9 cm",
        "Step 3: Calculate: 4 × 9 = 36",
        "Step 4: Perimeter = 36 centimeters"
      ],
      answer: "36",
      unit: "cm",
      explanation: "Perimeter = 4 × side = 4 × 9 = 36 centimeters",
      voiceText: "Problem 2. Find the perimeter of a square with side length 9 centimeters."
    },
    {
      id: 3,
      type: 'triangle-area',
      difficulty: 'beginner',
      problem: "Find the area of a triangle with base 12 m and height 5 m.",
      hint: "Area = ½ × base × height",
      stepByStep: [
        "Step 1: Recall the area formula for triangle: A = ½ × b × h",
        "Step 2: Substitute values: b = 12 m, h = 5 m",
        "Step 3: Calculate: ½ × 12 = 6, then 6 × 5 = 30",
        "Step 4: Area = 30 square meters"
      ],
      answer: "30",
      unit: "m²",
      explanation: "Area = ½ × base × height = ½ × 12 × 5 = 30 square meters",
      voiceText: "Problem 3. Find the area of a triangle with base 12 meters and height 5 meters."
    },
    {
      id: 4,
      type: 'pythagorean',
      difficulty: 'intermediate',
      problem: "In a right triangle, a = 6 cm, b = 8 cm. Find the hypotenuse c.",
      hint: "Use Pythagorean theorem: a² + b² = c²",
      stepByStep: [
        "Step 1: Recall Pythagorean theorem: a² + b² = c²",
        "Step 2: Substitute values: 6² + 8² = c²",
        "Step 3: Calculate squares: 36 + 64 = 100",
        "Step 4: Take square root: c = √100 = 10"
      ],
      answer: "10",
      unit: "cm",
      explanation: "c = √(6² + 8²) = √(36 + 64) = √100 = 10 centimeters",
      voiceText: "Problem 4. In a right triangle, a equals 6 centimeters, b equals 8 centimeters. Find the hypotenuse c."
    },
    {
      id: 5,
      type: 'circle-circumference',
      difficulty: 'intermediate',
      problem: "Find the circumference of a circle with radius 7 cm. Use π ≈ 3.14.",
      hint: "Circumference = 2πr",
      stepByStep: [
        "Step 1: Recall circumference formula: C = 2πr",
        "Step 2: Substitute values: r = 7 cm, π = 3.14",
        "Step 3: Calculate: 2 × 3.14 = 6.28",
        "Step 4: Multiply: 6.28 × 7 = 43.96"
      ],
      answer: "43.96",
      unit: "cm",
      explanation: "C = 2 × 3.14 × 7 = 43.96 centimeters",
      voiceText: "Problem 5. Find the circumference of a circle with radius 7 centimeters. Use pi as 3.14."
    },
    {
      id: 6,
      type: 'circle-area',
      difficulty: 'intermediate',
      problem: "Find the area of a circle with radius 5 m. Use π ≈ 3.14.",
      hint: "Area = πr²",
      stepByStep: [
        "Step 1: Recall area formula for circle: A = πr²",
        "Step 2: Substitute values: r = 5 m, π = 3.14",
        "Step 3: Square radius: 5² = 25",
        "Step 4: Multiply: 3.14 × 25 = 78.5"
      ],
      answer: "78.5",
      unit: "m²",
      explanation: "A = 3.14 × 5² = 3.14 × 25 = 78.5 square meters",
      voiceText: "Problem 6. Find the area of a circle with radius 5 meters. Use pi as 3.14."
    },
    {
      id: 7,
      type: 'volume',
      difficulty: 'intermediate',
      problem: "Find the volume of a rectangular prism with l = 10 cm, w = 4 cm, h = 3 cm.",
      hint: "Volume = length × width × height",
      stepByStep: [
        "Step 1: Recall volume formula: V = l × w × h",
        "Step 2: Substitute values: l = 10 cm, w = 4 cm, h = 3 cm",
        "Step 3: Calculate: 10 × 4 = 40",
        "Step 4: Multiply: 40 × 3 = 120"
      ],
      answer: "120",
      unit: "cm³",
      explanation: "V = 10 × 4 × 3 = 120 cubic centimeters",
      voiceText: "Problem 7. Find the volume of a rectangular prism with length 10 centimeters, width 4 centimeters, height 3 centimeters."
    },
    {
      id: 8,
      type: 'pythagorean',
      difficulty: 'advanced',
      problem: "A ladder 13 m long reaches a window 12 m high. How far is the foot of the ladder from the wall?",
      hint: "Use Pythagorean theorem: a² + b² = c², where c is the ladder length",
      stepByStep: [
        "Step 1: Identify the right triangle: ladder = hypotenuse (13 m), height = one leg (12 m), distance = other leg (x)",
        "Step 2: Apply Pythagorean theorem: x² + 12² = 13²",
        "Step 3: Calculate squares: x² + 144 = 169",
        "Step 4: Solve for x²: x² = 169 - 144 = 25",
        "Step 5: Take square root: x = √25 = 5"
      ],
      answer: "5",
      unit: "m",
      explanation: "Using Pythagorean theorem: distance = √(13² - 12²) = √(169 - 144) = √25 = 5 meters",
      voiceText: "Problem 8. A ladder 13 meters long reaches a window 12 meters high. How far is the foot of the ladder from the wall?"
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
    const savedHistory = JSON.parse(localStorage.getItem('geometryPracticeHistory')) || []
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
    localStorage.setItem('geometryPracticeHistory', JSON.stringify(updatedHistory))
  }

  const checkAnswer = () => {
    const current = practiceProblems[currentProblem]
    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = current.answer.toLowerCase()
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
    speakText(`Moving to problem ${(currentProblem + 2) % practiceProblems.length + 1}. ${practiceProblems[(currentProblem + 1) % practiceProblems.length].voiceText}`)
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
      case 'area': return '📊'
      case 'perimeter': return '📏'
      case 'triangle-area': return '📐'
      case 'pythagorean': return '🔺'
      case 'circle-circumference': return '⚪'
      case 'circle-area': return '⭕'
      case 'volume': return '📦'
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
          <Link to="/topics/geometry" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#10B981',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Geometry Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10B981, #059669, #047857)',
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
                      background: '#DCFCE7',
                      color: '#166534'
                    }}>
                      {getTypeIcon(currentProblemData.type)} {currentProblemData.type.replace('-', ' ')}
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
                  <span>{isPlaying ? 'Playing...' : 'Read Problem'}</span>
                </button>
              </div>

              {/* Problem Display */}
              <div style={{
                background: '#DCFCE7',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                textAlign: 'center',
                border: '1px solid #86EFAC'
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontFamily: 'monospace',
                  color: '#065F46',
                  marginBottom: '24px',
                  fontWeight: '500'
                }}>
                  {currentProblemData.problem}
                </div>
                
                {/* Answer Input */}
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#065F46',
                    marginBottom: '12px'
                  }}>
                    Enter your answer {currentProblemData.unit && `(in ${currentProblemData.unit})`}:
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
                      border: '2px solid #86EFAC',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      textAlign: 'center',
                      fontFamily: 'monospace'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#86EFAC'}
                  />
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                    💡 Round to 2 decimal places where needed
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
                        border: currentProblem === index ? `2px solid #10B981` : '1px solid #E2E8F0',
                        background: currentProblem === index ? '#DCFCE7' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{getTypeIcon(problem.type)}</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: currentProblem === index ? '#059669' : '#64748B' }}>
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
                      localStorage.removeItem('geometryPracticeHistory')
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
                          <p style={{ fontSize: '11px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>{item.problem.substring(0, 50)}...</p>
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
              background: 'linear-gradient(135deg, #10B981, #059669)',
              borderRadius: '20px',
              padding: '20px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>🚀 Geometry Tips</h3>
              <ul style={{ fontSize: '13px', opacity: 0.95, listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📊</span> Area: length × width
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📏</span> Perimeter: sum of all sides
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>🔺</span> Pythagorean: a² + b² = c²
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>⚪</span> Circle: C = 2πr, A = πr²
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