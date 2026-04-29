import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function StatisticsExamples() {
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

  const statisticsExamples = [
    {
      id: 1,
      title: "Mean Calculation",
      type: "central-tendency",
      difficulty: "beginner",
      problem: "Calculate the mean of the following test scores: 85, 92, 78, 96, 88, 90",
      voiceText: "Example 1: Mean Calculation. Calculate the mean of the test scores: 85, 92, 78, 96, 88, 90.",
      steps: [
        {
          title: "Step 1: List the Numbers",
          content: "Write down all the given numbers:\n85, 92, 78, 96, 88, 90",
          explanation: "We start by identifying all the values in our dataset.",
          voiceText: "Step 1. List all the numbers: 85, 92, 78, 96, 88, 90."
        },
        {
          title: "Step 2: Add All Numbers",
          content: "Sum = 85 + 92 + 78 + 96 + 88 + 90\n= 529",
          explanation: "Add all the numbers together to get the total sum.",
          working: "85 + 92 = 177\n177 + 78 = 255\n255 + 96 = 351\n351 + 88 = 439\n439 + 90 = 529",
          voiceText: "Step 2. Add all numbers. The sum is 529."
        },
        {
          title: "Step 3: Count the Numbers",
          content: "There are 6 test scores in total.",
          explanation: "Count how many numbers are in the dataset.",
          voiceText: "Step 3. Count the numbers. There are 6 values."
        },
        {
          title: "Step 4: Calculate Mean",
          content: "Mean = Total Sum ÷ Number of Values\n= 529 ÷ 6\n= 88.17",
          explanation: "Divide the total sum by the number of values to find the mean.",
          working: "529 ÷ 6 = 88.166... ≈ 88.17",
          voiceText: "Step 4. Calculate mean: 529 divided by 6 equals 88.17."
        },
        {
          title: "Step 5: Interpret Result",
          content: "The mean test score is 88.17\nThis represents the average performance of all students.",
          explanation: "The mean gives us the central value of the dataset.",
          voiceText: "Step 5. The mean test score is 88.17, representing the average performance.",
          interactive: {
            question: "What is the mean of these scores?",
            answer: "88.17",
            hint: "Remember: Mean = Sum of all values ÷ Number of values",
            voiceText: "What is the mean of these scores?"
          }
        }
      ]
    },
    {
      id: 2,
      title: "Median Calculation",
      type: "central-tendency",
      difficulty: "beginner",
      problem: "Find the median of these ages: 15, 22, 18, 25, 30, 12, 16",
      voiceText: "Example 2: Median Calculation. Find the median of ages: 15, 22, 18, 25, 30, 12, 16.",
      steps: [
        {
          title: "Step 1: Arrange in Order",
          content: "First, arrange numbers from smallest to largest:\n12, 15, 16, 18, 22, 25, 30",
          explanation: "The median requires the data to be sorted in ascending order.",
          working: "Original: 15, 22, 18, 25, 30, 12, 16\nSorted: 12, 15, 16, 18, 22, 25, 30",
          voiceText: "Step 1. Arrange numbers from smallest to largest: 12, 15, 16, 18, 22, 25, 30."
        },
        {
          title: "Step 2: Find Middle Position",
          content: "With 7 numbers, the middle position is:\n(7 + 1) ÷ 2 = 4th position",
          explanation: "For odd number of values: Middle position = (n + 1) ÷ 2",
          voiceText: "Step 2. With 7 numbers, the middle position is the 4th number."
        },
        {
          title: "Step 3: Identify Median",
          content: "The 4th number in the ordered list is: 18",
          explanation: "The median is the value at the middle position.",
          working: "Position 1: 12\nPosition 2: 15\nPosition 3: 16\nPosition 4: 18 ← Median",
          voiceText: "Step 3. The 4th number is 18. That is the median."
        },
        {
          title: "Step 4: Verify Result",
          content: "Ordered list: 12, 15, 16, [18], 22, 25, 30\nThree values on each side of 18",
          explanation: "The median splits the dataset into two equal halves.",
          voiceText: "Step 4. Three values on each side of 18 confirms it's the median.",
          interactive: {
            question: "What is the median age?",
            answer: "18",
            hint: "First sort the numbers, then find the middle value",
            voiceText: "What is the median age?"
          }
        }
      ]
    },
    {
      id: 3,
      title: "Mode Identification",
      type: "central-tendency",
      difficulty: "beginner",
      problem: "Find the mode of these shoe sizes: 7, 8, 8, 9, 10, 8, 7, 9, 8",
      voiceText: "Example 3: Mode Identification. Find the mode of shoe sizes: 7, 8, 8, 9, 10, 8, 7, 9, 8.",
      steps: [
        {
          title: "Step 1: List All Values",
          content: "Shoe sizes: 7, 8, 8, 9, 10, 8, 7, 9, 8",
          explanation: "We start with the complete dataset.",
          voiceText: "Step 1. List all shoe sizes: 7, 8, 8, 9, 10, 8, 7, 9, 8."
        },
        {
          title: "Step 2: Count Frequencies",
          content: "Size 7: appears 2 times\nSize 8: appears 4 times\nSize 9: appears 2 times\nSize 10: appears 1 time",
          explanation: "Count how many times each value appears in the dataset.",
          working: "7 → 2 times\n8 → 4 times\n9 → 2 times\n10 → 1 time",
          voiceText: "Step 2. Count frequencies: 7 appears twice, 8 appears four times, 9 appears twice, 10 appears once."
        },
        {
          title: "Step 3: Find Highest Frequency",
          content: "Size 8 appears most frequently (4 times)",
          explanation: "The mode is the value with the highest frequency.",
          voiceText: "Step 3. Size 8 appears most frequently with 4 times."
        },
        {
          title: "Step 4: Identify Mode",
          content: "Mode = 8",
          explanation: "Size 8 is the most common shoe size in this dataset.",
          voiceText: "Step 4. The mode is 8.",
          interactive: {
            question: "What is the mode shoe size?",
            answer: "8",
            hint: "Count how many times each size appears",
            voiceText: "What is the mode shoe size?"
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
    if (currentStep < currentExampleData.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      setTimeout(() => {
        const nextStepData = currentExampleData.steps[currentStep + 1]
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
        const prevStepData = currentExampleData.steps[currentStep - 1]
        if (prevStepData) {
          speakText(prevStepData.voiceText || `${prevStepData.title}. ${prevStepData.content} ${prevStepData.explanation || ''}`)
        }
      }, 200)
    }
  }

  const checkAnswer = () => {
    const currentInteractive = currentExampleData.interactive
    if (!currentInteractive) return
    
    const normalizedInput = userInput.trim().toLowerCase()
    const normalizedAnswer = currentInteractive.answer.toLowerCase()
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
      speakText(statisticsExamples[index].voiceText || statisticsExamples[index].problem)
    }, 200)
  }

  useEffect(() => {
    setTimeout(() => {
      speakText(statisticsExamples[0].voiceText)
    }, 500)
    return () => stopSpeech()
  }, [])

  const currentExampleData = statisticsExamples[currentExample]
  const currentStepData = currentExampleData.steps[currentStep]

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
      case 'central-tendency': return '📈'
      case 'dispersion': return '🌊'
      case 'application': return '🎯'
      default: return '📊'
    }
  }

  const difficultyColors = getDifficultyColor(currentExampleData.difficulty)

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
            📊 Statistics Examples
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Step-by-step statistical analysis with detailed explanations
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
                {statisticsExamples.map((example, index) => {
                  const colors = getDifficultyColor(example.difficulty)
                  return (
                    <button
                      key={example.id}
                      onClick={() => handleExampleChange(index)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: isMobile ? '12px' : '14px',
                        borderRadius: '14px',
                        border: currentExample === index ? `2px solid #F59E0B` : '1px solid #E2E8F0',
                        background: currentExample === index ? '#FEF3C7' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '10px',
                          background: currentExample === index ? '#F59E0B' : '#E2E8F0',
                          color: currentExample === index ? 'white' : '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {example.id}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: currentExample === index ? '#D97706' : '#0F172A' }}>
                            {example.title}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span style={{ fontSize: '10px' }}>{getTypeIcon(example.type)}</span>
                            <span style={{
                              fontSize: '9px',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              background: colors.bg,
                              color: colors.text
                            }}>
                              {example.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
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
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: difficultyColors.bg,
                      color: difficultyColors.text
                    }}>
                      {currentExampleData.difficulty}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '500',
                      background: '#FEF3C7',
                      color: '#D97706'
                    }}>
                      {getTypeIcon(currentExampleData.type)} {currentExampleData.type.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => speakText(currentStepData.voiceText || `${currentStepData.title}. ${currentStepData.content} ${currentStepData.explanation || ''}`)}
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

              {/* Problem Statement */}
              <div style={{
                background: '#FEF3C7',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid #FDE68A'
              }}>
                <h3 style={{ fontWeight: '600', color: '#92400E', marginBottom: '8px', fontSize: '14px' }}>Problem:</h3>
                <p style={{ color: '#78350F', fontSize: isMobile ? '15px' : '16px', lineHeight: '1.6' }}>
                  {currentExampleData.problem}
                </p>
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
                    background: 'linear-gradient(90deg, #F59E0B, #D97706)',
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.5s'
                  }}></div>
                </div>
              </div>

              {/* Current Step Content */}
              <div>
                {/* Step Content */}
                <div style={{
                  background: '#FEF3C7',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  borderLeft: '4px solid #F59E0B'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#92400E', marginBottom: '12px' }}>
                    {currentStepData.title}
                  </h3>
                  <pre style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#78350F',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    marginBottom: '12px'
                  }}>
                    {currentStepData.content}
                  </pre>
                  <p style={{ color: '#92400E', lineHeight: '1.6' }}>
                    {currentStepData.explanation}
                  </p>
                </div>

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
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      {currentStepData.working}
                    </pre>
                  </div>
                )}

                {/* Interactive Section */}
                {currentStep === currentExampleData.steps.length - 1 && (
                  <div style={{
                    background: '#D1FAE5',
                    borderRadius: '16px',
                    padding: '20px',
                    marginTop: '20px',
                    border: '1px solid #10B981'
                  }}>
                    <h4 style={{ fontWeight: '600', color: '#065F46', marginBottom: '12px', fontSize: '14px' }}>
                      Try It Yourself! 💡
                    </h4>
                    <p style={{ color: '#065F46', marginBottom: '16px' }}>{currentExampleData.interactive.question}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your answer..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #86EFAC',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          textAlign: 'center',
                          fontFamily: 'monospace'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#86EFAC'}
                      />
                      
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={checkAnswer}
                          style={{
                            padding: '10px 20px',
                            background: '#10B981',
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
                            padding: '10px 20px',
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
                          <p style={{ fontSize: '13px', color: '#92400E' }}>💡 {currentExampleData.interactive.hint}</p>
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
                              The correct answer is: {currentExampleData.interactive.answer}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Final Explanation */}
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #D1FAE5'
                    }}>
                      <p style={{ fontSize: '13px', color: '#065F46' }}>{currentExampleData.explanation}</p>
                    </div>
                  </div>
                )}
              </div>

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
                    {currentStep === 0 ? "Ready to begin our statistical journey? 📊" :
                     currentStep < currentExampleData.steps.length - 2 ? "Great progress! Keep going! 💪" :
                     "Almost there! You're doing fantastic! 🌟"}
                  </p>
                )}
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
                    background: currentStep === currentExampleData.steps.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #F59E0B, #D97706)',
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
                    background: index === currentStep ? '#F59E0B' : index < currentStep ? '#10B981' : '#E2E8F0',
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