import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function TrigonometryExamples() {
  const [currentExample, setCurrentExample] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const speechSynth = useRef(null)
  
  const examples = [
    {
      title: "Basic Right Triangle",
      type: "right-triangle",
      equation: "Find side length in right triangle",
      problem: "In a right triangle, hypotenuse = 10, angle = 30°. Find opposite side.",
      steps: [
        {
          title: "Step 1: Identify Known Values",
          content: "We have a right triangle with:\n- Hypotenuse = 10\n- Angle θ = 30°\n- Need to find: Opposite side",
          explanation: "We'll use the sine ratio since we have hypotenuse and need opposite side."
        },
        {
          title: "Step 2: Choose Correct Ratio",
          content: "Recall SOH-CAH-TOA:\nSine = Opposite/Hypotenuse",
          explanation: "Since we need opposite side and have hypotenuse, we use sine."
        },
        {
          title: "Step 3: Set Up Equation",
          content: "Write the sine equation:",
          explanation: "sin(30°) = Opposite / 10",
          working: "sin(θ) = Opposite/Hypotenuse\nsin(30°) = Opposite/10"
        },
        {
          title: "Step 4: Solve for Opposite",
          content: "Multiply both sides by 10:",
          explanation: "Opposite = 10 × sin(30°)",
          working: "Opposite = 10 × sin(30°)\nOpposite = 10 × 0.5\nOpposite = 5"
        },
        {
          title: "Final Answer",
          content: "The opposite side length is:",
          explanation: "5 units",
          interactive: {
            question: "What is the length of the opposite side?",
            answer: "5",
            hint: "Remember sin(30°) = 0.5"
          }
        }
      ],
      visualization: {
        triangle: {
          hypotenuse: 10,
          opposite: 5,
          adjacent: "?",
          angle: 30
        }
      }
    },
    {
      title: "Finding Missing Angle",
      type: "right-triangle",
      equation: "Find angle using inverse trig",
      problem: "In a right triangle, opposite = 6, hypotenuse = 10. Find angle θ.",
      steps: [
        {
          title: "Step 1: Identify Known Values",
          content: "We have:\n- Opposite side = 6\n- Hypotenuse = 10\n- Need to find: Angle θ",
          explanation: "We'll use inverse sine since we have opposite and hypotenuse."
        },
        {
          title: "Step 2: Set Up Sine Ratio",
          content: "Write the sine equation:",
          explanation: "sin(θ) = Opposite/Hypotenuse = 6/10 = 0.6",
          working: "sin(θ) = 6/10 = 0.6"
        },
        {
          title: "Step 3: Use Inverse Sine",
          content: "Apply inverse sine to both sides:",
          explanation: "θ = sin⁻¹(0.6)",
          working: "θ = sin⁻¹(0.6)"
        },
        {
          title: "Step 4: Calculate Angle",
          content: "Use calculator or known value:",
          explanation: "θ ≈ 36.87°",
          working: "sin⁻¹(0.6) ≈ 36.87°"
        },
        {
          title: "Final Answer",
          content: "The angle θ is approximately:",
          explanation: "36.87°",
          interactive: {
            question: "What is angle θ in degrees?",
            answer: "36.87",
            hint: "Use inverse sine function"
          }
        }
      ]
    },
    {
      title: "Sine Rule Application",
      type: "sine-rule",
      equation: "a/sinA = b/sinB = c/sinC",
      problem: "In triangle ABC, A=40°, B=60°, side a=8. Find side b.",
      steps: [
        {
          title: "Step 1: Write Sine Rule",
          content: "The sine rule states:",
          explanation: "a/sinA = b/sinB = c/sinC"
        },
        {
          title: "Step 2: Set Up Proportion",
          content: "Use the given values:",
          explanation: "8/sin(40°) = b/sin(60°)",
          working: "a/sinA = b/sinB\n8/sin40° = b/sin60°"
        },
        {
          title: "Step 3: Cross Multiply",
          content: "Solve for b:",
          explanation: "b = (8 × sin(60°)) / sin(40°)",
          working: "b = (8 × sin60°) / sin40°"
        },
        {
          title: "Step 4: Calculate Values",
          content: "Use trigonometric values:",
          explanation: "sin(60°) ≈ 0.866\nsin(40°) ≈ 0.643\nb ≈ (8 × 0.866) / 0.643 ≈ 10.78",
          working: "b ≈ (8 × 0.866) / 0.643 ≈ 6.928 / 0.643 ≈ 10.78"
        },
        {
          title: "Final Answer",
          content: "Side b is approximately:",
          explanation: "10.78 units",
          interactive: {
            question: "What is the length of side b?",
            answer: "10.78",
            hint: "Use sine rule: a/sinA = b/sinB"
          }
        }
      ]
    },
    {
      title: "Cosine Rule Application",
      type: "cosine-rule",
      equation: "a² = b² + c² - 2bc·cosA",
      problem: "In triangle ABC, sides b=7, c=9, angle A=50°. Find side a.",
      steps: [
        {
          title: "Step 1: Write Cosine Rule",
          content: "The cosine rule formula:",
          explanation: "a² = b² + c² - 2bc·cosA"
        },
        {
          title: "Step 2: Substitute Values",
          content: "Plug in the known values:",
          explanation: "a² = 7² + 9² - 2×7×9×cos(50°)",
          working: "a² = 49 + 81 - 126×cos50°"
        },
        {
          title: "Step 3: Calculate Components",
          content: "Compute each part:",
          explanation: "49 + 81 = 130\ncos(50°) ≈ 0.6428\n126 × 0.6428 ≈ 80.99",
          working: "a² = 130 - 80.99"
        },
        {
          title: "Step 4: Solve for a",
          content: "Complete the calculation:",
          explanation: "a² ≈ 130 - 80.99 = 49.01\na ≈ √49.01 ≈ 7.00",
          working: "a² ≈ 49.01\na ≈ √49.01 ≈ 7.00"
        },
        {
          title: "Final Answer",
          content: "Side a is approximately:",
          explanation: "7.00 units",
          interactive: {
            question: "What is the length of side a?",
            answer: "7.00",
            hint: "Use cosine rule: a² = b² + c² - 2bc·cosA"
          }
        }
      ]
    },
    {
      title: "Angle of Elevation",
      type: "word-problem",
      problem: "A 20m ladder leans against a wall. The base is 5m from the wall. Find the angle with the ground.",
      steps: [
        {
          title: "Step 1: Visualize the Problem",
          content: "We have a right triangle:\n- Hypotenuse (ladder) = 20m\n- Adjacent (distance from wall) = 5m\n- Need: Angle with ground",
          explanation: "The angle we need is between the ladder and the ground."
        },
        {
          title: "Step 2: Choose Correct Ratio",
          content: "We have adjacent and hypotenuse, so use cosine:",
          explanation: "cos(θ) = Adjacent/Hypotenuse"
        },
        {
          title: "Step 3: Set Up Equation",
          content: "Write the cosine equation:",
          explanation: "cos(θ) = 5/20 = 0.25",
          working: "cos(θ) = Adjacent/Hypotenuse = 5/20 = 0.25"
        },
        {
          title: "Step 4: Find Angle",
          content: "Use inverse cosine:",
          explanation: "θ = cos⁻¹(0.25) ≈ 75.52°",
          working: "θ = cos⁻¹(0.25) ≈ 75.52°"
        },
        {
          title: "Final Answer",
          content: "The ladder makes an angle of:",
          explanation: "approximately 75.52° with the ground",
          interactive: {
            question: "What is the angle in degrees?",
            answer: "75.52",
            hint: "Use inverse cosine function"
          }
        }
      ]
    },
    {
      title: "Height of a Tree",
      type: "word-problem",
      problem: "From 50m away, the angle of elevation to a tree top is 25°. Find the tree height.",
      steps: [
        {
          title: "Step 1: Understand the Situation",
          content: "We have:\n- Distance from tree (adjacent) = 50m\n- Angle of elevation = 25°\n- Need: Tree height (opposite)",
          explanation: "This forms a right triangle with the ground."
        },
        {
          title: "Step 2: Choose Correct Ratio",
          content: "We have adjacent and need opposite, so use tangent:",
          explanation: "tan(θ) = Opposite/Adjacent"
        },
        {
          title: "Step 3: Set Up Equation",
          content: "Write the tangent equation:",
          explanation: "tan(25°) = Height / 50",
          working: "tan(θ) = Opposite/Adjacent\ntan(25°) = Height/50"
        },
        {
          title: "Step 4: Solve for Height",
          content: "Multiply both sides by 50:",
          explanation: "Height = 50 × tan(25°)",
          working: "Height = 50 × tan(25°)"
        },
        {
          title: "Step 5: Calculate",
          content: "Use calculator value:",
          explanation: "tan(25°) ≈ 0.4663\nHeight ≈ 50 × 0.4663 ≈ 23.32m",
          working: "Height ≈ 50 × 0.4663 ≈ 23.32m"
        },
        {
          title: "Final Answer",
          content: "The tree height is approximately:",
          explanation: "23.32 meters",
          interactive: {
            question: "What is the tree height in meters?",
            answer: "23.32",
            hint: "Use tangent: tan(angle) = height/distance"
          }
        }
      ]
    },
    {
      title: "Periodic Functions",
      type: "periodic",
      equation: "y = 2sin(3x) + 1",
      problem: "Find amplitude, period, and vertical shift of y = 2sin(3x) + 1",
      steps: [
        {
          title: "Step 1: Identify Amplitude",
          content: "Amplitude is the coefficient of the sine function:",
          explanation: "Amplitude = |2| = 2",
          working: "For y = A·sin(Bx) + C, amplitude = |A|"
        },
        {
          title: "Step 2: Find Period",
          content: "Period is 2π divided by the coefficient of x:",
          explanation: "Period = 2π / 3",
          working: "Period = 2π / |B| = 2π / 3"
        },
        {
          title: "Step 3: Identify Vertical Shift",
          content: "Vertical shift is the constant added:",
          explanation: "Vertical shift = +1",
          working: "For y = A·sin(Bx) + C, vertical shift = C"
        },
        {
          title: "Step 4: Summary",
          content: "The function characteristics are:",
          explanation: "Amplitude: 2\nPeriod: 2π/3\nVertical shift: +1",
          working: "y = 2·sin(3x) + 1\nA=2, B=3, C=1"
        },
        {
          title: "Practice Problem",
          content: "For y = 3cos(2x) - 1, find the amplitude:",
          explanation: "Amplitude = |3| = 3",
          interactive: {
            question: "What is the amplitude of y = 3cos(2x) - 1?",
            answer: "3",
            hint: "Amplitude is the absolute value of the coefficient"
          }
        }
      ]
    }
  ]

  const stopSpeech = () => {
    if (speechSynth.current) {
      speechSynth.current.cancel()
    }
    setIsPlaying(false)
  }

  const speakText = (text) => {
    stopSpeech()
    
    if ('speechSynthesis' in window) {
      speechSynth.current = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.9
      
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      
      speechSynth.current.speak(utterance)
    }
  }

  const nextStep = () => {
    if (currentStep < examples[currentExample].steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
    }
  }

  const checkAnswer = () => {
    const currentInteractive = examples[currentExample].steps[currentStep]?.interactive
    if (!currentInteractive) return
    
    const normalizedInput = userInput.trim().toLowerCase()
    const normalizedAnswer = currentInteractive.answer.toLowerCase()
    
    setIsCorrect(normalizedInput === normalizedAnswer)
  }

  const handleExampleChange = (index) => {
    setCurrentExample(index)
    setCurrentStep(0)
    setUserInput('')
    setShowHint(false)
    setIsCorrect(null)
    stopSpeech()
  }

  useEffect(() => {
    return () => stopSpeech()
  }, [])

  const currentExampleData = examples[currentExample]
  const currentStepData = currentExampleData.steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pb-8 sm:pb-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 pt-6">
          <Link 
            to="/topics/trigonometry" 
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 mb-4 text-sm sm:text-base"
          >
            ← Back to Trigonometry Topics
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-800 mb-3 sm:mb-4">
            Trigonometry Examples & Practice
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Step-by-step interactive examples to master triangles, angles, and trigonometric functions
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Example List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Examples</h3>
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleChange(index)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all ${
                      currentExample === index
                        ? 'bg-red-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        currentExample === index ? 'bg-white text-red-500' : 'bg-red-100 text-red-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{example.title}</div>
                        <div className="text-xs opacity-75 mt-1">
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
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/50">
              
              {/* Example Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-800 mb-2">
                    {currentExampleData.title}
                  </h2>
                  <div className="text-lg sm:text-2xl font-mono bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text font-bold">
                    {currentExampleData.equation || currentExampleData.problem}
                  </div>
                </div>
                
                <button 
                  onClick={() => speakText(currentStepData.content + ". " + currentStepData.explanation)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isPlaying 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <span>{isPlaying ? '⏹️' : '🔊'}</span>
                  <span className="font-medium hidden sm:inline">
                    {isPlaying ? 'Stop' : 'Listen'}
                  </span>
                </button>
              </div>

              {/* Progress */}
              <div className="mb-6 sm:mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Step {currentStep + 1} of {currentExampleData.steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / currentExampleData.steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / currentExampleData.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Step Content */}
              <div className="space-y-6">
                {/* Step Title and Content */}
                <div className="bg-red-50 rounded-2xl p-4 sm:p-6 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 text-lg sm:text-xl mb-3">
                    {currentStepData.title}
                  </h3>
                  <p className="text-red-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                    {currentStepData.content}
                  </p>
                </div>

                {/* Explanation */}
                {currentStepData.explanation && (
                  <div className="bg-orange-50 rounded-2xl p-4 sm:p-6 border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">Explanation:</h4>
                    <p className="text-orange-700 leading-relaxed whitespace-pre-line text-base">
                      {currentStepData.explanation}
                    </p>
                  </div>
                )}

                {/* Working */}
                {currentStepData.working && (
                  <div className="bg-purple-50 rounded-2xl p-4 sm:p-6 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">Working:</h4>
                    <pre className="text-purple-700 font-mono text-sm sm:text-base whitespace-pre-wrap">
                      {currentStepData.working}
                    </pre>
                  </div>
                )}

                {/* Triangle Visualization */}
                {currentExample === 0 && currentStep >= 2 && currentStep <= 3 && (
                  <div className="bg-yellow-50 rounded-2xl p-4 sm:p-6 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-yellow-800 mb-4 text-sm sm:text-base">Triangle Visualization:</h4>
                    <div className="flex justify-center">
                      <div className="w-48 h-32 bg-white border-2 border-red-300 rounded-lg relative">
                        {/* Right Triangle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-24 border-r-2 border-b-2 border-red-500 relative">
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></div>
                            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-red-600 font-bold">30°</div>
                            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">Opposite = 5</div>
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-600">Adjacent = ?</div>
                            <div className="absolute top-1/2 right-1/2 transform translate-x-4 -translate-y-4 text-sm text-gray-600">Hypotenuse = 10</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-yellow-700 mt-3 text-sm text-center">
                      Using sine: sin(30°) = Opposite/Hypotenuse
                    </p>
                  </div>
                )}

                {/* Interactive Question */}
                {currentStepData.interactive && (
                  <div className="bg-orange-50 rounded-2xl p-4 sm:p-6 border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-800 mb-3 text-sm sm:text-base">
                      Your Turn! 💡
                    </h4>
                    <p className="text-orange-700 mb-4 text-base">
                      {currentStepData.interactive.question}
                    </p>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                      />
                      
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={checkAnswer}
                          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
                        >
                          Check Answer
                        </button>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors font-medium text-sm sm:text-base"
                        >
                          {showHint ? 'Hide' : 'Show'} Hint
                        </button>
                      </div>

                      {showHint && (
                        <div className="bg-orange-100 p-3 rounded-lg border border-orange-200">
                          <p className="text-orange-700 text-sm">
                            💡 {currentStepData.interactive.hint}
                          </p>
                        </div>
                      )}

                      {isCorrect !== null && (
                        <div className={`p-3 rounded-lg border ${
                          isCorrect 
                            ? 'bg-green-100 border-green-300 text-green-700' 
                            : 'bg-red-100 border-red-300 text-red-700'
                        }`}>
                          <p className="font-semibold">
                            {isCorrect ? '✅ Correct! Well done!' : '❌ Not quite. Try again!'}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm mt-1">
                              Hint: The answer should be in the form: {currentStepData.interactive.answer}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Motivational Messages */}
                <div className="text-center py-4">
                  {currentStep === currentExampleData.steps.length - 1 ? (
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-2xl">
                      <p className="text-lg font-semibold">🎉 Amazing! You completed this example!</p>
                      <p className="opacity-90">Ready to try another one?</p>
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">
                      {currentStep === 0 ? "Ready to begin our trigonometric journey? 📐" :
                       currentStep < currentExampleData.steps.length - 2 ? "Great progress! Keep going! 💪" :
                       "Almost there! You're doing fantastic! 🌟"}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  <span>←</span>
                  <span className="font-medium">Previous</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={currentStep === currentExampleData.steps.length - 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    currentStep === currentExampleData.steps.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  <span className="font-medium">Next</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Example Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {currentExampleData.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    index === currentStep 
                      ? 'bg-red-500 scale-125' 
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}