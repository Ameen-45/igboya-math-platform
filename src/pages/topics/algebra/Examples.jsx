import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function AlgebraExamples() {
  const [currentExample, setCurrentExample] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const speechSynth = useRef(null)
  
  const examples = [
    {
      title: "Zero Product Rule",
      type: "quadratic",
      equation: "(x-4)(x+9)=0",
      steps: [
        {
          title: "Understand the Rule",
          content: "This equation shows the product of two numbers equals zero. The Zero Product Rule says: if two numbers multiply to give 0, then at least one of them must be 0.",
          explanation: "That means either (x-4)=0 OR (x+9)=0"
        },
        {
          title: "Solve First Part",
          content: "For (x - 4) = 0",
          explanation: "Add 4 to both sides: x - 4 + 4 = 0 + 4 → x = 4",
          working: "x - 4 = 0\nx = 4"
        },
        {
          title: "Solve Second Part",
          content: "For (x + 9) = 0",
          explanation: "Subtract 9 from both sides: x + 9 - 9 = 0 - 9 → x = -9",
          working: "x + 9 = 0\nx = -9"
        },
        {
          title: "Final Answer",
          content: "Therefore, the solutions are:",
          explanation: "x = 4 or x = -9",
          interactive: {
            question: "What are the solutions to (x-4)(x+9)=0?",
            answer: "x=4 or x=-9",
            hint: "Remember the Zero Product Rule!"
          }
        }
      ],
      visualization: {
        table: {
          headers: ["x", "(x−4)", "(x+9)", "(x−4)(x+9)"],
          rows: [
            [-9, -13, 0, 0],
            [4, 0, 13, 0],
            [0, -4, 9, -36],
            [2, -2, 11, -22]
          ]
        }
      }
    },
    {
      title: "Standard Quadratic Equation",
      type: "quadratic",
      equation: "2x² + 13x = 15",
      steps: [
        {
          title: "Step 1: Make One Side Zero",
          content: "Bring all terms to one side to set the equation to zero.",
          explanation: "Subtract 15 from both sides:\n2x² + 13x - 15 = 0",
          working: "2x² + 13x = 15\n2x² + 13x - 15 = 0"
        },
        {
          title: "Step 2: Factorize",
          content: "Find two numbers that multiply to (2 × -15) = -30 and add to 13.",
          explanation: "The numbers are 15 and -2\nSo we factorize as: (2x + 15)(x - 1) = 0",
          working: "2x² + 13x - 15 = 0\n(2x + 15)(x - 1) = 0"
        },
        {
          title: "Step 3: Apply Zero Product Rule",
          content: "Set each factor equal to zero.",
          explanation: "2x + 15 = 0 OR x - 1 = 0"
        },
        {
          title: "Step 4: Solve Each Equation",
          content: "Solve for x in each case:",
          explanation: "From 2x + 15 = 0:\n2x = -15 → x = -15/2 = -7.5\n\nFrom x - 1 = 0:\nx = 1",
          working: "2x + 15 = 0 → x = -15/2\nx - 1 = 0 → x = 1"
        },
        {
          title: "Final Answer",
          content: "The solutions are:",
          explanation: "x = -7.5 or x = 1",
          interactive: {
            question: "Solve: 2x² + 13x = 15",
            answer: "x=-7.5 or x=1",
            hint: "Don't forget to set the equation to zero first!"
          }
        }
      ]
    },
    {
      title: "Square Root Method",
      type: "quadratic",
      equation: "(x+3)² = 7",
      steps: [
        {
          title: "Step 1: Understand the Equation",
          content: "We have a squared quantity equal to a number.",
          explanation: "(x + 3)² = 7 means when we square (x + 3), we get 7."
        },
        {
          title: "Step 2: Take Square Root",
          content: "Take square root of both sides. Remember both positive and negative roots!",
          explanation: "√(x + 3)² = ±√7\nx + 3 = ±√7",
          working: "(x + 3)² = 7\nx + 3 = ±√7"
        },
        {
          title: "Step 3: Isolate x",
          content: "Solve for x by subtracting 3 from both sides.",
          explanation: "x = -3 ± √7",
          working: "x + 3 = ±√7\nx = -3 ± √7"
        },
        {
          title: "Final Answer",
          content: "The exact solutions are:",
          explanation: "x = -3 + √7 or x = -3 - √7",
          interactive: {
            question: "Solve: (x+3)² = 7",
            answer: "x=-3+√7 or x=-3-√7",
            hint: "Remember the ± symbol when taking square roots!"
          }
        }
      ]
    },
    {
      title: "Completing the Square",
      type: "completing-square",
      equation: "x² + 6x",
      steps: [
        {
          title: "Step 1: Understand the Goal",
          content: "We want to add a number to make x² + 6x a perfect square.",
          explanation: "A perfect square looks like: (x + a)² = x² + 2ax + a²"
        },
        {
          title: "Step 2: Compare Coefficients",
          content: "Compare x² + 6x + k with (x + a)² = x² + 2ax + a²",
          explanation: "Coefficient of x: 6 = 2a → a = 3"
        },
        {
          title: "Step 3: Find the Constant",
          content: "The constant term needed is a²",
          explanation: "a = 3, so k = a² = 3² = 9",
          working: "k = (6/2)² = 3² = 9"
        },
        {
          title: "Step 4: Write Perfect Square",
          content: "Add 9 to complete the square:",
          explanation: "x² + 6x + 9 = (x + 3)²",
          working: "x² + 6x + 9 = (x + 3)²"
        },
        {
          title: "Practice Problem",
          content: "What should be added to d² - 5d to make it a perfect square?",
          explanation: "Use the formula: (b/2)² where b = -5\n(-5/2)² = 25/4",
          interactive: {
            question: "Complete the square for d² - 5d",
            answer: "25/4",
            hint: "Use the formula: take half of the coefficient of d, then square it!"
          }
        }
      ]
    },
    {
      title: "Quadratic Formula",
      type: "formula",
      equation: "3x² - 5x - 7 = 0",
      steps: [
        {
          title: "Step 1: Identify Coefficients",
          content: "Compare with standard form: ax² + bx + c = 0",
          explanation: "a = 3, b = -5, c = -7"
        },
        {
          title: "Step 2: Write the Formula",
          content: "Quadratic formula:",
          explanation: "x = [-b ± √(b² - 4ac)] / 2a"
        },
        {
          title: "Step 3: Substitute Values",
          content: "Plug in the values:",
          explanation: "x = [5 ± √((-5)² - 4×3×(-7))] / (2×3)\n= [5 ± √(25 + 84)] / 6\n= [5 ± √109] / 6",
          working: "x = [5 ± √(25 + 84)] / 6\n= [5 ± √109] / 6"
        },
        {
          title: "Step 4: Calculate Roots",
          content: "Simplify the expression:",
          explanation: "√109 ≈ 10.44\nSo: x ≈ (5 + 10.44)/6 ≈ 2.57\nor x ≈ (5 - 10.44)/6 ≈ -0.91",
          working: "x ≈ 15.44/6 ≈ 2.57\nx ≈ -5.44/6 ≈ -0.91"
        },
        {
          title: "Final Answer",
          content: "Rounded to 2 decimal places:",
          explanation: "x = 2.57 or x = -0.91"
        }
      ]
    },
    {
      title: "Word Problems - Number Puzzle",
      type: "word-problem",
      problem: "Find two numbers whose difference is 5 and product is 266",
      steps: [
        {
          title: "Step 1: Define Variables",
          content: "Let the smaller number be x",
          explanation: "Then larger number = x + 5 (since difference is 5)"
        },
        {
          title: "Step 2: Write Equation",
          content: "Their product is 266:",
          explanation: "x(x + 5) = 266"
        },
        {
          title: "Step 3: Expand and Rearrange",
          content: "Expand and set to zero:",
          explanation: "x² + 5x = 266\nx² + 5x - 266 = 0",
          working: "x(x + 5) = 266\nx² + 5x - 266 = 0"
        },
        {
          title: "Step 4: Factorize",
          content: "Find factors of -266 that add to 5:",
          explanation: "Numbers are 19 and -14\n(x - 14)(x + 19) = 0",
          working: "x² + 5x - 266 = (x - 14)(x + 19)"
        },
        {
          title: "Step 5: Solve",
          content: "Set each factor to zero:",
          explanation: "x - 14 = 0 → x = 14\nx + 19 = 0 → x = -19"
        },
        {
          title: "Step 6: Find Number Pairs",
          content: "For each x, find the corresponding larger number:",
          explanation: "If x = 14, larger = 19 → (14, 19)\nIf x = -19, larger = -14 → (-19, -14)"
        },
        {
          title: "Step 7: Verify",
          content: "Check the products:",
          explanation: "14 × 19 = 266 ✓\n-19 × -14 = 266 ✓"
        }
      ]
    },
    {
      title: "Word Problems - Age Puzzle",
      type: "word-problem",
      problem: "A woman is 4 times older than her child. 5 years ago, product of their ages was 175. Find present ages.",
      steps: [
        {
          title: "Step 1: Define Variables",
          content: "Let child's present age = x",
          explanation: "Then mother's present age = 4x"
        },
        {
          title: "Step 2: Ages 5 Years Ago",
          content: "Five years ago:",
          explanation: "Child's age = x - 5\nMother's age = 4x - 5"
        },
        {
          title: "Step 3: Write Equation",
          content: "Product of ages 5 years ago was 175:",
          explanation: "(x - 5)(4x - 5) = 175"
        },
        {
          title: "Step 4: Expand and Simplify",
          content: "Expand and bring all terms to one side:",
          explanation: "4x² - 25x + 25 = 175\n4x² - 25x - 150 = 0",
          working: "(x-5)(4x-5) = 175\n4x² - 25x + 25 = 175\n4x² - 25x - 150 = 0"
        },
        {
          title: "Step 5: Factorize",
          content: "Factor the quadratic:",
          explanation: "(4x + 15)(x - 10) = 0",
          working: "4x² - 25x - 150 = (4x + 15)(x - 10)"
        },
        {
          title: "Step 6: Solve",
          content: "Set each factor to zero:",
          explanation: "x - 10 = 0 → x = 10\n4x + 15 = 0 → x = -15/4"
        },
        {
          title: "Step 7: Reject Invalid Solution",
          content: "Age cannot be negative:",
          explanation: "x = -15/4 is invalid\nSo x = 10"
        },
        {
          title: "Step 8: Find Ages",
          content: "Present ages:",
          explanation: "Child: 10 years\nMother: 4 × 10 = 40 years"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-8 sm:pb-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 pt-6">
          <Link 
            to="/topics/algebra" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 text-sm sm:text-base"
          >
            ← Back to Algebra Topics
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-800 mb-3 sm:mb-4">
            Algebra Examples & Practice
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Step-by-step interactive examples to master quadratic equations and word problems
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
                        ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        currentExample === index ? 'bg-white text-blue-500' : 'bg-blue-100 text-blue-600'
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
                  <div className="text-lg sm:text-2xl font-mono bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text font-bold">
                    {currentExampleData.equation || currentExampleData.problem}
                  </div>
                </div>
                
                <button 
                  onClick={() => speakText(currentStepData.content + ". " + currentStepData.explanation)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isPlaying 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
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
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / currentExampleData.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Step Content */}
              <div className="space-y-6">
                {/* Step Title and Content */}
                <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-800 text-lg sm:text-xl mb-3">
                    {currentStepData.title}
                  </h3>
                  <p className="text-blue-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
                    {currentStepData.content}
                  </p>
                </div>

                {/* Explanation */}
                {currentStepData.explanation && (
                  <div className="bg-green-50 rounded-2xl p-4 sm:p-6 border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Explanation:</h4>
                    <p className="text-green-700 leading-relaxed whitespace-pre-line text-base">
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

                {/* Visualization Table */}
                {currentExample === 0 && currentStep === 3 && currentExampleData.visualization?.table && (
                  <div className="bg-yellow-50 rounded-2xl p-4 sm:p-6 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-yellow-800 mb-4 text-sm sm:text-base">Visualization:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm sm:text-base">
                        <thead>
                          <tr className="bg-yellow-100">
                            {currentExampleData.visualization.table.headers.map((header, index) => (
                              <th key={index} className="p-2 sm:p-3 text-left font-semibold text-yellow-800 border-b">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentExampleData.visualization.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={`p-2 sm:p-3 border-b ${
                                  cell === 0 ? 'font-bold text-green-600' : 'text-gray-700'
                                }`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-yellow-700 mt-3 text-sm">
                      Notice: Only when x = -9 or x = 4 does the product become zero!
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
                      {currentStep === 0 ? "Ready to begin our mathematical journey? 🚀" :
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
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
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
                      ? 'bg-blue-500 scale-125' 
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