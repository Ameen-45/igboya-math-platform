import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function GeometryExamples() {
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
      title: "Area of a Rectangle",
      type: "area",
      equation: "Area = length × width",
      problem: "Find the area of a rectangle with length 12 cm and width 5 cm.",
      voiceText: "Example 1: Area of a Rectangle. Find the area of a rectangle with length 12 centimeters and width 5 centimeters.",
      steps: [
        {
          title: "Step 1: Recall the Formula",
          content: "The area of a rectangle is given by: Area = length × width",
          explanation: "Area measures the space inside the rectangle.",
          voiceText: "Step 1. Recall the formula. Area equals length times width."
        },
        {
          title: "Step 2: Substitute Values",
          content: "Length = 12 cm, Width = 5 cm",
          explanation: "Plug the given measurements into the formula.",
          working: "Area = 12 cm × 5 cm",
          voiceText: "Step 2. Substitute values. Length is 12 centimeters, width is 5 centimeters."
        },
        {
          title: "Step 3: Calculate",
          content: "12 × 5 = 60",
          explanation: "Multiply the length and width.",
          working: "Area = 60 cm²",
          voiceText: "Step 3. Calculate. 12 times 5 equals 60."
        },
        {
          title: "Final Answer",
          content: "The area is 60 square centimeters.",
          explanation: "Area is always expressed in square units.",
          voiceText: "Final answer. The area is 60 square centimeters.",
          interactive: {
            question: "Find the area of a rectangle with length 15 m and width 8 m.",
            answer: "120",
            hint: "Area = length × width",
            voiceText: "Find the area of a rectangle with length 15 meters and width 8 meters."
          }
        }
      ]
    },
    {
      title: "Perimeter of a Square",
      type: "perimeter",
      equation: "Perimeter = 4 × side",
      problem: "Find the perimeter of a square with side length 7 cm.",
      voiceText: "Example 2: Perimeter of a Square. Find the perimeter of a square with side length 7 centimeters.",
      steps: [
        {
          title: "Step 1: Recall the Formula",
          content: "The perimeter of a square is: Perimeter = 4 × side",
          explanation: "Perimeter is the distance around the square.",
          voiceText: "Step 1. Recall the formula. Perimeter equals 4 times side."
        },
        {
          title: "Step 2: Substitute Values",
          content: "Side = 7 cm",
          explanation: "Place the side length into the formula.",
          working: "Perimeter = 4 × 7 cm",
          voiceText: "Step 2. Substitute values. Side is 7 centimeters."
        },
        {
          title: "Step 3: Calculate",
          content: "4 × 7 = 28",
          explanation: "Multiply the side length by 4.",
          working: "Perimeter = 28 cm",
          voiceText: "Step 3. Calculate. 4 times 7 equals 28."
        },
        {
          title: "Final Answer",
          content: "The perimeter is 28 centimeters.",
          explanation: "Perimeter is expressed in linear units.",
          voiceText: "Final answer. The perimeter is 28 centimeters.",
          interactive: {
            question: "Find the perimeter of a square with side length 9 m.",
            answer: "36",
            hint: "Perimeter = 4 × side",
            voiceText: "Find the perimeter of a square with side length 9 meters."
          }
        }
      ]
    },
    {
      title: "Area of a Triangle",
      type: "area",
      equation: "Area = ½ × base × height",
      problem: "Find the area of a triangle with base 10 cm and height 6 cm.",
      voiceText: "Example 3: Area of a Triangle. Find the area of a triangle with base 10 centimeters and height 6 centimeters.",
      steps: [
        {
          title: "Step 1: Recall the Formula",
          content: "The area of a triangle is: Area = ½ × base × height",
          explanation: "A triangle's area is half of base times height.",
          voiceText: "Step 1. Recall the formula. Area equals one half times base times height."
        },
        {
          title: "Step 2: Substitute Values",
          content: "Base = 10 cm, Height = 6 cm",
          explanation: "Plug the given measurements into the formula.",
          working: "Area = ½ × 10 cm × 6 cm",
          voiceText: "Step 2. Substitute values. Base is 10 centimeters, height is 6 centimeters."
        },
        {
          title: "Step 3: Calculate",
          content: "½ × 10 = 5, then 5 × 6 = 30",
          explanation: "First multiply base by height, then take half.",
          working: "Area = 30 cm²",
          voiceText: "Step 3. Calculate. Half of 10 is 5, times 6 equals 30."
        },
        {
          title: "Final Answer",
          content: "The area is 30 square centimeters.",
          explanation: "Area is expressed in square units.",
          voiceText: "Final answer. The area is 30 square centimeters.",
          interactive: {
            question: "Find the area of a triangle with base 12 m and height 5 m.",
            answer: "30",
            hint: "Area = ½ × base × height",
            voiceText: "Find the area of a triangle with base 12 meters and height 5 meters."
          }
        }
      ]
    },
    {
      title: "Pythagorean Theorem",
      type: "pythagorean",
      equation: "a² + b² = c²",
      problem: "In a right triangle, side a = 3 cm, side b = 4 cm. Find the hypotenuse c.",
      voiceText: "Example 4: Pythagorean Theorem. In a right triangle, sides a and b are 3 and 4 centimeters. Find hypotenuse c.",
      steps: [
        {
          title: "Step 1: Recall the Theorem",
          content: "Pythagorean Theorem: a² + b² = c²",
          explanation: "For right triangles, the square of the hypotenuse equals the sum of squares of the legs.",
          voiceText: "Step 1. Recall the theorem. a squared plus b squared equals c squared."
        },
        {
          title: "Step 2: Substitute Values",
          content: "a = 3, b = 4",
          explanation: "Place the known leg lengths into the formula.",
          working: "3² + 4² = c²",
          voiceText: "Step 2. Substitute values. a is 3, b is 4."
        },
        {
          title: "Step 3: Calculate Squares",
          content: "3² = 9, 4² = 16",
          explanation: "Square each leg length.",
          working: "9 + 16 = c²",
          voiceText: "Step 3. Calculate squares. 3 squared is 9, 4 squared is 16."
        },
        {
          title: "Step 4: Add",
          content: "9 + 16 = 25",
          explanation: "Add the squares together.",
          working: "c² = 25",
          voiceText: "Step 4. Add. 9 plus 16 equals 25."
        },
        {
          title: "Step 5: Find Square Root",
          content: "c = √25 = 5",
          explanation: "Take the square root to find c.",
          working: "c = 5 cm",
          voiceText: "Step 5. Find square root. The square root of 25 is 5."
        },
        {
          title: "Final Answer",
          content: "The hypotenuse is 5 centimeters.",
          explanation: "This is a 3-4-5 right triangle, a classic Pythagorean triple.",
          voiceText: "Final answer. The hypotenuse is 5 centimeters.",
          interactive: {
            question: "In a right triangle, a = 5, b = 12. Find the hypotenuse c.",
            answer: "13",
            hint: "Use a² + b² = c²",
            voiceText: "In a right triangle, a equals 5, b equals 12. Find the hypotenuse c."
          }
        }
      ]
    },
    {
      title: "Circumference of a Circle",
      type: "circle",
      equation: "C = 2πr",
      problem: "Find the circumference of a circle with radius 7 cm. Use π ≈ 3.14.",
      voiceText: "Example 5: Circumference of a Circle. Find the circumference of a circle with radius 7 centimeters. Use pi as 3.14.",
      steps: [
        {
          title: "Step 1: Recall the Formula",
          content: "Circumference of a circle: C = 2πr",
          explanation: "Circumference is the distance around the circle.",
          voiceText: "Step 1. Recall the formula. Circumference equals 2 pi times radius."
        },
        {
          title: "Step 2: Substitute Values",
          content: "r = 7 cm, π ≈ 3.14",
          explanation: "Place the radius into the formula.",
          working: "C = 2 × 3.14 × 7",
          voiceText: "Step 2. Substitute values. Radius is 7 centimeters, pi is 3.14."
        },
        {
          title: "Step 3: Multiply",
          content: "2 × 3.14 = 6.28",
          explanation: "First multiply 2 and π.",
          working: "C = 6.28 × 7",
          voiceText: "Step 3. Multiply. 2 times 3.14 equals 6.28."
        },
        {
          title: "Step 4: Calculate",
          content: "6.28 × 7 = 43.96",
          explanation: "Complete the multiplication.",
          working: "C = 43.96 cm",
          voiceText: "Step 4. Calculate. 6.28 times 7 equals 43.96."
        },
        {
          title: "Final Answer",
          content: "The circumference is 43.96 centimeters.",
          explanation: "Circumference is expressed in linear units.",
          voiceText: "Final answer. The circumference is 43.96 centimeters.",
          interactive: {
            question: "Find the circumference of a circle with radius 5 m. Use π ≈ 3.14.",
            answer: "31.4",
            hint: "C = 2πr",
            voiceText: "Find the circumference of a circle with radius 5 meters. Use pi as 3.14."
          }
        }
      ]
    },
    {
      title: "Area of a Circle",
      type: "circle",
      equation: "A = πr²",
      problem: "Find the area of a circle with radius 4 cm. Use π ≈ 3.14.",
      voiceText: "Example 6: Area of a Circle. Find the area of a circle with radius 4 centimeters. Use pi as 3.14.",
      steps: [
        {
          title: "Step 1: Recall the Formula",
          content: "Area of a circle: A = πr²",
          explanation: "Area is the space inside the circle.",
          voiceText: "Step 1. Recall the formula. Area equals pi times radius squared."
        },
        {
          title: "Step 2: Substitute Values",
          content: "r = 4 cm, π ≈ 3.14",
          explanation: "Place the radius into the formula.",
          working: "A = 3.14 × 4²",
          voiceText: "Step 2. Substitute values. Radius is 4 centimeters, pi is 3.14."
        },
        {
          title: "Step 3: Square the Radius",
          content: "4² = 16",
          explanation: "First square the radius.",
          working: "A = 3.14 × 16",
          voiceText: "Step 3. Square the radius. 4 squared is 16."
        },
        {
          title: "Step 4: Multiply",
          content: "3.14 × 16 = 50.24",
          explanation: "Multiply π by the squared radius.",
          working: "A = 50.24 cm²",
          voiceText: "Step 4. Multiply. 3.14 times 16 equals 50.24."
        },
        {
          title: "Final Answer",
          content: "The area is 50.24 square centimeters.",
          explanation: "Area is expressed in square units.",
          voiceText: "Final answer. The area is 50.24 square centimeters.",
          interactive: {
            question: "Find the area of a circle with radius 6 m. Use π ≈ 3.14.",
            answer: "113.04",
            hint: "A = πr²",
            voiceText: "Find the area of a circle with radius 6 meters. Use pi as 3.14."
          }
        }
      ]
    },
    {
      title: "Volume of a Rectangular Prism",
      type: "volume",
      equation: "V = l × w × h",
      problem: "Find the volume of a rectangular prism with length 8 cm, width 3 cm, and height 5 cm.",
      voiceText: "Example 7: Volume of a Rectangular Prism. Find the volume with length 8 centimeters, width 3 centimeters, height 5 centimeters.",
      steps: [
        {
          title: "Step 1: Recall the Formula",
          content: "Volume of a rectangular prism: V = l × w × h",
          explanation: "Volume measures the space inside a 3D object.",
          voiceText: "Step 1. Recall the formula. Volume equals length times width times height."
        },
        {
          title: "Step 2: Substitute Values",
          content: "l = 8 cm, w = 3 cm, h = 5 cm",
          explanation: "Place the dimensions into the formula.",
          working: "V = 8 × 3 × 5",
          voiceText: "Step 2. Substitute values. Length is 8, width is 3, height is 5."
        },
        {
          title: "Step 3: Multiply",
          content: "8 × 3 = 24, then 24 × 5 = 120",
          explanation: "Multiply in any order.",
          working: "V = 120 cm³",
          voiceText: "Step 3. Multiply. 8 times 3 equals 24, times 5 equals 120."
        },
        {
          title: "Final Answer",
          content: "The volume is 120 cubic centimeters.",
          explanation: "Volume is expressed in cubic units.",
          voiceText: "Final answer. The volume is 120 cubic centimeters.",
          interactive: {
            question: "Find the volume of a rectangular prism with l = 10 m, w = 4 m, h = 2 m.",
            answer: "80",
            hint: "V = l × w × h",
            voiceText: "Find volume with length 10 meters, width 4 meters, height 2 meters."
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
          <Link to="/topics/geometry" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#10B981',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Geometry Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10B981, #059669, #047857)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Geometry Examples
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Step-by-step examples to master geometric formulas and calculations
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
                      border: currentExample === index ? '2px solid #10B981' : '1px solid #E2E8F0',
                      background: currentExample === index ? '#DCFCE7' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '10px',
                        background: currentExample === index ? '#10B981' : '#E2E8F0',
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
                        <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: currentExample === index ? '#059669' : '#0F172A' }}>
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
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    {currentExampleData.equation}
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

              {/* Problem Statement */}
              <div style={{
                background: '#DCFCE7',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid #86EFAC'
              }}>
                <h3 style={{ fontWeight: '600', color: '#065F46', marginBottom: '8px', fontSize: '14px' }}>Problem:</h3>
                <p style={{ color: '#065F46', fontSize: isMobile ? '15px' : '16px', lineHeight: '1.6' }}>
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
                    background: 'linear-gradient(90deg, #10B981, #059669)',
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
                  background: '#DCFCE7',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  borderLeft: '4px solid #059669'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', marginBottom: '12px' }}>
                    {currentStepData.title}
                  </h3>
                  <p style={{ color: '#065F46', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
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
                      {currentStep === 0 ? "Ready to begin our geometry journey? 📐" :
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
                    background: currentStep === currentExampleData.steps.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #10B981, #059669)',
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
                    background: index === currentStep ? '#10B981' : index < currentStep ? '#10B981' : '#E2E8F0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: index < currentStep ? 0.5 : 1
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