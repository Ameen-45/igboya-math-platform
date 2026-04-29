import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function StatisticsQuiz() {
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

  const statisticsQuestions = [
    {
      id: 1,
      question: "What is the mean of the dataset: 5, 7, 8, 10, 15?",
      options: ["9", "8", "7.5", "10"],
      correctAnswer: 0,
      explanation: "Step 1: Add all values: 5+7+8+10+15 = 45. Step 2: Divide by number of values: 45 ÷ 5 = 9. The mean is 9.",
      voiceText: "What is the mean of the dataset: 5, 7, 8, 10, 15?"
    },
    {
      id: 2,
      question: "What is the median of: 12, 8, 15, 6, 20?",
      options: ["12", "10", "15", "8"],
      correctAnswer: 0,
      explanation: "Step 1: Arrange in ascending order: 6, 8, 12, 15, 20. Step 2: Middle value is 12. The median is 12.",
      voiceText: "What is the median of: 12, 8, 15, 6, 20?"
    },
    {
      id: 3,
      question: "What is the mode of: 4, 7, 4, 3, 7, 4, 9?",
      options: ["4", "7", "3", "No mode"],
      correctAnswer: 0,
      explanation: "Count frequency: 4 appears 3 times, 7 appears twice, 3 and 9 appear once. The mode is 4.",
      voiceText: "What is the mode of: 4, 7, 4, 3, 7, 4, 9?"
    },
    {
      id: 4,
      question: "Calculate the range: 25, 31, 42, 18, 37",
      options: ["24", "19", "26", "23"],
      correctAnswer: 0,
      explanation: "Maximum = 42, Minimum = 18. Range = 42 - 18 = 24.",
      voiceText: "Calculate the range: 25, 31, 42, 18, 37."
    },
    {
      id: 5,
      question: "What is the probability of rolling an even number on a fair die?",
      options: ["1/2", "1/3", "2/3", "1/6"],
      correctAnswer: 0,
      explanation: "Even numbers: 2,4,6 (3 outcomes). Total outcomes: 6. Probability = 3/6 = 1/2.",
      voiceText: "What is the probability of rolling an even number on a fair die?"
    },
    {
      id: 6,
      question: "Calculate variance for: 2, 4, 6, 8, 10",
      options: ["8", "6", "10", "4"],
      correctAnswer: 0,
      explanation: "Mean = 6. Squared differences: 16,4,0,4,16. Sum = 40. Variance = 40/5 = 8.",
      voiceText: "Calculate variance for: 2, 4, 6, 8, 10."
    },
    {
      id: 7,
      question: "What is the standard deviation if variance is 16?",
      options: ["4", "8", "16", "256"],
      correctAnswer: 0,
      explanation: "Standard deviation = √variance = √16 = 4.",
      voiceText: "What is the standard deviation if variance is 16?"
    },
    {
      id: 8,
      question: "If P(A) = 0.3 and P(B) = 0.4, and A and B are independent, what is P(A and B)?",
      options: ["0.12", "0.7", "0.1", "0.58"],
      correctAnswer: 0,
      explanation: "For independent events: P(A and B) = P(A) × P(B) = 0.3 × 0.4 = 0.12.",
      voiceText: "If P of A equals 0.3 and P of B equals 0.4, and A and B are independent, what is P of A and B?"
    },
    {
      id: 9,
      question: "What is Q1 of: 3, 7, 8, 12, 14, 18, 21, 24?",
      options: ["7.5", "8", "10", "12"],
      correctAnswer: 0,
      explanation: "Lower half: 3,7,8,12. Median of lower half = (7+8)/2 = 7.5.",
      voiceText: "What is the first quartile of: 3, 7, 8, 12, 14, 18, 21, 24?"
    },
    {
      id: 10,
      question: "Calculate z-score for x=85, μ=75, σ=5",
      options: ["2", "1.5", "2.5", "3"],
      correctAnswer: 0,
      explanation: "z = (x - μ)/σ = (85 - 75)/5 = 10/5 = 2.",
      voiceText: "Calculate z-score for x equals 85, mean equals 75, standard deviation equals 5."
    },
    {
      id: 11,
      question: "What is the correlation coefficient range?",
      options: ["-1 to +1", "0 to 1", "-1 to 0", "0 to 100"],
      correctAnswer: 0,
      explanation: "Pearson's correlation coefficient r ranges from -1 to +1.",
      voiceText: "What is the correlation coefficient range?"
    },
    {
      id: 12,
      question: "If P(A) = 0.6, what is P(not A)?",
      options: ["0.4", "0.6", "0.3", "0.5"],
      correctAnswer: 0,
      explanation: "P(not A) = 1 - P(A) = 1 - 0.6 = 0.4.",
      voiceText: "If P of A equals 0.6, what is P of not A?"
    },
    {
      id: 13,
      question: "What is the IQR for: 5, 7, 9, 12, 15, 18, 22?",
      options: ["11", "8", "10", "9"],
      correctAnswer: 0,
      explanation: "Q1 = 7, Q3 = 18. IQR = 18 - 7 = 11.",
      voiceText: "What is the interquartile range for: 5, 7, 9, 12, 15, 18, 22?"
    },
    {
      id: 14,
      question: "In normal distribution, what percentage lies within ±1σ?",
      options: ["68%", "95%", "99.7%", "50%"],
      correctAnswer: 0,
      explanation: "Empirical rule: ±1σ contains 68% of data.",
      voiceText: "In normal distribution, what percentage lies within plus or minus one standard deviation?"
    },
    {
      id: 15,
      question: "Calculate coefficient of variation if μ=50 and σ=10",
      options: ["20%", "25%", "15%", "30%"],
      correctAnswer: 0,
      explanation: "CV = (σ/μ) × 100% = (10/50) × 100% = 20%.",
      voiceText: "Calculate coefficient of variation if mean equals 50 and standard deviation equals 10."
    }
  ]

  const [shuffledQuestions, setShuffledQuestions] = useState([])

  useEffect(() => {
    const shuffled = [...statisticsQuestions].sort(() => Math.random() - 0.5)
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
    const reshuffled = [...statisticsQuestions].sort(() => Math.random() - 0.5)
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
    if (percentage >= 90) return "Outstanding! You're a statistics genius!"
    if (percentage >= 80) return "Excellent work! You've mastered statistics!"
    if (percentage >= 70) return "Great job! You understand statistics well!"
    if (percentage >= 60) return "Good effort! Keep practicing!"
    if (percentage >= 50) return "Not bad! Review the explanations and try again!"
    return "Keep practicing! Every mistake is a learning opportunity. Try again!"
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
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '40px' : '50px',
            margin: '0 auto 24px'
          }}>
            📊
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#0F172A', marginBottom: '12px' }}>
            Statistics Quiz Challenge
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B', marginBottom: '24px' }}>
            Test your statistics knowledge with 15 challenging questions. You have 30 minutes to complete the quiz!
          </p>
          
          <div style={{
            background: '#FEF3C7',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #FDE68A'
          }}>
            <h3 style={{ fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>Quiz Details:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>1</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>15 Questions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>2</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>30 Minutes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>3</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>Multiple Choice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>4</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>Step-by-step Solutions</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setQuizStarted(true)
              speakText("Quiz started! You have 30 minutes. Good luck with your statistics quiz!")
            }}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
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

          <Link to="/topics/statistics" style={{ color: '#D97706', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Statistics Topics
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
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
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
                  background: '#F59E0B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Try Again 🔄
              </button>
              <Link to="/topics/statistics" style={{
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
                          background: '#F59E0B',
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
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>Statistics Quiz</h1>
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
                  background: '#FEF3C7',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: '#D97706',
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
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
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
                      border: `2px solid ${userAnswers[currentQuestion] === optionIndex ? '#F59E0B' : '#E2E8F0'}`,
                      background: userAnswers[currentQuestion] === optionIndex ? '#FEF3C7' : 'white',
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
                        background: userAnswers[currentQuestion] === optionIndex ? '#F59E0B' : '#F1F5F9',
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
                  background: currentQuestion === shuffledQuestions.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #F59E0B, #D97706)',
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
                      background: currentQuestion === index ? '#F59E0B' : userAnswers[index] !== undefined ? '#10B981' : '#F1F5F9',
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
                  <div style={{ width: '12px', height: '12px', background: '#F59E0B', borderRadius: '3px' }}></div>
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