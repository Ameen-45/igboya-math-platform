import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

// Triangle Visualizer Component
function TriangleVisualizer({ angle = 30, opposite = 5, adjacent = 8.66, hypotenuse = 10, showLabels = true }) {
  const width = 350;
  const height = 280;
  const padding = 50;
  
  // Calculate triangle points
  const startX = padding;
  const startY = height - padding;
  const endX = startX + (adjacent / hypotenuse) * (width - 2 * padding);
  const endY = startY;
  const peakX = startX + (opposite / hypotenuse) * (width - 2 * padding);
  const peakY = startY - (opposite / adjacent) * (height - 2 * padding);
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
      borderRadius: '20px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #E2E8F0',
      marginBottom: '20px'
    }}>
      <svg width="100%" height="240" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '450px', margin: '0 auto' }}>
        {/* Triangle */}
        <polygon 
          points={`${startX},${startY} ${endX},${endY} ${peakX},${peakY}`} 
          fill="#FEE2E2" 
          stroke="#EF4444" 
          strokeWidth="2.5"
        />
        
        {/* Right angle marker */}
        <polyline
          points={`${endX - 25},${endY} ${endX - 25},${endY - 25} ${endX},${endY - 25}`}
          fill="none"
          stroke="#EF4444"
          strokeWidth="2"
        />
        
        {/* Angle arc */}
        <path
          d={`M ${startX + 30} ${startY - 5} A 30 30 0 0 1 ${startX + 25} ${startY - 25}`}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.5"
        />
        
        {/* Angle label */}
        <text x={startX + 35} y={startY - 20} fill="#F59E0B" fontSize="16" fontWeight="bold">
          θ
        </text>
        
        {/* Side labels */}
        {showLabels && (
          <>
            <text x={(startX + peakX) / 2 - 25} y={(startY + peakY) / 2 - 5} fill="#10B981" fontSize="12" fontWeight="bold">
              Opposite (O)
            </text>
            
            <text x={(startX + endX) / 2} y={startY + 20} fill="#3B82F6" fontSize="12" fontWeight="bold">
              Adjacent (A)
            </text>
            
            <text x={(endX + peakX) / 2 + 10} y={(endY + peakY) / 2 - 15} fill="#8B5CF6" fontSize="12" fontWeight="bold">
              Hypotenuse (H)
            </text>
          </>
        )}
      </svg>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px',
        marginTop: '8px',
        fontSize: '12px'
      }}>
        <div style={{ color: '#F59E0B', background: '#FEF3C7', padding: '6px', borderRadius: '8px' }}>
          ∠θ = {angle}°
        </div>
        <div style={{ color: '#10B981', background: '#D1FAE5', padding: '6px', borderRadius: '8px' }}>
          Opposite = {opposite}
        </div>
        <div style={{ color: '#3B82F6', background: '#DBEAFE', padding: '6px', borderRadius: '8px' }}>
          Adjacent = {adjacent}
        </div>
        <div style={{ color: '#8B5CF6', background: '#EDE9FE', padding: '6px', borderRadius: '8px' }}>
          Hypotenuse = {hypotenuse}
        </div>
      </div>
    </div>
  );
}

// SOH-CAH-TOA Visual Component
function SOHCAHTOADisplay() {
  const [activeRatio, setActiveRatio] = useState('sin');
  
  const ratios = {
    sin: { name: 'SIN', formula: 'Opposite / Hypotenuse', example: 'sin(θ) = O/H', color: '#10B981', hint: 'SOH' },
    cos: { name: 'COS', formula: 'Adjacent / Hypotenuse', example: 'cos(θ) = A/H', color: '#3B82F6', hint: 'CAH' },
    tan: { name: 'TAN', formula: 'Opposite / Adjacent', example: 'tan(θ) = O/A', color: '#F59E0B', hint: 'TOA' }
  };
  
  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '20px',
      border: '1px solid #E2E8F0',
      marginBottom: '20px'
    }}>
      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', textAlign: 'center' }}>
        SOH-CAH-TOA Memory Aid
      </h4>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(ratios).map(([key, ratio]) => (
          <button
            key={key}
            onClick={() => setActiveRatio(key)}
            style={{
              flex: 1,
              padding: '12px',
              background: activeRatio === key ? ratio.color : '#F1F5F9',
              color: activeRatio === key ? 'white' : '#64748B',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '18px',
              transition: 'all 0.2s'
            }}
          >
            {ratio.name}
            <span style={{ display: 'block', fontSize: '10px', opacity: 0.9 }}>{ratio.hint}</span>
          </button>
        ))}
      </div>
      
      <div style={{
        background: '#F8FAFC',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>Formula</div>
        <div style={{ fontSize: '24px', fontWeight: '700', color: ratios[activeRatio].color, fontFamily: 'monospace' }}>
          {ratios[activeRatio].formula}
        </div>
        <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>
          {ratios[activeRatio].example}
        </div>
      </div>
    </div>
  );
}

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
• Understanding Angles and Triangles
• Trigonometric Ratios (SOH-CAH-TOA)
• The Unit Circle and Angle Measures
• Solving Right Triangles
• Real-World Applications

Trigonometry opens doors to physics, engineering, computer graphics, and navigation. Ready to explore the world of triangles and angles? Let's dive in!`,
      voiceText: `Welcome to Trigonometry! Trigonometry is the branch of mathematics that studies relationships between angles and sides of triangles. It's used everywhere from architecture and engineering to music and space exploration. In this course, you will learn about angles and triangles, trigonometric ratios like SOH-CAH-TOA, the unit circle, solving right triangles, and real-world applications. Ready to explore triangles and angles? Let's dive in!`,
      type: "welcome",
      button: "Let's Begin!",
      icon: "📐",
      duration: "4 min",
      keyPoints: ["Angles & Triangles", "Trigonometric Ratios", "Unit Circle", "Real Applications"]
    },
    {
      title: "Anatomy of a Right Triangle 🔺",
      content: `Before diving into trigonometry, let's understand the parts of a right triangle:

• Right Angle: The 90° angle (marked with a square)
• Hypotenuse: The longest side, opposite the right angle
• Opposite Side: The side opposite to angle θ
• Adjacent Side: The side next to angle θ

The hypotenuse is always the longest side. The opposite and adjacent sides change depending on which acute angle you're focusing on!`,
      voiceText: `Let's understand the parts of a right triangle. The right angle is 90 degrees, marked with a square. The hypotenuse is the longest side, opposite the right angle. The opposite side is opposite to angle theta. The adjacent side is next to angle theta. The hypotenuse is always the longest side.`,
      type: "concept",
      button: "Continue",
      icon: "🔺",
      duration: "5 min",
      keyPoints: ["Hypotenuse = longest side", "Opposite = across from angle", "Adjacent = next to angle"]
    },
    {
      title: "SOH-CAH-TOA Explained 📏",
      content: `The three main trigonometric ratios form the foundation of trigonometry:

📌 SINE (sin) = Opposite / Hypotenuse
📌 COSINE (cos) = Adjacent / Hypotenuse  
📌 TANGENT (tan) = Opposite / Adjacent

Remember the acronym: SOH-CAH-TOA

• SOH: Sine = Opposite / Hypotenuse
• CAH: Cosine = Adjacent / Hypotenuse
• TOA: Tangent = Opposite / Adjacent

These ratios are constant for any given angle, no matter the size of the triangle!`,
      voiceText: `The three main trigonometric ratios are sine, cosine, and tangent. Remember SOH-CAH-TOA. SOH means sine equals opposite over hypotenuse. CAH means cosine equals adjacent over hypotenuse. TOA means tangent equals opposite over adjacent. These ratios are constant for any given angle.`,
      type: "concept",
      button: "Continue",
      icon: "📏",
      duration: "6 min",
      keyPoints: ["SOH = Opposite/Hypotenuse", "CAH = Adjacent/Hypotenuse", "TOA = Opposite/Adjacent"]
    },
    {
      title: "Visual Example - 30-60-90 Triangle",
      content: `Let's see how trigonometric ratios work with a 30-60-90 triangle!

In a 30-60-90 triangle:
• sin(30°) = 1/2 = 0.5
• cos(30°) = √3/2 ≈ 0.866
• tan(30°) = 1/√3 ≈ 0.577

For the triangle shown, with angle θ = 30°:
• Opposite side = 5 units
• Hypotenuse = 10 units  
• Adjacent side = 8.66 units

Check: sin(30°) = Opposite/Hypotenuse = 5/10 = 0.5 ✓`,
      voiceText: `Let's see how trigonometric ratios work with a 30-60-90 triangle. Sine of 30 degrees is 0.5. Cosine of 30 degrees is approximately 0.866. Tangent of 30 degrees is approximately 0.577. For the triangle shown with angle 30 degrees, opposite is 5, hypotenuse is 10, adjacent is 8.66. Check: sine of 30 degrees equals opposite over hypotenuse equals 5 over 10 equals 0.5.`,
      type: "visual",
      button: "Continue",
      icon: "👁️",
      duration: "6 min",
      keyPoints: ["30° triangle ratios", "Use SOH-CAH-TOA", "Verify calculations"]
    },
    {
      title: "Practice with Ratios 🎯",
      content: `Let's test your understanding of the trigonometric ratios!

In the triangle shown:
• Opposite side = 4 units
• Adjacent side = 3 units  
• Hypotenuse = 5 units

Find sin(θ), cos(θ), and tan(θ)`,
      voiceText: `Let's practice the ratios. In this right triangle, opposite side is 4, adjacent side is 3, hypotenuse is 5. Find sine, cosine, and tangent of angle theta.`,
      type: "interactive",
      question: "What is sin(θ)?",
      answer: "4/5",
      hint: "Sine = Opposite / Hypotenuse",
      explanation: "sin(θ) = Opposite/Hypotenuse = 4/5 = 0.8",
      button: "Check Answer",
      icon: "🎯",
      duration: "4 min",
      keyPoints: ["Remember SOH-CAH-TOA", "Opposite/Hypotenuse = Sine"]
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
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>6 Lessons</span>
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>~30 min</span>
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

              {/* Visual Section */}
              {currentSection === 1 && (
                <TriangleVisualizer angle={30} opposite={5} adjacent={8.66} hypotenuse={10} />
              )}
              
              {currentSection === 2 && <SOHCAHTOADisplay />}
              
              {currentSection === 3 && (
                <TriangleVisualizer angle={30} opposite={5} adjacent={8.66} hypotenuse={10} />
              )}
              
              {currentSection === 4 && (
                <TriangleVisualizer angle={53.13} opposite={4} adjacent={3} hypotenuse={5} />
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