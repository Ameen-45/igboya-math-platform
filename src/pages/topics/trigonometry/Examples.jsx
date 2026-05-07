import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

// Triangle Visualizer Component
function TriangleVisualizer({ angle = 30, opposite = 5, adjacent = 8.66, hypotenuse = 10, showLabels = true, type = 'right', unknown = null }) {
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
        {type === 'right' && (
          <polyline
            points={`${endX - 25},${endY} ${endX - 25},${endY - 25} ${endX},${endY - 25}`}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
          />
        )}
        
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
            <text x={(startX + peakX) / 2 - 25} y={(startY + peakY) / 2 - 5} fill={unknown === 'opposite' ? '#EF4444' : '#10B981'} fontSize="12" fontWeight="bold">
              Opposite {unknown === 'opposite' && '= ?'} ({opposite})
            </text>
            
            <text x={(startX + endX) / 2} y={startY + 20} fill={unknown === 'adjacent' ? '#EF4444' : '#3B82F6'} fontSize="12" fontWeight="bold">
              Adjacent ({adjacent})
            </text>
            
            <text x={(endX + peakX) / 2 + 10} y={(endY + peakY) / 2 - 15} fill={unknown === 'hypotenuse' ? '#EF4444' : '#8B5CF6'} fontSize="12" fontWeight="bold">
              Hypotenuse ({hypotenuse})
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
        <div style={{ background: '#FEF3C7', padding: '6px', borderRadius: '8px' }}>
          <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>∠θ = {angle}°</span>
        </div>
        <div style={{ background: '#D1FAE5', padding: '6px', borderRadius: '8px' }}>
          <span style={{ color: '#10B981', fontWeight: 'bold' }}>Opposite = {opposite}</span>
        </div>
        <div style={{ background: '#DBEAFE', padding: '6px', borderRadius: '8px' }}>
          <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>Adjacent = {adjacent}</span>
        </div>
        <div style={{ background: '#EDE9FE', padding: '6px', borderRadius: '8px' }}>
          <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>Hypotenuse = {hypotenuse}</span>
        </div>
      </div>
    </div>
  );
}

// SOH-CAH-TOA Helper Component
function SOHCAHTOAHelper({ activeRatio = 'sin' }) {
  const ratios = {
    sin: { formula: 'sin(θ) = Opposite / Hypotenuse', color: '#10B981', example: 'sin(θ) = O/H' },
    cos: { formula: 'cos(θ) = Adjacent / Hypotenuse', color: '#3B82F6', example: 'cos(θ) = A/H' },
    tan: { formula: 'tan(θ) = Opposite / Adjacent', color: '#F59E0B', example: 'tan(θ) = O/A' }
  };
  
  return (
    <div style={{
      background: '#F8FAFC',
      borderRadius: '16px',
      padding: '16px',
      marginBottom: '20px',
      border: '1px solid #E2E8F0'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', color: '#64748B' }}>Using</span>
        <span style={{ fontSize: '18px', fontWeight: '700', color: ratios[activeRatio].color, marginLeft: '8px' }}>
          {activeRatio.toUpperCase()}
        </span>
      </div>
      <div style={{ fontSize: '16px', fontWeight: '600', textAlign: 'center', color: ratios[activeRatio].color }}>
        {ratios[activeRatio].formula}
      </div>
      <div style={{ fontSize: '12px', textAlign: 'center', color: '#94A3B8', marginTop: '8px' }}>
        {ratios[activeRatio].example}
      </div>
    </div>
  );
}

export default function TrigonometryExamples() {
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

  const examples = [
    {
      title: "Basic Right Triangle",
      type: "right-triangle",
      equation: "Find side length in right triangle",
      problem: "In a right triangle, hypotenuse = 10, angle = 30°. Find opposite side.",
      voiceText: "Example 1: Basic Right Triangle. Find the opposite side.",
      triangleData: { angle: 30, opposite: '?', adjacent: 8.66, hypotenuse: 10, unknown: 'opposite' },
      steps: [
        {
          title: "Step 1: Identify Known Values",
          content: "We have a right triangle with:\n- Hypotenuse = 10\n- Angle θ = 30°\n- Need to find: Opposite side",
          explanation: "We'll use the sine ratio since we have hypotenuse and need opposite side.",
          voiceText: "Step 1. Identify known values. Hypotenuse is 10, angle is 30 degrees. Need to find opposite side.",
          ratio: 'sin'
        },
        {
          title: "Step 2: Choose Correct Ratio",
          content: "Recall SOH-CAH-TOA:\nSine = Opposite/Hypotenuse",
          explanation: "Since we need opposite side and have hypotenuse, we use sine.",
          voiceText: "Step 2. Choose correct ratio. Using SOH-CAH-TOA, sine equals opposite over hypotenuse.",
          ratio: 'sin'
        },
        {
          title: "Step 3: Set Up Equation",
          content: "Write the sine equation:",
          explanation: "sin(30°) = Opposite / 10",
          working: "sin(θ) = Opposite/Hypotenuse\nsin(30°) = Opposite/10",
          voiceText: "Step 3. Set up equation. Sin of 30 degrees equals opposite over 10.",
          ratio: 'sin'
        },
        {
          title: "Step 4: Solve for Opposite",
          content: "Multiply both sides by 10:",
          explanation: "Opposite = 10 × sin(30°)",
          working: "Opposite = 10 × sin(30°)\nOpposite = 10 × 0.5\nOpposite = 5",
          voiceText: "Step 4. Solve for opposite. Multiply both sides by 10. Opposite equals 10 times sin of 30 degrees, which is 10 times 0.5 equals 5.",
          ratio: 'sin'
        },
        {
          title: "Final Answer",
          content: "The opposite side length is:",
          explanation: "5 units",
          voiceText: "Final answer. The opposite side length is 5 units.",
          interactive: {
            question: "What is the length of the opposite side?",
            answer: "5",
            hint: "Remember sin(30°) = 0.5",
            voiceText: "What is the length of the opposite side?"
          }
        }
      ]
    },
    {
      title: "Finding Missing Angle",
      type: "right-triangle",
      equation: "Find angle using inverse trig",
      problem: "In a right triangle, opposite = 6, hypotenuse = 10. Find angle θ.",
      voiceText: "Example 2. Finding Missing Angle. Find angle theta.",
      triangleData: { angle: '?', opposite: 6, adjacent: 8, hypotenuse: 10, unknown: 'angle' },
      steps: [
        {
          title: "Step 1: Identify Known Values",
          content: "We have:\n- Opposite side = 6\n- Hypotenuse = 10\n- Need to find: Angle θ",
          explanation: "We'll use inverse sine since we have opposite and hypotenuse.",
          voiceText: "Step 1. Identify known values. Opposite is 6, hypotenuse is 10. Need to find angle theta.",
          ratio: 'sin'
        },
        {
          title: "Step 2: Set Up Sine Ratio",
          content: "Write the sine equation:",
          explanation: "sin(θ) = Opposite/Hypotenuse = 6/10 = 0.6",
          working: "sin(θ) = 6/10 = 0.6",
          voiceText: "Step 2. Set up sine ratio. Sin of theta equals opposite over hypotenuse equals 6 over 10 equals 0.6.",
          ratio: 'sin'
        },
        {
          title: "Step 3: Use Inverse Sine",
          content: "Apply inverse sine to both sides:",
          explanation: "θ = sin⁻¹(0.6)",
          working: "θ = sin⁻¹(0.6)",
          voiceText: "Step 3. Use inverse sine. Theta equals inverse sine of 0.6.",
          ratio: 'sin'
        },
        {
          title: "Step 4: Calculate Angle",
          content: "Use calculator or known value:",
          explanation: "θ ≈ 36.87°",
          working: "sin⁻¹(0.6) ≈ 36.87°",
          voiceText: "Step 4. Calculate angle. Theta is approximately 36.87 degrees.",
          ratio: 'sin'
        },
        {
          title: "Final Answer",
          content: "The angle θ is approximately:",
          explanation: "36.87°",
          voiceText: "Final answer. The angle is approximately 36.87 degrees.",
          interactive: {
            question: "What is angle θ in degrees?",
            answer: "36.87",
            hint: "Use inverse sine function",
            voiceText: "What is angle theta in degrees?"
          }
        }
      ]
    },
    {
      title: "Angle of Elevation",
      type: "word-problem",
      problem: "A 20m ladder leans against a wall. The base is 5m from the wall. Find the angle with the ground.",
      voiceText: "Example 3. Angle of Elevation. Find the angle.",
      triangleData: { angle: '?', opposite: 19.36, adjacent: 5, hypotenuse: 20, unknown: 'angle' },
      steps: [
        {
          title: "Step 1: Visualize the Problem",
          content: "We have a right triangle:\n- Hypotenuse (ladder) = 20m\n- Adjacent (distance from wall) = 5m\n- Need: Angle with ground",
          explanation: "The angle we need is between the ladder and the ground.",
          voiceText: "Step 1. Visualize the problem. Ladder is hypotenuse 20 meters. Distance from wall is adjacent 5 meters.",
          ratio: 'cos'
        },
        {
          title: "Step 2: Choose Correct Ratio",
          content: "We have adjacent and hypotenuse, so use cosine:",
          explanation: "cos(θ) = Adjacent/Hypotenuse",
          voiceText: "Step 2. Choose correct ratio. Use cosine equals adjacent over hypotenuse.",
          ratio: 'cos'
        },
        {
          title: "Step 3: Set Up Equation",
          content: "Write the cosine equation:",
          explanation: "cos(θ) = 5/20 = 0.25",
          working: "cos(θ) = Adjacent/Hypotenuse = 5/20 = 0.25",
          voiceText: "Step 3. Set up equation. Cos theta equals 5 over 20 equals 0.25.",
          ratio: 'cos'
        },
        {
          title: "Step 4: Find Angle",
          content: "Use inverse cosine:",
          explanation: "θ = cos⁻¹(0.25) ≈ 75.52°",
          working: "θ = cos⁻¹(0.25) ≈ 75.52°",
          voiceText: "Step 4. Find angle. Theta equals inverse cosine of 0.25, approximately 75.52 degrees.",
          ratio: 'cos'
        },
        {
          title: "Final Answer",
          content: "The ladder makes an angle of:",
          explanation: "approximately 75.52° with the ground",
          voiceText: "Final answer. The ladder makes an angle of approximately 75.52 degrees with the ground.",
          interactive: {
            question: "What is the angle in degrees?",
            answer: "75.52",
            hint: "Use inverse cosine function",
            voiceText: "What is the angle in degrees?"
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
    if (currentStep < examples[currentExample].steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      setTimeout(() => {
        const nextStepData = examples[currentExample].steps[currentStep + 1]
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
        const prevStepData = examples[currentExample].steps[currentStep - 1]
        if (prevStepData) {
          speakText(prevStepData.voiceText || `${prevStepData.title}. ${prevStepData.content} ${prevStepData.explanation || ''}`)
        }
      }, 200)
    }
  }

  const checkAnswer = () => {
    const currentInteractive = examples[currentExample].steps[currentStep]?.interactive
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
      speakText(`${examples[index].title}. ${examples[index].voiceText || examples[index].problem}`)
    }, 200)
  }

  useEffect(() => {
    setTimeout(() => {
      speakText(`${examples[0].title}. ${examples[0].voiceText}`)
    }, 500)
    return () => stopSpeech()
  }, [])

  const currentExampleData = examples[currentExample]
  const currentStepData = currentExampleData.steps[currentStep]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/topics/trigonometry" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EF4444',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Trigonometry Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #EF4444, #DC2626, #B91C1C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Trigonometry Examples
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Step-by-step examples to master triangles, angles, and trigonometric functions
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
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleChange(index)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: isMobile ? '12px' : '14px',
                      borderRadius: '14px',
                      border: currentExample === index ? '2px solid #EF4444' : '1px solid #E2E8F0',
                      background: currentExample === index ? '#FEE2E2' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '10px',
                        background: currentExample === index ? '#EF4444' : '#E2E8F0',
                        color: currentExample === index ? 'white' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: currentExample === index ? '#DC2626' : '#0F172A' }}>
                          {example.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {example.steps.length} steps
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
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
                  <div style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontFamily: 'monospace',
                    color: '#DC2626',
                    fontWeight: '600'
                  }}>
                    {currentExampleData.equation || currentExampleData.problem}
                  </div>
                </div>
                
                <button 
                  onClick={() => speakText(currentStepData.voiceText || `${currentStepData.title}. ${currentStepData.content} ${currentStepData.explanation || ''}`)}
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

              {/* Triangle Visualization */}
              {currentExampleData.triangleData && (
                <TriangleVisualizer 
                  angle={currentExampleData.triangleData.angle}
                  opposite={currentExampleData.triangleData.opposite}
                  adjacent={currentExampleData.triangleData.adjacent}
                  hypotenuse={currentExampleData.triangleData.hypotenuse}
                  unknown={currentExampleData.triangleData.unknown}
                />
              )}

              {/* SOH-CAH-TOA Helper */}
              {currentStepData.ratio && (
                <SOHCAHTOAHelper activeRatio={currentStepData.ratio} />
              )}

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
                    background: 'linear-gradient(90deg, #EF4444, #DC2626)',
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.5s'
                  }}></div>
                </div>
              </div>

              {/* Current Step Content */}
              <div>
                {/* Step Title and Content */}
                <div style={{
                  background: '#FEE2E2',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  borderLeft: '4px solid #DC2626'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#991B1B', marginBottom: '12px' }}>
                    {currentStepData.title}
                  </h3>
                  <p style={{ color: '#7F1D1D', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {currentStepData.content}
                  </p>
                </div>

                {/* Explanation */}
                {currentStepData.explanation && (
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #F59E0B'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '8px' }}>Explanation:</h4>
                    <p style={{ color: '#78350F', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {currentStepData.explanation}
                    </p>
                  </div>
                )}

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
                      margin: 0
                    }}>
                      {currentStepData.working}
                    </pre>
                  </div>
                )}

                {/* Interactive Question */}
                {currentStepData.interactive && (
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #F59E0B'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
                      Your Turn! 💡
                    </h4>
                    <p style={{ color: '#92400E', marginBottom: '16px' }}>
                      {currentStepData.interactive.question}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your answer here..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #FDE68A',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          textAlign: 'center',
                          fontFamily: 'monospace'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#FDE68A'}
                      />
                      
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={checkAnswer}
                          style={{
                            padding: '8px 20px',
                            background: '#F59E0B',
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
                            padding: '8px 20px',
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
                          <p style={{ fontSize: '13px', color: '#92400E' }}>💡 {currentStepData.interactive.hint}</p>
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
                              Hint: The answer should be: {currentStepData.interactive.answer}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      {currentStep === 0 ? "Ready to begin our trigonometric journey? 📐" :
                       currentStep < currentExampleData.steps.length - 2 ? "Great progress! Keep going! 💪" :
                       "Almost there! You're doing fantastic! 🌟"}
                    </p>
                  )}
                </div>
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
                    background: currentStep === currentExampleData.steps.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #EF4444, #DC2626)',
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
                    background: index === currentStep ? '#EF4444' : index < currentStep ? '#10B981' : '#E2E8F0',
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