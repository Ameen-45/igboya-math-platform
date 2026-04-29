import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function TrigonometryQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800)
  const [quizStarted, setQuizStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(null)
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

  const trigonometryQuestions = [
    {
      id: 1,
      question: "In a right triangle, if the opposite side is 3 and the hypotenuse is 5, what is sin(θ)?",
      options: ["3/5", "4/5", "5/3", "3/4"],
      correctAnswer: 0,
      explanation: "sin(θ) = opposite/hypotenuse = 3/5 = 0.6",
      voiceText: "In a right triangle, opposite side is 3, hypotenuse is 5. What is sine of theta?"
    },
    {
      id: 2,
      question: "What is cos(60°)?",
      options: ["1/2", "√3/2", "√2/2", "1"],
      correctAnswer: 0,
      explanation: "cos(60°) = 1/2 = 0.5. This is a standard trigonometric value.",
      voiceText: "What is cosine of 60 degrees?"
    },
    {
      id: 3,
      question: "If tan(θ) = 1, what is the value of θ in degrees?",
      options: ["45°", "30°", "60°", "90°"],
      correctAnswer: 0,
      explanation: "tan(θ) = 1 when θ = 45° because in a 45-45-90 triangle, opposite = adjacent.",
      voiceText: "If tangent theta equals 1, what is theta in degrees?"
    },
    {
      id: 4,
      question: "What is the value of sin(90°)?",
      options: ["1", "0", "√3/2", "1/2"],
      correctAnswer: 0,
      explanation: "sin(90°) = 1. At 90°, the point on unit circle is (0,1).",
      voiceText: "What is sine of 90 degrees?"
    },
    {
      id: 5,
      question: "What is the amplitude of y = 3cos(x) + 2?",
      options: ["3", "2", "5", "1"],
      correctAnswer: 0,
      explanation: "Amplitude = |3| = 3. The +2 only affects vertical shift.",
      voiceText: "What is the amplitude of y equals 3 cosine x plus 2?"
    },
    {
      id: 6,
      question: "What is the period of y = sin(2x)?",
      options: ["π", "2π", "π/2", "4π"],
      correctAnswer: 0,
      explanation: "Period = 2π/|B| = 2π/2 = π",
      voiceText: "What is the period of y equals sine of 2x?"
    },
    {
      id: 7,
      question: "If cos(θ) = 0.6 and θ is acute, what is sin(θ)?",
      options: ["0.8", "0.4", "0.6", "1.0"],
      correctAnswer: 0,
      explanation: "sin²θ + cos²θ = 1, so sin²θ = 1 - 0.36 = 0.64, sinθ = 0.8",
      voiceText: "If cosine theta equals 0.6 and theta is acute, what is sine theta?"
    }
  ]

  const [shuffledQuestions, setShuffledQuestions] = useState([])

  useEffect(() => {
    const shuffled = [...trigonometryQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  useEffect(() => {
    if (!quizStarted || timeLeft <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, timeLeft, showResults])

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
    const question = shuffledQuestions[questionIndex]
    speakText(`You selected option ${String.fromCharCode(65 + optionIndex)}: ${question.options[optionIndex]}`)
  }

  const handleSubmit = () => {
    setShowResults(true)
    stopSpeech()
    const score = calculateScore()
    speakText(`Quiz completed! You scored ${score} out of ${shuffledQuestions.length}. ${getResultMessage()}`)
  }

  const handleRetry = () => {
    const reshuffled = [...trigonometryQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(reshuffled)
    setUserAnswers({})
    setShowResults(false)
    setCurrentQuestion(0)
    setTimeLeft(1800)
    setQuizStarted(false)
    setShowExplanation(null)
    stopSpeech()
  }

  const calculateScore = () => {
    let correct = 0
    shuffledQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const score = calculateScore()
  const percentage = Math.round((score / shuffledQuestions.length) * 100)

  const getResultMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a trigonometry master!"
    if (percentage >= 80) return "Excellent work! You've mastered trigonometric concepts!"
    if (percentage >= 70) return "Great job! You understand trigonometry well!"
    if (percentage >= 60) return "Good effort! Keep practicing trigonometric ratios!"
    if (percentage >= 50) return "Not bad! Review the explanations and try again!"
    return "Keep practicing! Every triangle you solve makes you better. Try again!"
  }

  const getResultColor = () => {
    if (percentage >= 70) return '#10B981'
    if (percentage >= 50) return '#F59E0B'
    return '#EF4444'
  }

  const readQuestion = () => {
    const q = shuffledQuestions[currentQuestion]
    speakText(`Question ${currentQuestion + 1}: ${q.question}. Options: A: ${q.options[0]}, B: ${q.options[1]}, C: ${q.options[2]}, D: ${q.options[3]}`)
  }

  if (!quizStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          background: 'white',
          borderRadius: '32px',
          padding: isMobile ? '32px 24px' : '48px',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: isMobile ? '80px' : '100px',
            height: isMobile ? '80px' : '100px',
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '40px' : '50px',
            margin: '0 auto 24px'
          }}>
            📐
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#0F172A', marginBottom: '12px' }}>
            Trigonometry Quiz Challenge
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B', marginBottom: '24px' }}>
            Test your trigonometry knowledge with challenging questions. You have 30 minutes to complete the quiz!
          </p>
          
          <div style={{
            background: '#FEE2E2',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #FECACA'
          }}>
            <h3 style={{ fontWeight: '600', color: '#991B1B', marginBottom: '12px' }}>Quiz Details:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>1</div>
                <span style={{ fontSize: '13px', color: '#991B1B' }}>7 Questions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>2</div>
                <span style={{ fontSize: '13px', color: '#991B1B' }}>30 Minutes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>3</div>
                <span style={{ fontSize: '13px', color: '#991B1B' }}>Multiple Choice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>4</div>
                <span style={{ fontSize: '13px', color: '#991B1B' }}>Step-by-step Solutions</span>
              </div>
            </div>
          </div>

          <div style={{
            background: '#FEE2E2',
            borderRadius: '20px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid #FECACA'
          }}>
            <h4 style={{ fontWeight: '600', color: '#991B1B', marginBottom: '8px', fontSize: '13px' }}>Topics Covered:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '12px', color: '#7F1D1D' }}>
              <span>• Trigonometric Ratios</span>
              <span>• Unit Circle</span>
              <span>• Sine & Cosine Rules</span>
              <span>• Identities</span>
              <span>• Graphs</span>
              <span>• Applications</span>
            </div>
          </div>

          <button
            onClick={() => {
              setQuizStarted(true)
              speakText("Quiz started! You have 30 minutes. Good luck with your trigonometry quiz!")
            }}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            Start Quiz Now 🚀
          </button>

          <Link to="/topics/trigonometry" style={{ color: '#DC2626', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Trigonometry Topics
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        padding: isMobile ? '16px' : '24px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '32px',
            padding: isMobile ? '24px' : '32px',
            marginBottom: '24px',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>
              {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
              Quiz Completed!
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '20px' }}>
              {getResultMessage()}
            </p>

            <div style={{
              background: '#F8FAFC',
              borderRadius: '20px',
              padding: '20px',
              maxWidth: '300px',
              margin: '0 auto 20px'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#DC2626', marginBottom: '4px' }}>
                {score}/{shuffledQuestions.length}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>
                {percentage}%
              </div>
              <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  width: `${percentage}%`,
                  background: getResultColor(),
                  height: '100%',
                  borderRadius: '9999px',
                  transition: 'width 1s'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleRetry}
                style={{
                  padding: '12px 24px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Try Again 🔄
              </button>
              <Link to="/topics/trigonometry" style={{
                padding: '12px 24px',
                background: '#64748B',
                color: 'white',
                borderRadius: '16px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Back to Topics
              </Link>
            </div>
          </div>

          {/* Review Section */}
          <div style={{
            background: 'white',
            borderRadius: '32px',
            padding: isMobile ? '20px' : '28px',
            border: '1px solid #E2E8F0'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '20px', textAlign: 'center' }}>
              Review Your Answers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {shuffledQuestions.map((question, index) => {
                const isCorrect = userAnswers[index] === question.correctAnswer
                return (
                  <div key={index} style={{
                    padding: '20px',
                    borderRadius: '20px',
                    background: isCorrect ? '#DCFCE7' : '#FEE2E2',
                    border: `1px solid ${isCorrect ? '#86EFAC' : '#FECACA'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: '700', fontSize: '14px' }}>Question {index + 1}</span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '500',
                        background: isCorrect ? '#10B981' : '#EF4444',
                        color: 'white'
                      }}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '16px', fontWeight: '500', color: '#0F172A', marginBottom: '16px' }}>
                      {question.question}
                    </p>

                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontWeight: '600', color: '#475569', marginBottom: '8px', fontSize: '13px' }}>Your answer:</p>
                      <div style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: isCorrect ? '#D1FAE5' : '#FEE2E2',
                        border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`
                      }}>
                        {userAnswers[index] !== undefined ? question.options[userAnswers[index]] : 'Not answered'}
                      </div>
                    </div>

                    {!isCorrect && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontWeight: '600', color: '#10B981', marginBottom: '8px', fontSize: '13px' }}>Correct answer:</p>
                        <div style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: '#D1FAE5',
                          border: '1px solid #10B981'
                        }}>
                          {question.options[question.correctAnswer]}
                        </div>
                      </div>
                    )}

                    <div>
                      <button
                        onClick={() => {
                          if (showExplanation === index) {
                            setShowExplanation(null)
                            stopSpeech()
                          } else {
                            setShowExplanation(index)
                            speakText(question.explanation)
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#DC2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          marginBottom: '12px'
                        }}
                      >
                        {showExplanation === index ? 'Hide Solution' : 'Show Step-by-Step Solution'}
                      </button>
                      
                      {showExplanation === index && (
                        <div style={{
                          background: '#FEF3C7',
                          borderRadius: '16px',
                          padding: '16px',
                          border: '1px solid #FDE68A'
                        }}>
                          <h4 style={{ fontWeight: '700', color: '#92400E', marginBottom: '12px' }}>Step-by-Step Solution:</h4>
                          <pre style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#92400E',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            lineHeight: '1.6'
                          }}>
                            {question.explanation}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = shuffledQuestions[currentQuestion]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>Trigonometry Quiz</h1>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#FEE2E2',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#DC2626'
              }}>
                ⏱️ {formatTime(timeLeft)}
              </div>
              <button
                onClick={readQuestion}
                style={{
                  padding: '6px 12px',
                  background: '#FEE2E2',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#DC2626',
                  fontWeight: '500'
                }}
              >
                🔊 Read Question
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: '8px 16px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '13px'
                }}
              >
                Submit Quiz
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '9999px', height: '6px', marginTop: '12px' }}>
            <div style={{
              width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%`,
              background: 'linear-gradient(90deg, #EF4444, #DC2626)',
              height: '100%',
              borderRadius: '9999px',
              transition: 'width 0.3s'
            }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
          
          {/* Question Section */}
          <div style={{ flex: 3 }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '20px' : '28px',
              border: '1px solid #E2E8F0'
            }}>
              <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#0F172A', marginBottom: '24px' }}>
                {currentQ?.question}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentQ?.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px',
                      borderRadius: '16px',
                      border: `2px solid ${userAnswers[currentQuestion] === optionIndex ? '#DC2626' : '#E2E8F0'}`,
                      background: userAnswers[currentQuestion] === optionIndex ? '#FEE2E2' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        background: userAnswers[currentQuestion] === optionIndex ? '#DC2626' : '#F1F5F9',
                        color: userAnswers[currentQuestion] === optionIndex ? 'white' : '#64748B'
                      }}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <span style={{ fontSize: '15px', color: '#0F172A' }}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', gap: '12px' }}>
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                style={{
                  padding: '12px 20px',
                  background: currentQuestion === 0 ? '#F1F5F9' : 'white',
                  color: currentQuestion === 0 ? '#94A3B8' : '#64748B',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                ← Previous
              </button>

              <button
                onClick={() => setCurrentQuestion(prev => Math.min(shuffledQuestions.length - 1, prev + 1))}
                disabled={currentQuestion === shuffledQuestions.length - 1}
                style={{
                  padding: '12px 20px',
                  background: currentQuestion === shuffledQuestions.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: currentQuestion === shuffledQuestions.length - 1 ? '#94A3B8' : 'white',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: currentQuestion === shuffledQuestions.length - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Question Navigator */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>Questions</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px'
              }}>
                {shuffledQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '500',
                      background: currentQuestion === index ? '#DC2626' : userAnswers[index] !== undefined ? '#10B981' : '#F1F5F9',
                      color: currentQuestion === index || userAnswers[index] !== undefined ? 'white' : '#64748B',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#DC2626', borderRadius: '3px' }}></div>
                  <span>Current</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '3px' }}></div>
                  <span>Answered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#F1F5F9', borderRadius: '3px', border: '1px solid #E2E8F0' }}></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}