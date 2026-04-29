import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function TrigonometryInteractivePractice() {
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
      type: 'right-triangle',
      difficulty: 'beginner',
      problem: "In a right triangle, the hypotenuse is 13 cm and one angle is 22.6°. Find the length of the side opposite to this angle.",
      hint: "Use sine ratio: sin(angle) = opposite/hypotenuse",
      stepByStep: [
        "Step 1: Identify the trigonometric ratio - we have hypotenuse and need opposite, so use sine",
        "Step 2: Write the equation: sin(22.6°) = opposite/13",
        "Step 3: Solve: opposite = 13 × sin(22.6°)",
        "Step 4: Calculate: sin(22.6°) ≈ 0.3846, so opposite ≈ 13 × 0.3846 = 5 cm"
      ],
      answer: "5",
      unit: "cm",
      explanation: "The opposite side is approximately 5 cm. Using sine ratio: sin(22.6°) = 0.3846, times 13 equals 5.",
      voiceText: "Problem 1. In a right triangle, hypotenuse is 13 centimeters, angle is 22.6 degrees. Find the opposite side."
    },
    {
      id: 2,
      type: 'application',
      difficulty: 'beginner',
      problem: "A person standing 50 meters away from a tree measures the angle of elevation to the top of the tree as 30°. How tall is the tree?",
      hint: "Use tangent ratio: tan(angle) = opposite/adjacent",
      stepByStep: [
        "Step 1: Identify the right triangle - adjacent = 50m, angle = 30°, need opposite (tree height)",
        "Step 2: Use tangent: tan(30°) = height/50",
        "Step 3: Solve: height = 50 × tan(30°)",
        "Step 4: Calculate: tan(30°) = 0.5774, height = 50 × 0.5774 = 28.87 m"
      ],
      answer: "28.87",
      unit: "meters",
      explanation: "The tree is 28.87 meters tall. Using tangent: tan(30°) = 0.5774 × 50 = 28.87.",
      voiceText: "Problem 2. Angle of elevation problem. Person is 50 meters from a tree, angle is 30 degrees. Find tree height."
    },
    {
      id: 3,
      type: 'sine-rule',
      difficulty: 'intermediate',
      problem: "In triangle ABC, angle A = 40°, angle B = 60°, and side a = 8 cm. Find the length of side b.",
      hint: "Use the sine rule: a/sinA = b/sinB",
      stepByStep: [
        "Step 1: Write sine rule: a/sinA = b/sinB",
        "Step 2: Substitute values: 8/sin(40°) = b/sin(60°)",
        "Step 3: Solve for b: b = (8 × sin(60°))/sin(40°)",
        "Step 4: Calculate: sin(60°)=0.8660, sin(40°)=0.6428, b = (8×0.8660)/0.6428 = 10.78 cm"
      ],
      answer: "10.78",
      unit: "cm",
      explanation: "Side b is 10.78 cm. Using sine rule: (8 × sin60°)/sin40° = 6.928/0.6428 = 10.78.",
      voiceText: "Problem 3. Sine rule application. Angle A is 40 degrees, angle B is 60 degrees, side a is 8 centimeters. Find side b."
    },
    {
      id: 4,
      type: 'cosine-rule',
      difficulty: 'intermediate',
      problem: "In triangle ABC, sides b = 7 cm, c = 9 cm, and angle A = 50°. Find side a.",
      hint: "Use cosine rule: a² = b² + c² - 2bc·cosA",
      stepByStep: [
        "Step 1: Write cosine rule: a² = b² + c² - 2bc·cosA",
        "Step 2: Substitute: a² = 7² + 9² - 2×7×9×cos(50°)",
        "Step 3: Calculate: 49 + 81 = 130, 2×7×9 = 126, cos(50°) = 0.6428",
        "Step 4: a² = 130 - 126×0.6428 = 130 - 80.99 = 49.01, a = √49.01 = 7.00 cm"
      ],
      answer: "7.00",
      unit: "cm",
      explanation: "Side a is 7.00 cm. Using cosine rule: a² = 49 + 81 - 126×0.6428 = 49.01, a = 7.00.",
      voiceText: "Problem 4. Cosine rule application. Sides b and c are 7 and 9 centimeters, angle A is 50 degrees. Find side a."
    },
    {
      id: 5,
      type: 'identity',
      difficulty: 'intermediate',
      problem: "If sin(θ) = 3/5 and θ is in the first quadrant, find cos(θ) and tan(θ).",
      hint: "Use Pythagorean identity: sin²θ + cos²θ = 1, then tanθ = sinθ/cosθ",
      stepByStep: [
        "Step 1: Use identity: sin²θ + cos²θ = 1",
        "Step 2: (3/5)² + cos²θ = 1 → 9/25 + cos²θ = 1",
        "Step 3: cos²θ = 1 - 9/25 = 16/25, cosθ = 4/5 (positive in first quadrant)",
        "Step 4: tanθ = sinθ/cosθ = (3/5)/(4/5) = 3/4"
      ],
      answer: "cos=0.8, tan=0.75",
      alternativeAnswers: ["cos=4/5, tan=3/4", "0.8,0.75"],
      unit: "",
      explanation: "cosθ = 4/5 = 0.8, tanθ = 3/4 = 0.75. Using Pythagorean identity.",
      voiceText: "Problem 5. If sine theta equals 3/5 in first quadrant, find cosine and tangent theta."
    },
    {
      id: 6,
      type: 'area',
      difficulty: 'intermediate',
      problem: "Find the area of a triangle with sides 8 cm and 10 cm, and the included angle between them is 60°.",
      hint: "Area = ½ × a × b × sin(C)",
      stepByStep: [
        "Step 1: Area formula: Area = ½ × a × b × sin(C)",
        "Step 2: Substitute: Area = ½ × 8 × 10 × sin(60°)",
        "Step 3: ½ × 8 × 10 = 40, sin(60°) = 0.8660",
        "Step 4: Area = 40 × 0.8660 = 34.64 cm²"
      ],
      answer: "34.64",
      unit: "cm²",
      explanation: "Area is 34.64 cm². Using formula: ½ × 8 × 10 × sin60° = 40 × 0.8660 = 34.64.",
      voiceText: "Problem 6. Find area of triangle with sides 8 and 10 centimeters, included angle 60 degrees."
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
    const savedHistory = JSON.parse(localStorage.getItem('trigonometryPracticeHistory')) || []
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
    localStorage.setItem('trigonometryPracticeHistory', JSON.stringify(updatedHistory))
  }

  const checkAnswer = () => {
    const current = practiceProblems[currentProblem]
    let normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s/g, '')
    let normalizedCorrectAnswer = current.answer.toLowerCase().replace(/\s/g, '')
    
    // Handle answers with commas
    if (normalizedCorrectAnswer.includes(',')) {
      const correctParts = normalizedCorrectAnswer.split(',').map(p => p.trim())
      const isAnswerCorrect = correctParts.some(part => normalizedUserAnswer === part)
      setIsCorrect(isAnswerCorrect)
      if (isAnswerCorrect) {
        setShowCelebration(true)
        speakText(`Correct! ${current.explanation}`)
        setTimeout(() => setShowCelebration(false), 2000)
        saveToHistory(current, userAnswer, true)
      } else {
        speakText(`Not quite right. ${current.hint}`)
        saveToHistory(current, userAnswer, false)
      }
      return
    }
    
    // Handle alternative answers
    if (current.alternativeAnswers) {
      const allAnswers = [normalizedCorrectAnswer, ...current.alternativeAnswers.map(a => a.toLowerCase().replace(/\s/g, ''))]
      const isAnswerCorrect = allAnswers.some(a => normalizedUserAnswer === a)
      setIsCorrect(isAnswerCorrect)
      if (isAnswerCorrect) {
        setShowCelebration(true)
        speakText(`Correct! ${current.explanation}`)
        setTimeout(() => setShowCelebration(false), 2000)
        saveToHistory(current, userAnswer, true)
      } else {
        speakText(`Not quite right. ${current.hint}`)
        saveToHistory(current, userAnswer, false)
      }
      return
    }
    
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
      case 'right-triangle': return '📐'
      case 'application': return '🎯'
      case 'sine-rule': return '📏'
      case 'cosine-rule': return '⚖️'
      case 'identity': return 'θ'
      case 'area': return '📊'
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
          <Link to="/topics/trigonometry" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EF4444',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Trigonometry Topics
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
                    color: '#7F1D1D',
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
                      localStorage.removeItem('trigonometryPracticeHistory')
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
                          <p style={{ fontSize: '11px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>{item.problem.substring(0, 40)}...</p>
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
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>🚀 Trigonometry Tips</h3>
              <ul style={{ fontSize: '13px', opacity: 0.95, listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📐</span> Remember SOH-CAH-TOA
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📏</span> Sine Rule: a/sinA = b/sinB
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>⚖️</span> Cosine Rule: a² = b² + c² - 2bc·cosA
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>θ</span> sin²θ + cos²θ = 1
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