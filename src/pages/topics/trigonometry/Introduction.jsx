import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function TrigonometryIntroduction() {
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
      title: "Welcome to Trigonometry! 📐",
      content: `Trigonometry is the branch of mathematics that studies relationships between angles and sides of triangles. It's used everywhere - from architecture and engineering to music and space exploration!

In this course, you'll learn:
• Trigonometric Ratios (SOH-CAH-TOA)
• The Unit Circle and Angle Measures
• Solving Right Triangles
• Applications in Real Life
• Trigonometric Functions and Graphs

Trigonometry opens doors to physics, engineering, computer graphics, and navigation. Ready to explore the world of triangles and angles? Let's dive in!`,
      voiceText: `Welcome to Trigonometry! Trigonometry is the branch of mathematics that studies relationships between angles and sides of triangles. It's used everywhere from architecture and engineering to music and space exploration. In this course, you will learn trigonometric ratios like SOH-CAH-TOA, the unit circle, solving right triangles, real-life applications, and trigonometric functions. Ready to explore triangles and angles? Let's dive in!`,
      type: "welcome",
      button: "Let's Begin!",
      icon: "📐",
      duration: "4 min",
      keyPoints: ["Trigonometric Ratios", "Unit Circle", "Right Triangles", "Real Applications"]
    },
    {
      title: "What is Trigonometry? 🔍",
      content: `Think of trigonometry as the language of triangles. It helps us find unknown sides and angles using special relationships.

The word "Trigonometry" comes from Greek:
• "Trigonon" meaning triangle
• "Metron" meaning measure

So trigonometry literally means "triangle measurement"!

Real-world applications:
• Architects use it to design buildings
• Pilots use it for navigation
• Sound engineers use it for music waves
• Game developers use it for 3D graphics`,
      voiceText: `Think of trigonometry as the language of triangles. It helps us find unknown sides and angles using special relationships. The word Trigonometry comes from Greek meaning triangle measurement. Architects use it to design buildings. Pilots use it for navigation. Sound engineers use it for music waves. Game developers use it for 3D graphics.`,
      type: "concept",
      button: "Continue",
      icon: "🔍",
      duration: "5 min",
      keyPoints: ["Triangle measurement", "Angle-side relationships", "Real-world applications"]
    },
    {
      title: "SOH-CAH-TOA 📏",
      content: `The three main trigonometric ratios are:

📌 SINE (sin) = Opposite / Hypotenuse
📌 COSINE (cos) = Adjacent / Hypotenuse
📌 TANGENT (tan) = Opposite / Adjacent

Remember the acronym: SOH-CAH-TOA

• SOH: Sine = Opposite / Hypotenuse
• CAH: Cosine = Adjacent / Hypotenuse
• TOA: Tangent = Opposite / Adjacent

Example: In a right triangle with angle θ, if the opposite side is 3 and the hypotenuse is 5, then sin(θ) = 3/5 = 0.6`,
      voiceText: `The three main trigonometric ratios are sine, cosine, and tangent. Remember SOH-CAH-TOA. SOH means sine equals opposite over hypotenuse. CAH means cosine equals adjacent over hypotenuse. TOA means tangent equals opposite over adjacent.`,
      type: "concept",
      button: "Continue",
      icon: "📏",
      duration: "6 min",
      keyPoints: ["SOH = Opposite/Hypotenuse", "CAH = Adjacent/Hypotenuse", "TOA = Opposite/Adjacent"]
    },
    {
      title: "Practice the Ratios 🎯",
      content: `Let's test your understanding of the trigonometric ratios!

In a right triangle:
• Opposite side = 4
• Adjacent side = 3
• Hypotenuse = 5

Find sin(θ), cos(θ), and tan(θ)`,
      voiceText: `Let's practice the ratios. In a right triangle, opposite side is 4, adjacent side is 3, hypotenuse is 5. Find sine, cosine, and tangent of angle theta.`,
      type: "interactive",
      question: "What is sin(θ)?",
      answer: "4/5",
      hint: "Sine = Opposite / Hypotenuse",
      explanation: "sin(θ) = Opposite/Hypotenuse = 4/5 = 0.8",
      button: "Check Answer",
      icon: "🎯",
      duration: "4 min",
      keyPoints: ["Remember SOH-CAH-TOA", "Opposite/Hypotenuse = Sine", "Adjacent/Hypotenuse = Cosine", "Opposite/Adjacent = Tangent"]
    },
    {
      title: "Finding Missing Sides 📐",
      content: `Once you know a trigonometric ratio, you can find missing sides!

Example: If sin(30°) = 0.5 and the hypotenuse is 10, what is the opposite side?

Step 1: Use the sine ratio
sin(30°) = Opposite / Hypotenuse

Step 2: Substitute known values
0.5 = Opposite / 10

Step 3: Multiply both sides by 10
0.5 × 10 = Opposite
5 = Opposite

The opposite side is 5 units!`,
      voiceText: `Once you know a trigonometric ratio, you can find missing sides. For example, if sine of 30 degrees is 0.5 and the hypotenuse is 10, we can find the opposite side. Using sine equals opposite over hypotenuse, 0.5 equals opposite over 10. Multiplying both sides by 10 gives opposite equals 5.`,
      type: "problem",
      equation: "sin(30°) = x/10",
      solution: "5",
      hint: "Multiply sin(30°) by 10",
      explanation: "x = sin(30°) × 10 = 0.5 × 10 = 5",
      button: "Show Solution",
      icon: "📐",
      duration: "5 min",
      keyPoints: ["Use correct ratio", "Substitute known values", "Solve for unknown"]
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
    const userLower = userAnswer.trim().toLowerCase().replace(/\s/g, '')
    const correctAnswer = sections[currentSection]?.answer?.toLowerCase().replace(/\s/g, '') || ""
    const isAnswerCorrect = userLower === correctAnswer
    
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      setShowSolution(true)
      speakText(`Correct! ${sections[currentSection]?.explanation || sections[currentSection]?.answer}`)
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
            borderTopColor: '#EF4444',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: '#64748B' }}>Loading Trigonometry Introduction...</p>
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
        <Link to="/topics/trigonometry" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#EF4444',
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Back to Trigonometry
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
            <h1 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #EF4444, #DC2626, #B91C1C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px'
            }}>
              Introduction to Trigonometry
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Master triangles, angles, and trigonometric functions
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}>
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>5 Lessons</span>
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>~24 min</span>
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>Beginner Friendly</span>
            </div>
            <button
              onClick={startLearning}
              style={{
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
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
                  background: 'linear-gradient(90deg, #EF4444, #DC2626)',
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
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
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
                      background: '#FEE2E2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: '#DC2626',
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
                  background: '#FEE2E2',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#991B1B', marginBottom: '12px' }}>📝 Quick Check</h3>
                  <p style={{ color: '#DC2626', marginBottom: '16px' }}>{sections[currentSection].question}</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #FECACA',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#DC2626',
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
                      speakText(`The answer is ${sections[currentSection].solution}. ${sections[currentSection].explanation}`)
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
                      ✅ Answer: x = {sections[currentSection].solution}
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
                  <Link to="/topics/trigonometry" style={{
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
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
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
                    background: index === currentSection ? '#EF4444' : '#E2E8F0',
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