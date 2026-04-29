import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function StatisticsIntroduction() {
  const [currentSection, setCurrentSection] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  const speechSynth = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sections = [
    {
      title: "Welcome to Statistics! 📊",
      content: `Statistics is the science of collecting, analyzing, interpreting, and presenting data. It helps us make sense of information and discover patterns in our world.

In this course, you'll learn:
• Measures of Central Tendency (Mean, Median, Mode)
• Measures of Spread (Range, Variance, Standard Deviation)
• Data Visualization (Charts and Graphs)
• Probability Basics
• Real-world Data Analysis

Statistics is used everywhere - from medical research to business decisions, from sports analytics to weather forecasting. Ready to become a data detective? Let's dive in!`,
      voiceText: `Welcome to Statistics! Statistics is the science of collecting, analyzing, interpreting, and presenting data. It helps us make sense of information and discover patterns in our world. In this course, you will learn measures of central tendency, measures of spread, data visualization, probability basics, and real-world data analysis. Statistics is used everywhere from medical research to business decisions. Ready to become a data detective? Let's dive in!`,
      type: "welcome",
      button: "Let's Begin!",
      icon: "📊",
      duration: "4 min",
      keyPoints: ["Data Collection", "Data Analysis", "Interpretation", "Visualization"]
    },
    {
      title: "What is Statistics? 🔍",
      content: `Statistics has two main branches:

📌 Descriptive Statistics: Describes and summarizes data using measures like mean, median, and graphs.
📌 Inferential Statistics: Makes predictions and inferences about a population based on a sample.

Think of it this way:
• Descriptive = "What happened?" (describing past data)
• Inferential = "What might happen?" (predicting future trends)

Example: If a restaurant surveys 100 customers about their favorite dish, they are collecting data. The average rating (descriptive) tells them current preferences. Using that to predict what new dishes to offer is inferential statistics.`,
      voiceText: `Statistics has two main branches. Descriptive statistics describes and summarizes data using measures like mean, median, and graphs. Inferential statistics makes predictions and inferences about a population based on a sample. Think of it this way. Descriptive tells what happened. Inferential tells what might happen.`,
      type: "concept",
      button: "Continue",
      icon: "🔍",
      duration: "5 min",
      keyPoints: ["Descriptive = Summary", "Inferential = Prediction", "Sample vs Population"]
    },
    {
      title: "Measures of Central Tendency 📈",
      content: `The three main measures of central tendency help us find the "center" of our data:

📌 MEAN (Average): Sum of all values ÷ number of values
• Best for symmetric data without outliers

📌 MEDIAN (Middle): Middle value when data is sorted
• Best for skewed data or when outliers exist

📌 MODE (Most Frequent): Value that appears most often
• Best for categorical data or finding popularity

Example Dataset: 5, 7, 7, 8, 10
• Mean = (5+7+7+8+10)/5 = 37/5 = 7.4
• Median = 7 (middle value)
• Mode = 7 (appears twice)`,
      voiceText: `The three main measures of central tendency help us find the center of our data. The mean is the average, found by summing all values and dividing by the number of values. It's best for symmetric data without outliers. The median is the middle value when data is sorted. It's best for skewed data. The mode is the value that appears most often. It's best for categorical data.`,
      type: "concept",
      button: "Continue",
      icon: "📈",
      duration: "6 min",
      keyPoints: ["Mean = Average", "Median = Middle", "Mode = Most Frequent"]
    },
    {
      title: "Find the Mean Practice 📝",
      content: `Let's practice finding the mean!

Dataset: 12, 14, 13, 15, 16

Step 1: Add all numbers
12 + 14 + 13 + 15 + 16 = 70

Step 2: Divide by the number of values (5)
70 ÷ 5 = 14

The mean is 14!`,
      voiceText: `Let's practice finding the mean. Dataset: 12, 14, 13, 15, 16. Step 1, add all numbers. 12 plus 14 plus 13 plus 15 plus 16 equals 70. Step 2, divide by the number of values, which is 5. 70 divided by 5 equals 14. The mean is 14.`,
      type: "interactive",
      question: "Find the mean of: 8, 10, 12, 14, 16",
      answer: "12",
      hint: "Add all numbers then divide by 5",
      explanation: "Sum = 8+10+12+14+16 = 60. 60 ÷ 5 = 12",
      button: "Check Answer",
      icon: "📝",
      duration: "4 min",
      keyPoints: ["Add all values", "Divide by count", "Average"]
    },
    {
      title: "Find the Median Practice 🎯",
      content: `The median is the middle value when data is sorted.

Dataset: 3, 8, 5, 10, 7

Step 1: Sort the numbers
3, 5, 7, 8, 10

Step 2: Find the middle position
With 5 numbers, position 3 is the middle

The median is 7!

For an even number of values, average the two middle numbers.`,
      voiceText: `The median is the middle value when data is sorted. Dataset: 3, 8, 5, 10, 7. Step 1, sort the numbers. 3, 5, 7, 8, 10. Step 2, find the middle position. With 5 numbers, position 3 is the middle. The median is 7. For an even number of values, average the two middle numbers.`,
      type: "interactive",
      question: "Find the median of: 4, 9, 2, 7, 6",
      answer: "6",
      hint: "First sort the numbers, then find the middle value",
      explanation: "Sorted: 2, 4, 6, 7, 9 → middle is 6",
      button: "Check Answer",
      icon: "🎯",
      duration: "4 min",
      keyPoints: ["Sort data first", "Find middle position", "Average for even count"]
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

  const startLearning = () => {
    setShowIntro(false)
    setCurrentSection(0)
    setTimeout(() => {
      speakText(sections[0].voiceText)
    }, 300)
  }

  const handleNext = () => {
    stopSpeech()
    setUserAnswer("")
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
      setTimeout(() => {
        speakText(sections[currentSection + 1].voiceText)
      }, 300)
    }
  }

  const handlePrev = () => {
    stopSpeech()
    setUserAnswer("")
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
      setTimeout(() => {
        speakText(sections[currentSection - 1].voiceText)
      }, 300)
    }
  }

  const handleSectionChange = (index) => {
    stopSpeech()
    setUserAnswer("")
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
    setCurrentSection(index)
    setTimeout(() => {
      speakText(sections[index].voiceText)
    }, 300)
  }

  const checkAnswer = () => {
    const userLower = userAnswer.trim().toLowerCase()
    const correctAnswer = sections[currentSection]?.answer?.toLowerCase() || ""
    const isAnswerCorrect = userLower === correctAnswer
    
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      setShowSolution(true)
      speakText(`Correct! ${sections[currentSection]?.explanation}`)
    } else {
      setShowHint(true)
      speakText(`Not quite. ${sections[currentSection]?.hint}`)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E2E8F0',
            borderTopColor: '#F59E0B',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: '#64748B' }}>Loading Statistics Introduction...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Back Button */}
        <Link to="/topics/statistics" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#F59E0B',
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Back to Statistics
        </Link>

        {/* INTRO SCREEN */}
        {showIntro && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
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
            <h1 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px'
            }}>
              Introduction to Statistics
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Master data analysis and interpretation
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}>
              <span style={{ background: '#FEF3C7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#D97706' }}>5 Lessons</span>
              <span style={{ background: '#FEF3C7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#D97706' }}>~23 min</span>
              <span style={{ background: '#FEF3C7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#D97706' }}>Beginner Friendly</span>
            </div>
            <button
              onClick={startLearning}
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '16px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Learning →
            </button>
          </div>
        )}

        {/* CONTENT SECTION */}
        {!showIntro && currentSection >= 0 && (
          <>
            {/* Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#64748B' }}>
                <span>📊 Lesson Progress</span>
                <span>{currentSection + 1} of {sections.length} • {Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
              </div>
              <div style={{
                width: '100%',
                background: '#E2E8F0',
                borderRadius: '9999px',
                height: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((currentSection + 1) / sections.length) * 100}%`,
                  background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                  height: '100%',
                  borderRadius: '9999px',
                  transition: 'width 0.5s'
                }}></div>
              </div>
            </div>

            {/* Main Card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '24px' : '32px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white'
                  }}>
                    {sections[currentSection].icon}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
                      {sections[currentSection].title}
                    </h2>
                    <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                      ⏱️ {sections[currentSection].duration}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => isPlaying ? stopSpeech() : speakText(sections[currentSection].voiceText)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: isPlaying ? '#EF4444' : '#F59E0B',
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

              {/* Key Points */}
              {sections[currentSection].keyPoints && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #E2E8F0'
                }}>
                  {sections[currentSection].keyPoints.map((point, idx) => (
                    <span key={idx} style={{
                      background: '#FEF3C7',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: '#D97706',
                      fontWeight: '500'
                    }}>
                      📌 {point}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                lineHeight: '1.8',
                color: '#334155',
                whiteSpace: 'pre-line',
                fontSize: isMobile ? '14px' : '15px'
              }}>
                {sections[currentSection].content}
              </div>

              {/* Interactive Question Section */}
              {sections[currentSection].type === "interactive" && (
                <div style={{
                  background: '#FEF3C7',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>📝 Quick Check</h3>
                  <p style={{ color: '#D97706', marginBottom: '16px' }}>{sections[currentSection].question}</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #FDE68A',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#F59E0B',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Check Answer
                    </button>
                  </form>

                  {showHint && (
                    <div style={{
                      background: '#FEF3C7',
                      borderRadius: '12px',
                      padding: '12px',
                      marginTop: '16px',
                      color: '#92400E',
                      fontSize: '13px'
                    }}>
                      💡 Hint: {sections[currentSection].hint}
                    </div>
                  )}

                  {showSolution && (
                    <div style={{
                      background: '#D1FAE5',
                      borderRadius: '12px',
                      padding: '12px',
                      marginTop: '16px',
                      color: '#065F46',
                      fontSize: '13px'
                    }}>
                      ✅ Correct! {sections[currentSection].explanation}
                    </div>
                  )}
                </div>
              )}

              {/* Problem Section */}
              {sections[currentSection].type === "problem" && (
                <div style={{
                  background: '#FEF3C7',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#D97706', marginBottom: '16px' }}>
                    {sections[currentSection].equation}
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowSolution(true)
                      speakText(`The answer is ${sections[currentSection].solution}. ${sections[currentSection].hint}`)
                    }}
                    style={{
                      background: '#F59E0B',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {sections[currentSection].button}
                  </button>

                  {showSolution && (
                    <div style={{
                      background: '#D1FAE5',
                      borderRadius: '12px',
                      padding: '12px',
                      marginTop: '16px',
                      color: '#065F46'
                    }}>
                      ✅ Answer: {sections[currentSection].solution}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '32px',
                gap: '12px'
              }}>
                <button
                  onClick={handlePrev}
                  disabled={currentSection === 0}
                  style={{
                    padding: '12px 24px',
                    background: currentSection === 0 ? '#F1F5F9' : 'white',
                    color: currentSection === 0 ? '#94A3B8' : '#64748B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  ← Previous
                </button>

                {currentSection === sections.length - 1 ? (
                  <Link to="/topics/statistics" style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    🎉 Complete Course →
                  </Link>
                ) : (
                  <button
                    onClick={handleNext}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Next Section →
                  </button>
                )}
              </div>
            </div>

            {/* Section Navigation Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionChange(index)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentSection ? '#F59E0B' : '#E2E8F0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Completion Message */}
            {currentSection === sections.length - 1 && (
              <div style={{
                textAlign: 'center',
                marginTop: '16px',
                padding: '12px',
                background: '#D1FAE5',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '13px', color: '#065F46' }}>
                  🎉 You've completed all sections! Click "Complete Course" to finish.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}