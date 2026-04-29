import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function GeometryIntroduction() {
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
      title: "Welcome to Geometry! 📐",
      content: `Geometry is the branch of mathematics that deals with shapes, sizes, relative positions of figures, and the properties of space. It's one of the oldest sciences, dating back to ancient civilizations!

In this course, you'll learn:
• Points, Lines, and Angles
• Triangles and Their Properties
• Quadrilaterals and Polygons
• Circles and Their Parts
• Area, Perimeter, and Volume
• Coordinate Geometry

Geometry is everywhere - from architecture and engineering to art and nature. Ready to explore the world of shapes and spaces? Let's dive in!`,
      voiceText: `Welcome to Geometry! Geometry is the branch of mathematics that deals with shapes, sizes, relative positions of figures, and the properties of space. It's one of the oldest sciences, dating back to ancient civilizations. In this course, you will learn about points, lines, and angles, triangles and their properties, quadrilaterals and polygons, circles, area and volume, and coordinate geometry. Geometry is everywhere from architecture to nature. Ready to explore? Let's dive in!`,
      type: "welcome",
      button: "Let's Begin!",
      icon: "📐",
      duration: "4 min",
      keyPoints: ["Points & Lines", "Angles", "Triangles", "Circles", "Area & Volume"]
    },
    {
      title: "Points, Lines, and Angles 🔍",
      content: `Let's start with the building blocks of geometry:

📌 POINT: A location in space with no size. Represented by a dot.
📌 LINE: A straight path extending infinitely in both directions.
📌 LINE SEGMENT: A part of a line with two endpoints.
📌 RAY: A part of a line with one endpoint extending infinitely.
📌 ANGLE: Formed by two rays sharing a common endpoint (vertex).

Types of Angles:
• Acute Angle: less than 90°
• Right Angle: exactly 90°
• Obtuse Angle: between 90° and 180°
• Straight Angle: exactly 180°
• Reflex Angle: between 180° and 360°

Example: A 90° angle is a right angle, often marked with a small square in diagrams.`,
      voiceText: `Points, lines, and angles are the building blocks of geometry. A point is a location with no size. A line is a straight path extending infinitely. A line segment has two endpoints. A ray has one endpoint. An angle is formed by two rays sharing a common vertex. Types of angles include acute less than 90 degrees, right exactly 90 degrees, obtuse between 90 and 180, straight exactly 180, and reflex between 180 and 360.`,
      type: "concept",
      button: "Continue",
      icon: "🔍",
      duration: "5 min",
      keyPoints: ["Points = Locations", "Lines = Infinite paths", "Angles = Between rays"]
    },
    {
      title: "Types of Triangles 📏",
      content: `Triangles are classified by their sides and angles:

By SIDES:
• EQUILATERAL: All sides equal, all angles 60°
• ISOSCELES: Two sides equal, base angles equal
• SCALENE: No sides equal, all angles different

By ANGLES:
• ACUTE TRIANGLE: All angles less than 90°
• RIGHT TRIANGLE: One angle exactly 90°
• OBTUSE TRIANGLE: One angle greater than 90°

Important Triangle Facts:
• Sum of interior angles = 180°
• Pythagorean Theorem: a² + b² = c² (for right triangles)
• Area = ½ × base × height

Example: A triangle with sides 3, 4, 5 is a right triangle (3² + 4² = 9 + 16 = 25 = 5²)`,
      voiceText: `Triangles are classified by sides and angles. By sides: equilateral has all sides equal, isosceles has two sides equal, scalene has no equal sides. By angles: acute has all angles less than 90 degrees, right has one 90 degree angle, obtuse has one angle greater than 90 degrees. The sum of interior angles is always 180 degrees. The Pythagorean theorem states a squared plus b squared equals c squared for right triangles.`,
      type: "concept",
      button: "Continue",
      icon: "📏",
      duration: "6 min",
      keyPoints: ["Triangles = 3 sides", "Sum of angles = 180°", "Pythagorean Theorem"]
    },
    {
      title: "Triangle Classification Practice 🎯",
      content: `Let's test your understanding of triangle classification!

A triangle has sides of lengths: 5 cm, 5 cm, and 8 cm.
What type of triangle is this by sides?`,
      voiceText: `Let's practice triangle classification. A triangle has sides 5 centimeters, 5 centimeters, and 8 centimeters. What type of triangle is this by sides?`,
      type: "interactive",
      question: "What type of triangle is it by sides?",
      answer: "isosceles",
      hint: "Two sides are equal in length (5 cm and 5 cm)",
      explanation: "Since two sides are equal (5 cm and 5 cm), this is an isosceles triangle.",
      button: "Check Answer",
      icon: "🎯",
      duration: "3 min",
      keyPoints: ["Isosceles = 2 equal sides", "Equilateral = 3 equal sides", "Scalene = 0 equal sides"]
    },
    {
      title: "Area and Perimeter 📊",
      content: `Understanding area and perimeter is essential for real-world applications:

📌 PERIMETER: The distance around a shape (sum of all sides)
📌 AREA: The space inside a shape

Common Formulas:

SQUARE:
• Perimeter = 4 × side
• Area = side²

RECTANGLE:
• Perimeter = 2 × (length + width)
• Area = length × width

TRIANGLE:
• Perimeter = a + b + c
• Area = ½ × base × height

CIRCLE:
• Circumference = 2πr (perimeter of circle)
• Area = πr²

Example: A rectangle with length 8 m and width 5 m has:
Perimeter = 2(8 + 5) = 26 m
Area = 8 × 5 = 40 m²`,
      voiceText: `Understanding area and perimeter is essential for real-world applications. Perimeter is the distance around a shape. Area is the space inside a shape. For a square, perimeter is 4 times side, area is side squared. For a rectangle, perimeter is 2 times length plus width, area is length times width. For a triangle, perimeter is sum of sides, area is one half base times height. For a circle, circumference is 2 pi r, area is pi r squared.`,
      type: "concept",
      button: "Continue",
      icon: "📊",
      duration: "6 min",
      keyPoints: ["Perimeter = distance around", "Area = space inside", "Pi (π) ≈ 3.14"]
    },
    {
      title: "Calculate the Area 📝",
      content: `Let's practice finding the area of a rectangle!

A rectangle has a length of 12 meters and a width of 5 meters.

What is its area?`,
      voiceText: `Let's practice finding area. A rectangle has length 12 meters and width 5 meters. What is its area?`,
      type: "interactive",
      question: "What is the area of the rectangle?",
      answer: "60",
      hint: "Area = length × width",
      explanation: "Area = 12 m × 5 m = 60 square meters.",
      button: "Check Answer",
      icon: "📝",
      duration: "3 min",
      keyPoints: ["Area = length × width", "Units are square meters", "60 m² is the answer"]
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
            borderTopColor: '#10B981',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: '#64748B' }}>Loading Geometry Introduction...</p>
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
        <Link to="/topics/geometry" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#10B981',
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Back to Geometry
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
              background: 'linear-gradient(135deg, #10B981, #059669)',
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
              background: 'linear-gradient(135deg, #10B981, #059669, #047857)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px'
            }}>
              Introduction to Geometry
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Master shapes, angles, and spatial relationships
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}>
              <span style={{ background: '#DCFCE7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#166534' }}>6 Lessons</span>
              <span style={{ background: '#DCFCE7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#166534' }}>~27 min</span>
              <span style={{ background: '#DCFCE7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#166534' }}>Beginner Friendly</span>
            </div>
            <button
              onClick={startLearning}
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
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
                  background: 'linear-gradient(90deg, #10B981, #059669)',
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
                    background: 'linear-gradient(135deg, #10B981, #059669)',
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
                      background: '#DCFCE7',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: '#166534',
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
                  background: '#DCFCE7',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#065F46', marginBottom: '12px' }}>📝 Quick Check</h3>
                  <p style={{ color: '#047857', marginBottom: '16px' }}>{sections[currentSection].question}</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #86EFAC',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#10B981',
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
                  <Link to="/topics/geometry" style={{
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
                      background: 'linear-gradient(135deg, #10B981, #059669)',
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
                    background: index === currentSection ? '#10B981' : '#E2E8F0',
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