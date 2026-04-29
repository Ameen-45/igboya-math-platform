import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function StatisticsInteractivePractice() {
  const [currentDataset, setCurrentDataset] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState('dataset')
  const [practiceMode, setPracticeMode] = useState('guided')
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

  const datasets = [
    {
      id: 1,
      name: "Student Test Scores",
      description: "Mathematics exam scores from a class of 30 students",
      data: [85, 92, 78, 96, 88, 76, 95, 89, 91, 84, 72, 98, 87, 83, 79, 94, 86, 90, 77, 93, 82, 75, 97, 81, 74, 99, 80, 73, 100, 71],
      type: "numerical",
      voiceText: "Dataset 1: Student Test Scores. Mathematics exam scores from a class of 30 students.",
      questions: [
        {
          id: 1,
          question: "What is the mean test score?",
          type: "calculation",
          answer: 85.1,
          tolerance: 0.1,
          hint: "Sum all scores and divide by 30",
          explanation: "Sum all scores: 85+92+78+96+88+76+95+89+91+84+72+98+87+83+79+94+86+90+77+93+82+75+97+81+74+99+80+73+100+71 = 2553. Divide by 30 students: 2553 ÷ 30 = 85.1",
          voiceText: "Find the mean test score."
        },
        {
          id: 2,
          question: "What is the median test score?",
          type: "calculation",
          answer: 85.5,
          tolerance: 0.1,
          hint: "Sort the numbers and find the middle value",
          explanation: "Sorted scores: 71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100. Middle values: 85 and 86. Median = (85 + 86) ÷ 2 = 85.5",
          voiceText: "Find the median test score."
        },
        {
          id: 3,
          question: "What is the range of the test scores?",
          type: "calculation",
          answer: 29,
          tolerance: 0,
          hint: "Subtract the smallest from the largest",
          explanation: "Maximum score: 100. Minimum score: 71. Range = 100 - 71 = 29",
          voiceText: "Find the range of the test scores."
        }
      ]
    },
    {
      id: 2,
      name: "Weather Temperature Data",
      description: "Daily maximum temperatures for 20 days in Celsius",
      data: [22, 24, 19, 26, 23, 25, 21, 27, 20, 28, 18, 29, 17, 30, 16, 31, 15, 32, 14, 33],
      type: "numerical",
      voiceText: "Dataset 2: Weather Temperature Data. Daily maximum temperatures for 20 days.",
      questions: [
        {
          id: 1,
          question: "What is the mean temperature?",
          type: "calculation",
          answer: 23.5,
          tolerance: 0.1,
          hint: "Add all temperatures and divide by 20",
          explanation: "Sum: 22+24+19+26+23+25+21+27+20+28+18+29+17+30+16+31+15+32+14+33 = 470. 470 ÷ 20 = 23.5°C",
          voiceText: "What is the mean temperature?"
        },
        {
          id: 2,
          question: "How many days had temperatures above 25°C?",
          type: "count",
          answer: 8,
          tolerance: 0,
          hint: "Count values greater than 25",
          explanation: "Temperatures above 25: 26, 27, 28, 29, 30, 31, 32, 33 → 8 days",
          voiceText: "How many days had temperatures above 25 degrees Celsius?"
        },
        {
          id: 3,
          question: "What is the mode temperature?",
          type: "text",
          answer: "No mode",
          tolerance: 0,
          hint: "Check which temperature appears most frequently",
          explanation: "All temperatures appear only once. There is no mode in this dataset.",
          voiceText: "What is the mode temperature?"
        }
      ]
    },
    {
      id: 3,
      name: "Sales Revenue",
      description: "Monthly sales revenue (in $1000) for a small business",
      data: [12.5, 15.3, 18.7, 14.2, 16.8, 20.1, 22.4, 19.6, 17.3, 21.5, 23.8, 25.2],
      type: "numerical",
      voiceText: "Dataset 3: Sales Revenue. Monthly sales in thousands of dollars.",
      questions: [
        {
          id: 1,
          question: "What is the total annual revenue?",
          type: "calculation",
          answer: 227.4,
          tolerance: 0.1,
          hint: "Sum all monthly revenues",
          explanation: "12.5+15.3+18.7+14.2+16.8+20.1+22.4+19.6+17.3+21.5+23.8+25.2 = 227.4. Total = $227,400",
          voiceText: "What is the total annual revenue?"
        },
        {
          id: 2,
          question: "What is the average monthly revenue?",
          type: "calculation",
          answer: 18.95,
          tolerance: 0.1,
          hint: "Total revenue divided by 12 months",
          explanation: "227.4 ÷ 12 = 18.95. Average = $18,950 per month",
          voiceText: "What is the average monthly revenue?"
        },
        {
          id: 3,
          question: "What is the revenue growth from first to last month?",
          type: "calculation",
          answer: 12.7,
          tolerance: 0.1,
          hint: "Last month minus first month",
          explanation: "25.2 - 12.5 = 12.7. Growth = $12,700",
          voiceText: "What is the revenue growth from first to last month?"
        }
      ]
    }
  ]

  const challengeProblems = [
    {
      id: 1,
      scenario: "A factory produces light bulbs with a mean lifespan of 800 hours and standard deviation of 50 hours. What percentage of bulbs last between 750 and 850 hours?",
      type: "normal-distribution",
      answer: 68.27,
      tolerance: 0.5,
      hint: "Use the empirical rule for normal distributions. 750 and 850 are ±1 standard deviation from the mean.",
      explanation: "Step 1: Calculate z-scores: z1 = (750-800)/50 = -1, z2 = (850-800)/50 = +1. Step 2: In normal distribution, 68.27% falls within ±1 standard deviation. Answer: 68.27%",
      voiceText: "Normal distribution challenge: What percentage of bulbs last between 750 and 850 hours?"
    },
    {
      id: 2,
      scenario: "In a survey, 60% of people prefer coffee over tea. If you randomly select 10 people, what's the probability exactly 7 prefer coffee? (Answer as percentage)",
      type: "binomial",
      answer: 21.5,
      tolerance: 0.5,
      hint: "This is a binomial probability problem with n=10, p=0.6, k=7",
      explanation: "P(X=7) = C(10,7) × (0.6)⁷ × (0.4)³ = 120 × 0.0279936 × 0.064 = 0.215 = 21.5%",
      voiceText: "Binomial probability challenge: What's the probability that exactly 7 out of 10 prefer coffee?"
    }
  ]

  const currentData = practiceMode === 'guided' ? datasets[currentDataset] : challengeProblems[currentDataset]

  const handleAnswerSubmit = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateResults = () => {
    const results = {}
    if (practiceMode === 'guided') {
      currentData.questions.forEach(question => {
        const userAnswer = userAnswers[question.id]
        if (userAnswer !== undefined && userAnswer !== '') {
          if (question.type === 'calculation') {
            const userNum = parseFloat(userAnswer)
            const isCorrect = Math.abs(userNum - question.answer) <= question.tolerance
            results[question.id] = {
              correct: isCorrect,
              userAnswer: userAnswer,
              correctAnswer: question.answer,
              explanation: question.explanation
            }
          } else {
            const isCorrect = userAnswer.toString().toLowerCase() === question.answer.toString().toLowerCase()
            results[question.id] = {
              correct: isCorrect,
              userAnswer: userAnswer,
              correctAnswer: question.answer,
              explanation: question.explanation
            }
          }
        }
      })
    } else {
      const problem = challengeProblems[currentDataset]
      const userAnswer = userAnswers[problem.id]
      if (userAnswer !== undefined && userAnswer !== '') {
        const userNum = parseFloat(userAnswer)
        const isCorrect = Math.abs(userNum - problem.answer) <= problem.tolerance
        results[problem.id] = {
          correct: isCorrect,
          userAnswer: userAnswer,
          correctAnswer: problem.answer,
          explanation: problem.explanation
        }
      }
    }
    return results
  }

  const results = calculateResults()
  const totalQuestions = practiceMode === 'guided' ? currentData.questions.length : 1
  const correctAnswers = Object.values(results).filter(r => r.correct).length
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const handleNextDataset = () => {
    const maxIndex = practiceMode === 'guided' ? datasets.length - 1 : challengeProblems.length - 1
    setCurrentDataset(prev => prev >= maxIndex ? 0 : prev + 1)
    setUserAnswers({})
    setShowResults(false)
    setActiveTab('dataset')
    speakText(practiceMode === 'guided' ? datasets[currentDataset + 1]?.voiceText : challengeProblems[currentDataset + 1]?.scenario)
  }

  const handlePreviousDataset = () => {
    const maxIndex = practiceMode === 'guided' ? datasets.length - 1 : challengeProblems.length - 1
    setCurrentDataset(prev => prev === 0 ? maxIndex : prev - 1)
    setUserAnswers({})
    setShowResults(false)
    setActiveTab('dataset')
    speakText(practiceMode === 'guided' ? datasets[currentDataset - 1]?.voiceText : challengeProblems[currentDataset - 1]?.scenario)
  }

  const resetPractice = () => {
    setUserAnswers({})
    setShowResults(false)
    setActiveTab('dataset')
  }

  const handleCheckAnswers = () => {
    setShowResults(true)
    let resultsMessage = `You got ${correctAnswers} out of ${totalQuestions} correct. `
    if (score >= 80) resultsMessage += "Excellent work!"
    else if (score >= 60) resultsMessage += "Good effort! Review the explanations to improve."
    else resultsMessage += "Keep practicing! Review the step-by-step solutions."
    speakText(resultsMessage)
  }

  useEffect(() => {
    speakText(`${practiceMode === 'guided' ? 'Guided Practice' : 'Challenge Problems'}. ${currentData.voiceText || currentData.scenario}`)
    return () => stopSpeech()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/topics/statistics" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#F59E0B',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Statistics Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            📊 Interactive Practice
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Practice statistical analysis with real datasets and challenging problems
          </p>
        </div>

        {/* Practice Mode Selection */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '4px',
            display: 'inline-flex',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0'
          }}>
            <button
              onClick={() => {
                setPracticeMode('guided')
                setCurrentDataset(0)
                resetPractice()
                speakText('Guided Practice mode selected. Work with real datasets.')
              }}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                background: practiceMode === 'guided' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'transparent',
                color: practiceMode === 'guided' ? 'white' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🎯 Guided Practice
            </button>
            <button
              onClick={() => {
                setPracticeMode('challenge')
                setCurrentDataset(0)
                resetPractice()
                speakText('Challenge Problems mode selected. Test your advanced skills.')
              }}
              style={{
                padding: '10px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                background: practiceMode === 'challenge' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'transparent',
                color: practiceMode === 'challenge' ? 'white' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🚀 Challenge Problems
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          
          {/* Main Content */}
          <div style={{ flex: 3 }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden'
            }}>
              
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
                {[
                  { id: 'dataset', label: practiceMode === 'guided' ? '📈 Dataset' : '💡 Problem', icon: '📈' },
                  { id: 'questions', label: '❓ Questions', icon: '❓' },
                  { id: 'results', label: '📊 Results', icon: '📊' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    style={{
                      flex: 1,
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '14px',
                      background: activeTab === tab.id ? '#FEF3C7' : 'white',
                      color: activeTab === tab.id ? '#D97706' : '#64748B',
                      borderBottom: activeTab === tab.id ? '2px solid #F59E0B' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: '24px' }}>
                {activeTab === 'dataset' && (
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
                        {practiceMode === 'guided' ? currentData.name : 'Challenge Problem'}
                      </h2>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: '#FEF3C7',
                        color: '#D97706'
                      }}>
                        {currentDataset + 1} of {practiceMode === 'guided' ? datasets.length : challengeProblems.length}
                      </span>
                    </div>

                    <p style={{ color: '#64748B', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>
                      {practiceMode === 'guided' ? currentData.description : currentData.scenario}
                    </p>

                    {practiceMode === 'guided' && (
                      <div style={{
                        background: '#F8FAFC',
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '24px',
                        border: '1px solid #E2E8F0'
                      }}>
                        <h3 style={{ fontWeight: '600', color: '#0F172A', marginBottom: '12px', fontSize: '14px' }}>Dataset Values:</h3>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                          gap: '8px',
                          maxHeight: '150px',
                          overflowY: 'auto',
                          padding: '8px'
                        }}>
                          {currentData.data.map((value, index) => (
                            <div key={index} style={{
                              background: 'white',
                              border: '1px solid #E2E8F0',
                              borderRadius: '8px',
                              padding: '8px',
                              textAlign: 'center',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#0F172A'
                            }}>
                              {value}
                            </div>
                          ))}
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '12px',
                          fontSize: '12px',
                          color: '#64748B'
                        }}>
                          <span><strong>Count:</strong> {currentData.data.length} values</span>
                          <span><strong>Type:</strong> {currentData.type}</span>
                        </div>
                      </div>
                    )}

                    {practiceMode === 'challenge' && (
                      <div style={{
                        background: '#FEF3C7',
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '24px',
                        border: '1px solid #FDE68A'
                      }}>
                        <h3 style={{ fontWeight: '600', color: '#92400E', marginBottom: '8px', fontSize: '14px' }}>💡 Hint:</h3>
                        <p style={{ color: '#92400E', fontSize: '14px' }}>{currentData.hint}</p>
                      </div>
                    )}

                    <div style={{
                      background: '#E0E7FF',
                      borderRadius: '16px',
                      padding: '16px',
                      border: '1px solid #C7D2FE'
                    }}>
                      <h3 style={{ fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', fontSize: '14px' }}>📝 Instructions:</h3>
                      <ul style={{ color: '#1E3A8A', fontSize: '13px', margin: 0, paddingLeft: '20px' }}>
                        <li>• Switch to the Questions tab to solve problems</li>
                        <li>• Use the Results tab to check your answers</li>
                        <li>• Round answers to appropriate decimal places</li>
                        {practiceMode === 'challenge' && (
                          <li>• These are advanced problems requiring statistical reasoning</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'questions' && (
                  <div>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#0F172A',
                      marginBottom: '20px'
                    }}>
                      Practice Questions
                    </h2>

                    {practiceMode === 'guided' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {currentData.questions.map((question, idx) => (
                          <div key={question.id} style={{
                            border: '1px solid #E2E8F0',
                            borderRadius: '16px',
                            padding: '20px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                                {question.question}
                              </h3>
                              <button
                                onClick={() => speakText(question.voiceText || question.question)}
                                style={{
                                  padding: '4px 10px',
                                  background: '#FEF3C7',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  color: '#D97706'
                                }}
                              >
                                🔊 Listen
                              </button>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <input
                                type="text"
                                placeholder="Enter your answer..."
                                style={{
                                  flex: 1,
                                  padding: '12px 16px',
                                  border: '1px solid #E2E8F0',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  outline: 'none'
                                }}
                                onFocus={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                                onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                                onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                                value={userAnswers[question.id] || ''}
                              />
                              {showResults && results[question.id] && (
                                <span style={{
                                  padding: '6px 12px',
                                  borderRadius: '10px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  background: results[question.id].correct ? '#D1FAE5' : '#FEE2E2',
                                  color: results[question.id].correct ? '#065F46' : '#991B1B'
                                }}>
                                  {results[question.id].correct ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '24px'
                      }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>
                          {currentData.scenario}
                        </h3>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Enter your answer..."
                            style={{
                              flex: 1,
                              padding: '14px 18px',
                              border: '1px solid #E2E8F0',
                              borderRadius: '12px',
                              fontSize: '15px',
                              outline: 'none'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                            onChange={(e) => handleAnswerSubmit(currentData.id, e.target.value)}
                            value={userAnswers[currentData.id] || ''}
                          />
                          {showResults && results[currentData.id] && (
                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              fontWeight: '500',
                              background: results[currentData.id].correct ? '#D1FAE5' : '#FEE2E2',
                              color: results[currentData.id].correct ? '#065F46' : '#991B1B'
                            }}>
                              {results[currentData.id].correct ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '32px',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <button
                        onClick={handlePreviousDataset}
                        style={{
                          padding: '10px 20px',
                          background: '#64748B',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ← Previous
                      </button>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={handleCheckAnswers}
                          style={{
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Check Answers
                        </button>
                        <button
                          onClick={handleNextDataset}
                          style={{
                            padding: '10px 20px',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'results' && (
                  <div>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#0F172A',
                      marginBottom: '20px'
                    }}>
                      Results & Explanations
                    </h2>

                    {Object.keys(results).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '48px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                        <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '16px' }}>
                          Complete the questions to see results
                        </p>
                        <button
                          onClick={() => setActiveTab('questions')}
                          style={{
                            padding: '10px 20px',
                            background: '#F59E0B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Go to Questions
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Score Summary */}
                        <div style={{
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                          borderRadius: '20px',
                          padding: '24px',
                          marginBottom: '24px',
                          textAlign: 'center',
                          color: 'white'
                        }}>
                          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>{score}%</div>
                          <div style={{ fontSize: '16px', marginBottom: '16px' }}>
                            {correctAnswers} out of {totalQuestions} correct
                          </div>
                          <div style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.3)',
                            borderRadius: '9999px',
                            height: '8px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${score}%`,
                              background: 'white',
                              height: '100%',
                              borderRadius: '9999px',
                              transition: 'width 1s'
                            }}></div>
                          </div>
                        </div>

                        {/* Detailed Results */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {practiceMode === 'guided' ? (
                            currentData.questions.map((question) => (
                              results[question.id] && (
                                <div key={question.id} style={{
                                  padding: '20px',
                                  borderRadius: '16px',
                                  background: results[question.id].correct ? '#DCFCE7' : '#FEE2E2',
                                  border: `1px solid ${results[question.id].correct ? '#86EFAC' : '#FECACA'}`
                                }}>
                                  <h3 style={{ fontWeight: '600', color: '#0F172A', marginBottom: '12px', fontSize: '15px' }}>
                                    {question.question}
                                  </h3>
                                  <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                    gap: '12px',
                                    marginBottom: '16px',
                                    fontSize: '14px'
                                  }}>
                                    <div>
                                      <strong style={{ color: '#475569' }}>Your Answer:</strong>{' '}
                                      <span style={{ color: results[question.id].correct ? '#065F46' : '#991B1B', fontWeight: '500' }}>
                                        {results[question.id].userAnswer}
                                      </span>
                                    </div>
                                    <div>
                                      <strong style={{ color: '#475569' }}>Correct Answer:</strong>{' '}
                                      <span style={{ color: '#065F46', fontWeight: '500' }}>{results[question.id].correctAnswer}</span>
                                    </div>
                                  </div>
                                  <div style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    border: '1px solid #E2E8F0'
                                  }}>
                                    <strong style={{ color: '#0F172A', fontSize: '13px' }}>Explanation:</strong>
                                    <p style={{ marginTop: '8px', fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                                      {results[question.id].explanation}
                                    </p>
                                  </div>
                                </div>
                              )
                            ))
                          ) : (
                            results[currentData.id] && (
                              <div style={{
                                padding: '20px',
                                borderRadius: '16px',
                                background: results[currentData.id].correct ? '#DCFCE7' : '#FEE2E2',
                                border: `1px solid ${results[currentData.id].correct ? '#86EFAC' : '#FECACA'}`
                              }}>
                                <h3 style={{ fontWeight: '600', color: '#0F172A', marginBottom: '12px', fontSize: '15px' }}>
                                  {currentData.scenario}
                                </h3>
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                  gap: '12px',
                                  marginBottom: '16px',
                                  fontSize: '14px'
                                }}>
                                  <div>
                                    <strong style={{ color: '#475569' }}>Your Answer:</strong>{' '}
                                    <span style={{ color: results[currentData.id].correct ? '#065F46' : '#991B1B', fontWeight: '500' }}>
                                      {results[currentData.id].userAnswer}
                                    </span>
                                  </div>
                                  <div>
                                    <strong style={{ color: '#475569' }}>Correct Answer:</strong>{' '}
                                    <span style={{ color: '#065F46', fontWeight: '500' }}>{results[currentData.id].correctAnswer}</span>
                                  </div>
                                </div>
                                <div style={{
                                  background: 'white',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  border: '1px solid #E2E8F0'
                                }}>
                                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>Step-by-Step Solution:</strong>
                                  <p style={{ marginTop: '8px', fontSize: '13px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                    {results[currentData.id].explanation}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: 1 }}>
            {/* Quick Actions */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  to="/topics/statistics/data-analyzer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Open Data Analyzer
                </Link>
                <Link
                  to="/topics/statistics/examples"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    background: 'white',
                    color: '#F59E0B',
                    border: '1px solid #F59E0B',
                    textDecoration: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  View Examples
                </Link>
              </div>
            </div>

            {/* Practice Tips */}
            <div style={{
              background: '#FEF3C7',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #FDE68A',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>💡 Practice Tips</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#92400E', lineHeight: '1.6' }}>
                <li>• Try solving without calculator first</li>
                <li>• Show your work step by step</li>
                <li>• Review explanations for mistakes</li>
                <li>• Practice regularly for best results</li>
                {practiceMode === 'guided' && (
                  <li>• Use the Data Analyzer for complex calculations</li>
                )}
              </ul>
            </div>

            {/* Navigator */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '20px',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>
                {practiceMode === 'guided' ? 'Datasets' : 'Problems'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {(practiceMode === 'guided' ? datasets : challengeProblems).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentDataset(index)
                      resetPractice()
                      speakText(practiceMode === 'guided' ? item.voiceText : item.scenario)
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px',
                      borderRadius: '12px',
                      background: currentDataset === index ? '#FEF3C7' : 'transparent',
                      border: currentDataset === index ? '1px solid #FDE68A' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#0F172A' }}>
                      {item.name || `Problem ${index + 1}`}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>
                      {practiceMode === 'guided' ? item.description : item.scenario.substring(0, 50)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}