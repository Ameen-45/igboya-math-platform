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
  const speakTimer = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ============================================================
     10 VERIFIED PRACTICE PROBLEMS
     ============================================================ */
  const practiceProblems = [
    {
      id: 1,
      type: 'linear',
      difficulty: 'beginner',
      problem: "Solve for x: 2x + 7 = 15",
      hint: "Isolate x by subtracting 7 from both sides, then divide by 2.",
      stepByStep: [
        "Step 1: Subtract 7 from both sides\n2x + 7 - 7 = 15 - 7\n2x = 8",
        "Step 2: Divide both sides by 2\n2x ÷ 2 = 8 ÷ 2\nx = 4"
      ],
      answer: "4",
      explanation: "x = 4. Verify: 2(4) + 7 = 15 ✓",
      voiceText: "Problem one. Solve for x: two x plus seven equals fifteen."
    },
    {
      id: 2,
      type: 'linear',
      difficulty: 'beginner',
      problem: "Solve for y: 3y - 7 = 14",
      hint: "Add 7 to both sides, then divide by 3.",
      stepByStep: [
        "Step 1: Add 7 to both sides\n3y - 7 + 7 = 14 + 7\n3y = 21",
        "Step 2: Divide both sides by 3\n3y ÷ 3 = 21 ÷ 3\ny = 7"
      ],
      answer: "7",
      explanation: "y = 7. Verify: 3(7) - 7 = 14 ✓",
      voiceText: "Problem two. Solve for y: three y minus seven equals fourteen."
    },
    {
      id: 3,
      type: 'linear',
      difficulty: 'beginner',
      problem: "Find x: 3(x - 4) = 9",
      hint: "Distribute the 3 first, then isolate x.",
      stepByStep: [
        "Step 1: Distribute the 3\n3x - 12 = 9",
        "Step 2: Add 12 to both sides\n3x = 21",
        "Step 3: Divide by 3\nx = 7"
      ],
      answer: "7",
      explanation: "x = 7. Verify: 3(7 - 4) = 3(3) = 9 ✓",
      voiceText: "Problem three. Find x: three times x minus four equals nine."
    },
    {
      id: 4,
      type: 'quadratic',
      difficulty: 'intermediate',
      problem: "Solve: x² - 5x + 6 = 0",
      hint: "Factor. Find two numbers that multiply to 6 and add to -5.",
      stepByStep: [
        "Step 1: Factor\n(x - 2)(x - 3) = 0",
        "Step 2: Apply zero product rule\nx - 2 = 0 or x - 3 = 0",
        "Step 3: Solve\nx = 2 or x = 3"
      ],
      answer: "2,3",
      explanation: "x = 2 or x = 3. Both satisfy the equation.",
      voiceText: "Problem four. Solve: x squared minus five x plus six equals zero."
    },
    {
      id: 5,
      type: 'system',
      difficulty: 'intermediate',
      problem: "Solve the system: 2x + y = 10 and x - y = 2",
      hint: "Add the two equations to eliminate y.",
      stepByStep: [
        "Step 1: Add the equations\n3x = 12",
        "Step 2: Solve for x\nx = 4",
        "Step 3: Substitute x = 4 into x - y = 2\n4 - y = 2\ny = 2"
      ],
      answer: "x=4,y=2",
      explanation: "x = 4, y = 2. Check: 2(4) + 2 = 10 ✓ and 4 - 2 = 2 ✓",
      voiceText: "Problem five. Solve the system: two x plus y equals ten and x minus y equals two."
    },
    {
      id: 6,
      type: 'rational',
      difficulty: 'intermediate',
      problem: "Solve: (x + 3)/(x - 1) = 2",
      hint: "Cross-multiply, then solve the resulting linear equation.",
      stepByStep: [
        "Step 1: Cross multiply\nx + 3 = 2(x - 1)",
        "Step 2: Distribute\nx + 3 = 2x - 2",
        "Step 3: Move terms\n-x = -5",
        "Step 4: Solve\nx = 5"
      ],
      answer: "5",
      explanation: "x = 5. Verify: (5 + 3)/(5 - 1) = 8/4 = 2 ✓",
      voiceText: "Problem six. Solve: x plus three over x minus one equals two."
    },
    {
      id: 7,
      type: 'quadratic',
      difficulty: 'advanced',
      problem: "Solve using quadratic formula: 2x² - 4x - 6 = 0",
      hint: "Use x = [-b ± √(b² - 4ac)] / 2a with a=2, b=-4, c=-6",
      stepByStep: [
        "Step 1: Identify coefficients\na = 2, b = -4, c = -6",
        "Step 2: Discriminant\nD = (-4)² - 4(2)(-6) = 16 + 48 = 64",
        "Step 3: Apply formula\nx = [4 ± 8] / 4",
        "Step 4: Two solutions\nx = 3 or x = -1"
      ],
      answer: "3,-1",
      explanation: "x = 3 or x = -1. Both satisfy the equation.",
      voiceText: "Problem seven. Solve using quadratic formula: two x squared minus four x minus six equals zero."
    },
    {
      id: 8,
      type: 'word',
      difficulty: 'intermediate',
      problem: "The sum of two numbers is 25, and their difference is 7. Find the two numbers.",
      hint: "Set up: x + y = 25 and x - y = 7. Add the equations.",
      stepByStep: [
        "Step 1: Write the system\nx + y = 25\nx - y = 7",
        "Step 2: Add the equations\n2x = 32",
        "Step 3: Solve for x\nx = 16",
        "Step 4: Find y\n16 + y = 25 → y = 9"
      ],
      answer: "16,9",
      explanation: "The two numbers are 16 and 9. Check: 16 + 9 = 25 and 16 - 9 = 7 ✓",
      voiceText: "Problem eight. Word problem: The sum of two numbers is twenty-five, and their difference is seven. Find the numbers."
    },
    {
      id: 9,
      type: 'inequality',
      difficulty: 'intermediate',
      problem: "Solve the inequality: 3x - 8 < 7",
      hint: "Solve like an equation. The inequality sign stays the same when dividing by a positive number.",
      stepByStep: [
        "Step 1: Add 8 to both sides\n3x < 15",
        "Step 2: Divide both sides by 3\nx < 5"
      ],
      answer: "x<5",
      explanation: "x < 5. Any number less than 5 satisfies the inequality.",
      voiceText: "Problem nine. Solve the inequality: three x minus eight is less than seven."
    },
    {
      id: 10,
      type: 'quadratic',
      difficulty: 'advanced',
      problem: "Solve by completing the square: x² + 6x + 5 = 0",
      hint: "Move the constant, add (b/2)² to both sides, then take the square root.",
      stepByStep: [
        "Step 1: Move constant\nx² + 6x = -5",
        "Step 2: Add (6/2)² = 9 to both sides\nx² + 6x + 9 = 4",
        "Step 3: Write as perfect square\n(x + 3)² = 4",
        "Step 4: Take square root\nx + 3 = ±2",
        "Step 5: Solve\nx = -1 or x = -5"
      ],
      answer: "-1,-5",
      explanation: "x = -1 or x = -5. Check: (-1)² + 6(-1) + 5 = 1 - 6 + 5 = 0 ✓",
      voiceText: "Problem ten. Solve by completing the square: x squared plus six x plus five equals zero."
    }
  ]

  /* ============================================================
     LENIENT ANSWER MATCHING
     Accepts:
       "5", "x=5", "x = 5"
       "2,3" or "3,2"
       "x=4,y=2" or "y=2,x=4" or "4,2"
       "x<5" or "x < 5"
     ============================================================ */
  const normalizeToken = (str) => {
    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[×*]/g, '')
  }

  const extractValues = (str) => {
    // Remove variable letters and equals signs, keep only numbers and signs
    const cleaned = normalizeToken(str)
      .replace(/[a-z]/g, '')
      .replace(/=/g, ',')
      .replace(/or/g, ',')
      .replace(/and/g, ',')
      .replace(/;/g, ',')
    // Split on commas
    const parts = cleaned.split(',').filter(Boolean)
    // Further split on "x=" style leftovers
    const values = []
    for (const p of parts) {
      if (p === '') continue
      values.push(p)
    }
    return values.sort()
  }

  const answersMatch = (userAns, correctAns) => {
    const uNorm = normalizeToken(userAns)
    const cNorm = normalizeToken(correctAns)

    // Direct match
    if (uNorm === cNorm) return true

    // Inequality match (e.g., "x<5" vs "x<5")
    if (cNorm.includes('<') || cNorm.includes('>')) {
      const uIneq = uNorm.replace(/[a-z]/g, '')
      const cIneq = cNorm.replace(/[a-z]/g, '')
      return uIneq === cIneq
    }

    // Multi-value match (order-independent)
    const uVals = extractValues(userAns)
    const cVals = extractValues(correctAns)

    if (uVals.length === 0 || cVals.length === 0) return false
    if (uVals.length !== cVals.length) return false

    return uVals.every((v, i) => v === cVals[i])
  }

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
     HISTORY
     ============================================================ */
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

  /* ============================================================
     HANDLERS
     ============================================================ */
  const checkAnswer = () => {
    const current = practiceProblems[currentProblem]
    const correct = answersMatch(userAnswer, current.answer)

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
    const nextIdx = (currentProblem + 1) % practiceProblems.length
    setCurrentProblem(nextIdx)
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
    speakText(`Problem ${nextIdx + 1}. ${practiceProblems[nextIdx].problem}`)
  }

  const handleTryAgain = () => {
    setUserAnswer('')
    setIsCorrect(null)
    stopSpeech()
  }

  const handleShowHint = () => {
    setShowHint(true)
    speakText(`Hint: ${practiceProblems[currentProblem].hint}`)
  }

  const handleShowSolution = () => {
    setShowSolution(true)
    const stepsText = practiceProblems[currentProblem].stepByStep.join('. ')
    speakText(`Here is the solution. ${stepsText}`)
  }

  const handleSelectProblem = (index) => {
    setCurrentProblem(index)
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
    speakText(`Problem ${index + 1}. ${practiceProblems[index].problem}`)
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

  const difficultyColors = (difficulty) => {
    if (difficulty === 'beginner') return { bg: '#DCFCE7', text: '#166534' }
    if (difficulty === 'intermediate') return { bg: '#FEF3C7', text: '#92400E' }
    return { bg: '#FEE2E2', text: '#991B1B' }
  }

  const currentProblemData = practiceProblems[currentProblem]
  const dColors = difficultyColors(currentProblemData.difficulty)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Celebration */}
        {showCelebration && (
          <div style={{
            position: 'fixed', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 50, pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '80px', animation: 'bounce 0.5s ease-in-out' }}>🎉</div>
          </div>
        )}

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/topics/algebra" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#6366F1', textDecoration: 'none', marginBottom: '16px', fontSize: '14px'
          }}>
            ← Back to Algebra
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px', fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            🎯 Interactive Practice
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            10 practice problems with hints and step-by-step solutions
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>

          {/* Main */}
          <div style={{ flex: 3 }}>
            <div style={{
              background: 'white', borderRadius: '24px',
              padding: isMobile ? '20px' : '24px',
              border: '1px solid #E2E8F0', marginBottom: '24px'
            }}>

              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '20px',
                flexWrap: 'wrap', gap: '16px'
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                    Practice Problem
                  </h2>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                      fontWeight: '500', background: dColors.bg, color: dColors.text
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
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px',
                    background: isPlaying ? '#EF4444' : '#6366F1',
                    color: 'white', border: 'none', borderRadius: '12px',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '500'
                  }}>
                  <span>{isPlaying ? '🔊' : '🔈'}</span>
                  <span>{isPlaying ? 'Playing...' : 'Read Problem'}</span>
                </button>
              </div>

              {/* Problem */}
              <div style={{
                background: '#F8FAFC', borderRadius: '16px',
                padding: '32px', marginBottom: '24px',
                textAlign: 'center', border: '1px solid #E2E8F0'
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontFamily: 'monospace', color: '#0F172A',
                  marginBottom: '24px', fontWeight: '500'
                }}>
                  {currentProblemData.problem}
                </div>

                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <label style={{
                    display: 'block', fontSize: '13px', fontWeight: '500',
                    color: '#334155', marginBottom: '12px'
                  }}>
                    Enter your answer:
                  </label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="e.g., 5  or  x=5  or  4,2"
                    onKeyPress={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
                    style={{
                      width: '100%', padding: '14px 20px',
                      border: '2px solid #C7D2FE', borderRadius: '16px',
                      fontSize: '16px', outline: 'none',
                      textAlign: 'center', fontFamily: 'monospace'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#C7D2FE'}
                  />
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                    💡 Accepted formats: <strong>5</strong>, <strong>x=5</strong>, <strong>2,3</strong>, <strong>x=4,y=2</strong>, <strong>x&lt;5</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '12px',
                justifyContent: 'center', marginBottom: '24px'
              }}>
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white', border: 'none', borderRadius: '14px',
                    cursor: !userAnswer.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: '600', fontSize: '14px',
                    opacity: !userAnswer.trim() ? 0.5 : 1
                  }}>
                  🎯 Check Answer
                </button>
                <button
                  onClick={handleShowHint}
                  disabled={showHint}
                  style={{
                    padding: '12px 24px',
                    background: showHint ? '#D1D5DB' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white', border: 'none', borderRadius: '14px',
                    cursor: showHint ? 'not-allowed' : 'pointer',
                    fontWeight: '600', fontSize: '14px'
                  }}>
                  {showHint ? '💡 Hint Shown' : '💡 Get Hint'}
                </button>
                <button
                  onClick={handleShowSolution}
                  disabled={showSolution}
                  style={{
                    padding: '12px 24px',
                    background: showSolution ? '#D1D5DB' : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    color: 'white', border: 'none', borderRadius: '14px',
                    cursor: showSolution ? 'not-allowed' : 'pointer',
                    fontWeight: '600', fontSize: '14px'
                  }}>
                  {showSolution ? '📖 Solution Shown' : '📖 Show Solution'}
                </button>
              </div>

              {/* Feedback */}
              {isCorrect !== null && (
                <div style={{
                  padding: '20px', borderRadius: '16px', marginBottom: '20px',
                  background: isCorrect ? '#D1FAE5' : '#FEE2E2',
                  border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '28px' }}>{isCorrect ? '🎉' : '💡'}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '16px', fontWeight: '700',
                        color: isCorrect ? '#065F46' : '#991B1B', marginBottom: '8px'
                      }}>
                        {isCorrect ? 'Excellent! You got it right! 🏆' : 'Almost there! Keep trying! 💪'}
                      </h3>
                      <p style={{ color: isCorrect ? '#065F46' : '#991B1B', fontSize: '14px' }}>
                        {currentProblemData.explanation}
                      </p>
                      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {isCorrect ? (
                          <button onClick={handleNextProblem}
                            style={{
                              padding: '8px 20px', background: '#10B981',
                              color: 'white', border: 'none', borderRadius: '12px',
                              cursor: 'pointer', fontWeight: '500', fontSize: '13px'
                            }}>
                            Next Challenge →
                          </button>
                        ) : (
                          <>
                            <button onClick={handleTryAgain}
                              style={{
                                padding: '8px 20px', background: '#EF4444',
                                color: 'white', border: 'none', borderRadius: '12px',
                                cursor: 'pointer', fontWeight: '500', fontSize: '13px'
                              }}>
                              🔄 Try Again
                            </button>
                            <button onClick={handleShowHint}
                              style={{
                                padding: '8px 20px', background: '#F59E0B',
                                color: 'white', border: 'none', borderRadius: '12px',
                                cursor: 'pointer', fontWeight: '500', fontSize: '13px'
                              }}>
                              💡 Show Hint
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hint */}
              {showHint && (
                <div style={{
                  padding: '20px', borderRadius: '16px', marginBottom: '20px',
                  background: '#FEF3C7', border: '1px solid #F59E0B'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>💡</div>
                    <div>
                      <h3 style={{ fontWeight: '700', color: '#92400E', marginBottom: '8px' }}>
                        Helpful Hint
                      </h3>
                      <p style={{ color: '#92400E', fontSize: '14px' }}>
                        {currentProblemData.hint}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Solution */}
              {showSolution && (
                <div style={{
                  padding: '20px', borderRadius: '16px',
                  background: '#EEF2FF', border: '1px solid #6366F1'
                }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '24px' }}>📖</div>
                    <h3 style={{ fontWeight: '700', color: '#1E3A8A' }}>
                      Step-by-Step Solution
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentProblemData.stepByStep.map((step, index) => (
                      <div key={index} style={{
                        padding: '12px', background: 'white',
                        borderRadius: '12px', border: '1px solid #C7D2FE'
                      }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{
                            width: '24px', height: '24px', background: '#6366F1',
                            borderRadius: '12px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '12px', fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </div>
                          <pre style={{
                            margin: 0, fontSize: '13px', color: '#1E3A8A',
                            whiteSpace: 'pre-wrap', fontFamily: 'inherit', flex: 1
                          }}>
                            {step}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: '16px', padding: '12px',
                    background: '#D1FAE5', borderRadius: '12px',
                    border: '1px solid #10B981'
                  }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#065F46' }}>
                      ✅ Final Answer: {currentProblemData.answer}
                    </p>
                  </div>
                  <button onClick={handleNextProblem}
                    style={{
                      marginTop: '20px', width: '100%', padding: '12px',
                      background: '#6366F1', color: 'white', border: 'none',
                      borderRadius: '12px', cursor: 'pointer',
                      fontWeight: '600', fontSize: '14px'
                    }}>
                    Practice Next Problem →
                  </button>
                </div>
              )}
            </div>

            {/* Problem Navigation */}
            <div style={{
              background: 'white', borderRadius: '20px',
              padding: '20px', border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>
                Practice Problems ({practiceProblems.length})
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '12px'
              }}>
                {practiceProblems.map((problem, index) => (
                  <button key={problem.id}
                    onClick={() => handleSelectProblem(index)}
                    style={{
                      padding: '12px', borderRadius: '14px', textAlign: 'center',
                      border: currentProblem === index ? '2px solid #6366F1' : '1px solid #E2E8F0',
                      background: currentProblem === index ? '#EEF2FF' : 'white',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                      {getTypeIcon(problem.type)}
                    </div>
                    <div style={{
                      fontSize: '12px', fontWeight: '600',
                      color: currentProblem === index ? '#6366F1' : '#64748B'
                    }}>
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white', borderRadius: '20px',
              padding: '20px', border: '1px solid #E2E8F0', marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                  Recent Practice
                </h3>
                {practiceHistory.length > 0 && (
                  <button
                    onClick={() => {
                      setPracticeHistory([])
                      localStorage.removeItem('algebraPracticeHistory')
                    }}
                    style={{
                      fontSize: '11px', color: '#94A3B8',
                      background: 'none', border: 'none', cursor: 'pointer'
                    }}>
                    Clear
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {practiceHistory.length > 0 ? (
                  practiceHistory.slice(0, 5).map((item) => (
                    <div key={item.id} style={{
                      padding: '12px', marginBottom: '8px', borderRadius: '12px',
                      background: item.correct ? '#D1FAE5' : '#FEE2E2',
                      border: `1px solid ${item.correct ? '#10B981' : '#EF4444'}`
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '14px' }}>{item.correct ? '✓' : '✗'}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: '500', color: '#1E293B', marginBottom: '4px' }}>
                            {item.problem}
                          </p>
                          <p style={{ fontSize: '10px', color: '#64748B' }}>
                            Your answer: {item.userAnswer}
                          </p>
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

            <div style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: '20px', padding: '20px', color: 'white'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                🚀 Pro Tips
              </h3>
              <ul style={{ fontSize: '13px', opacity: 0.95, listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>🎯</span> Try solving without hints first
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>📚</span> Review step-by-step solutions
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>💪</span> Practice regularly for mastery
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <span>✍️</span> Multiple answers? Use commas
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