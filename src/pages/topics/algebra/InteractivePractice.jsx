import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function InteractivePractice() {
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
      type: 'linear',
      difficulty: 'beginner',
      problem: "Solve for x: 2x + 7 = 15",
      hint: "Try isolating x by first subtracting 7 from both sides, then dividing by 2.",
      stepByStep: [
        "Step 1: Subtract 7 from both sides\n2x + 7 - 7 = 15 - 7\n2x = 8",
        "Step 2: Divide both sides by 2\n2x ÷ 2 = 8 ÷ 2\nx = 4"
      ],
      answer: "4",
      explanation: "The solution is x = 4. You can verify by substituting back: 2(4) + 7 = 8 + 7 = 15 ✓",
      voiceText: "Problem one. Solve for x: two x plus seven equals fifteen. Hint: Isolate x by first subtracting seven from both sides, then divide by two. The solution is x equals four. You can verify by substituting back: two times four plus seven equals eight plus seven equals fifteen."
    },
    {
      id: 2,
      type: 'linear',
      difficulty: 'beginner',
      problem: "Find x: 3(x - 4) = 9",
      hint: "First distribute the 3, then isolate x by adding 12 to both sides and dividing by 3.",
      stepByStep: [
        "Step 1: Distribute the 3\n3 × x - 3 × 4 = 9\n3x - 12 = 9",
        "Step 2: Add 12 to both sides\n3x - 12 + 12 = 9 + 12\n3x = 21",
        "Step 3: Divide both sides by 3\n3x ÷ 3 = 21 ÷ 3\nx = 7"
      ],
      answer: "7",
      explanation: "The solution is x = 7. Check: 3(7 - 4) = 3(3) = 9 ✓",
      voiceText: "Problem two. Find x: three times open parenthesis x minus four close parenthesis equals nine. First distribute the three, then isolate x. The solution is x equals seven."
    },
    {
      id: 3,
      type: 'quadratic',
      difficulty: 'intermediate',
      problem: "Solve: x² - 5x + 6 = 0",
      hint: "This quadratic can be factored. Look for two numbers that multiply to 6 and add to -5.",
      stepByStep: [
        "Step 1: Factor the quadratic\nWe need numbers that multiply to 6 and add to -5\nThese are -2 and -3\n(x - 2)(x - 3) = 0",
        "Step 2: Apply zero product property\nx - 2 = 0 or x - 3 = 0",
        "Step 3: Solve each equation\nx = 2 or x = 3"
      ],
      answer: "2,3",
      explanation: "The solutions are x = 2 and x = 3. Both satisfy the original equation.",
      voiceText: "Problem three. Solve: x squared minus five x plus six equals zero. This quadratic can be factored. The solutions are x equals two and x equals three."
    },
    {
      id: 4,
      type: 'system',
      difficulty: 'intermediate',
      problem: "Solve the system: 2x + y = 10 and x - y = 2",
      hint: "Try adding the two equations together to eliminate y.",
      stepByStep: [
        "Step 1: Add the equations\n(2x + y) + (x - y) = 10 + 2\n3x = 12",
        "Step 2: Solve for x\n3x = 12\nx = 4",
        "Step 3: Substitute x = 4 into second equation\n4 - y = 2\n-y = 2 - 4\n-y = -2\ny = 2"
      ],
      answer: "4,2",
      explanation: "The solution is x = 4, y = 2. Check: 2(4) + 2 = 10 and 4 - 2 = 2 ✓",
      voiceText: "Problem four. Solve the system: two x plus y equals ten and x minus y equals two. Add the equations to eliminate y. The solution is x equals four, y equals two."
    },
    {
      id: 5,
      type: 'rational',
      difficulty: 'advanced',
      problem: "Solve: (x + 3)/(x - 1) = 2",
      hint: "Start by cross-multiplying, then solve the resulting linear equation.",
      stepByStep: [
        "Step 1: Cross multiply\nx + 3 = 2(x - 1)",
        "Step 2: Distribute the 2\nx + 3 = 2x - 2",
        "Step 3: Move variables to one side\nx - 2x = -2 - 3\n-x = -5",
        "Step 4: Solve for x\nx = 5"
      ],
      answer: "5",
      explanation: "The solution is x = 5. Check: (5 + 3)/(5 - 1) = 8/4 = 2 ✓",
      voiceText: "Problem five. Solve: x plus three over x minus one equals two. Cross multiply to get x plus three equals two times open parenthesis x minus one close parenthesis. The solution is x equals five."
    },
    {
      id: 6,
      type: 'quadratic',
      difficulty: 'advanced',
      problem: "Solve using quadratic formula: 2x² - 4x - 6 = 0",
      hint: "Use the quadratic formula: x = [-b ± √(b² - 4ac)] / 2a",
      stepByStep: [
        "Step 1: Identify coefficients\na = 2, b = -4, c = -6",
        "Step 2: Calculate discriminant\nD = b² - 4ac = (-4)² - 4(2)(-6) = 16 + 48 = 64",
        "Step 3: Apply quadratic formula\nx = [4 ± √64] / 4\nx = [4 ± 8] / 4",
        "Step 4: Calculate both solutions\nx = (4 + 8)/4 = 12/4 = 3\nx = (4 - 8)/4 = -4/4 = -1"
      ],
      answer: "3,-1",
      explanation: "The solutions are x = 3 and x = -1. Both satisfy the original equation.",
      voiceText: "Problem six. Solve using quadratic formula: two x squared minus four x minus six equals zero. The solutions are x equals three and x equals negative one."
    },
    {
      id: 7,
      type: 'word',
      difficulty: 'intermediate',
      problem: "The sum of two numbers is 25, and their difference is 7. Find the numbers.",
      hint: "Let the numbers be x and y. Set up two equations: x + y = 25 and x - y = 7.",
      stepByStep: [
        "Step 1: Set up equations\nLet the numbers be x and y\nx + y = 25\nx - y = 7",
        "Step 2: Add the equations\n(x + y) + (x - y) = 25 + 7\n2x = 32",
        "Step 3: Solve for x\n2x = 32\nx = 16",
        "Step 4: Find y\n16 + y = 25\ny = 25 - 16\ny = 9"
      ],
      answer: "16,9",
      explanation: "The numbers are 16 and 9. Check: 16 + 9 = 25 and 16 - 9 = 7 ✓",
      voiceText: "Problem seven. Word problem: The sum of two numbers is twenty-five, and their difference is seven. Find the numbers. The numbers are sixteen and nine."
    },
    {
      id: 8,
      type: 'inequality',
      difficulty: 'intermediate',
      problem: "Solve the inequality: 3x - 8 < 7",
      hint: "Solve it like a regular equation, but remember the inequality direction.",
      stepByStep: [
        "Step 1: Add 8 to both sides\n3x - 8 + 8 < 7 + 8\n3x < 15",
        "Step 2: Divide both sides by 3\n3x ÷ 3 < 15 ÷ 3\nx < 5"
      ],
      answer: "x<5",
      explanation: "The solution is x < 5. This means x can be any number less than 5.",
      voiceText: "Problem eight. Solve the inequality: three x minus eight is less than seven. Add eight to both sides to get three x is less than fifteen. Divide by three to get x is less than five."
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
    const savedHistory = JSON.parse(localStorage.getItem('algebraPracticeHistory')) || []
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
      timestamp: new Date().toLocaleString(),
      difficulty: problem.difficulty,
      type: problem.type
    }
    const updatedHistory = [historyItem, ...practiceHistory.slice(0, 9)]
    setPracticeHistory(updatedHistory)
    localStorage.setItem('algebraPracticeHistory', JSON.stringify(updatedHistory))
  }

  const checkAnswer = () => {
    const current = practiceProblems[currentProblem]
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s/g, '')
    const normalizedCorrectAnswer = current.answer.toLowerCase().replace(/\s/g, '')
    
    const correct = normalizedUserAnswer === normalizedCorrectAnswer
    
    setIsCorrect(correct)
    
    if (correct) {
      setShowCelebration(true)
      speakText(`Correct! ${current.explanation}`)
      setTimeout(() => setShowCelebration(false), 2000)
    } else {
      speakText(`Not quite right. ${current.hint}`)
    }
    
    saveToHistory(current, userAnswer, correct)
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
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'linear': return '📈'
      case 'quadratic': return '🔄'
      case 'system': return '⚖️'
      case 'rational': return '➗'
      case 'word': return '📝'
      case 'inequality': return '⚡'
      default: return '❓'
    }
  }

  const currentProblemData = practiceProblems[currentProblem]

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
          <Link to="/topics/algebra" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6366F1',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Algebra
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            🎯 Interactive Practice
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
                      background: currentProblemData.difficulty === 'beginner' ? '#DCFCE7' : currentProblemData.difficulty === 'intermediate' ? '#FEF3C7' : '#FEE2E2',
                      color: currentProblemData.difficulty === 'beginner' ? '#166534' : currentProblemData.difficulty === 'intermediate' ? '#92400E' : '#991B1B'
                    }}>
                      {currentProblemData.difficulty}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
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
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                textAlign: 'center',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontFamily: 'monospace',
                  color: '#0F172A',
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
                    color: '#334155',
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
                      border: '2px solid #C7D2FE',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      textAlign: 'center',
                      fontFamily: 'monospace'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#C7D2FE'}
                  />
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                    💡 For multiple answers, use commas (e.g., 2,3)
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
                  background: '#EEF2FF',
                  border: '1px solid #6366F1'
                }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '24px' }}>📖</div>
                    <h3 style={{ fontWeight: '700', color: '#1E3A8A' }}>Step-by-Step Solution</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentProblemData.stepByStep.map((step, index) => (
                      <div key={index} style={{
                        padding: '12px',
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #C7D2FE'
                      }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            background: '#6366F1',
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
                            color: '#1E3A8A',
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
                      background: '#6366F1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    Practice Next Problem →
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
                {practiceProblems.map((problem, index) => (
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
                      border: currentProblem === index ? '2px solid #6366F1' : '1px solid #E2E8F0',
                      background: currentProblem === index ? '#EEF2FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{getTypeIcon(problem.type)}</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: currentProblem === index ? '#6366F1' : '#64748B' }}>
                      {index + 1}
                    </div>
                  </button>
                ))}
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
                      localStorage.removeItem('algebraPracticeHistory')
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
                          <p style={{ fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>{item.problem}</p>
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
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: '20px',
              padding: '20px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>🚀 Pro Tips</h3>
              <ul style={{ fontSize: '13px', opacity: 0.95, listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>🎯</span> Try solving without hints first
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📚</span> Review step-by-step solutions
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>💪</span> Practice regularly
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>🌟</span> Celebrate every correct answer!
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