import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function StatisticsExamples() {
  const [currentExample, setCurrentExample] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const speechSynth = useRef(null)
  
  const statisticsExamples = [
    {
      id: 1,
      title: "Mean Calculation",
      type: "central-tendency",
      difficulty: "beginner",
      problem: "Calculate the mean of the following test scores: 85, 92, 78, 96, 88, 90",
      steps: [
        {
          title: "Step 1: List the Numbers",
          content: "Write down all the given numbers:\n85, 92, 78, 96, 88, 90",
          explanation: "We start by identifying all the values in our dataset."
        },
        {
          title: "Step 2: Add All Numbers",
          content: "Sum = 85 + 92 + 78 + 96 + 88 + 90\n= 529",
          explanation: "Add all the numbers together to get the total sum."
        },
        {
          title: "Step 3: Count the Numbers",
          content: "There are 6 test scores in total.",
          explanation: "Count how many numbers are in the dataset."
        },
        {
          title: "Step 4: Calculate Mean",
          content: "Mean = Total Sum ÷ Number of Values\n= 529 ÷ 6\n= 88.17",
          explanation: "Divide the total sum by the number of values to find the mean."
        },
        {
          title: "Step 5: Interpret Result",
          content: "The mean test score is 88.17\nThis represents the average performance of all students.",
          explanation: "The mean gives us the central value of the dataset."
        }
      ],
      finalAnswer: "88.17",
      explanation: "The average test score is 88.17, meaning students typically scored around this value.",
      interactive: {
        question: "What is the mean of these scores?",
        answer: "88.17",
        hint: "Remember: Mean = Sum of all values ÷ Number of values"
      }
    },
    {
      id: 2,
      title: "Median Calculation",
      type: "central-tendency",
      difficulty: "beginner",
      problem: "Find the median of these ages: 15, 22, 18, 25, 30, 12, 16",
      steps: [
        {
          title: "Step 1: Arrange in Order",
          content: "First, arrange numbers from smallest to largest:\n12, 15, 16, 18, 22, 25, 30",
          explanation: "The median requires the data to be sorted in ascending order."
        },
        {
          title: "Step 2: Find Middle Position",
          content: "With 7 numbers, the middle position is:\n(7 + 1) ÷ 2 = 4th position",
          explanation: "For odd number of values: Middle position = (n + 1) ÷ 2"
        },
        {
          title: "Step 3: Identify Median",
          content: "The 4th number in the ordered list is: 18",
          explanation: "The median is the value at the middle position."
        },
        {
          title: "Step 4: Verify Result",
          content: "Ordered list: 12, 15, 16, [18], 22, 25, 30\nThree values on each side of 18",
          explanation: "The median splits the dataset into two equal halves."
        }
      ],
      finalAnswer: "18",
      explanation: "The median age is 18 years, meaning half the people are younger and half are older than 18.",
      interactive: {
        question: "What is the median age?",
        answer: "18",
        hint: "First sort the numbers, then find the middle value"
      }
    },
    {
      id: 3,
      title: "Mode Identification",
      type: "central-tendency",
      difficulty: "beginner",
      problem: "Find the mode of these shoe sizes: 7, 8, 8, 9, 10, 8, 7, 9, 8",
      steps: [
        {
          title: "Step 1: List All Values",
          content: "Shoe sizes: 7, 8, 8, 9, 10, 8, 7, 9, 8",
          explanation: "We start with the complete dataset."
        },
        {
          title: "Step 2: Count Frequencies",
          content: "Size 7: appears 2 times\nSize 8: appears 4 times\nSize 9: appears 2 times\nSize 10: appears 1 time",
          explanation: "Count how many times each value appears in the dataset."
        },
        {
          title: "Step 3: Find Highest Frequency",
          content: "Size 8 appears most frequently (4 times)",
          explanation: "The mode is the value with the highest frequency."
        },
        {
          title: "Step 4: Identify Mode",
          content: "Mode = 8",
          explanation: "Size 8 is the most common shoe size in this dataset."
        }
      ],
      finalAnswer: "8",
      explanation: "The mode is size 8, which is the most popular shoe size in this group.",
      interactive: {
        question: "What is the mode shoe size?",
        answer: "8",
        hint: "Count how many times each size appears"
      }
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
    if (currentStep < currentExampleData.steps.length - 1) {
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
    const normalizedInput = userInput.trim().toLowerCase()
    const normalizedAnswer = currentExampleData.interactive.answer.toLowerCase()
    
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

  const currentExampleData = statisticsExamples[currentExample]
  const currentStepData = currentExampleData.steps[currentStep]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <Link 
            to="/topics/statistics" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 text-sm"
          >
            ← Back to Statistics Topics
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-3">
            📊 Statistics Examples
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Step-by-step statistical analysis with detailed explanations
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Example List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Examples</h3>
              <div className="space-y-2">
                {statisticsExamples.map((example, index) => (
                  <button
                    key={example.id}
                    onClick={() => handleExampleChange(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      currentExample === index
                        ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        currentExample === index ? 'bg-white text-blue-500' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {example.id}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{example.title}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs">{getTypeIcon(example.type)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(example.difficulty)}`}>
                            {example.difficulty}
                          </span>
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
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              
              {/* Example Header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {currentExampleData.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentExampleData.difficulty)}`}>
                      {currentExampleData.difficulty}
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-gray-600">
                      <span>{getTypeIcon(currentExampleData.type)}</span>
                      <span>{currentExampleData.type.replace('-', ' ')}</span>
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => speakText(currentExampleData.problem + ". " + currentStepData.explanation)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    isPlaying 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <span>{isPlaying ? '⏹️' : '🔊'}</span>
                  <span className="font-medium hidden sm:inline">
                    {isPlaying ? 'Stop' : 'Listen'}
                  </span>
                </button>
              </div>

              {/* Problem Statement */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 text-lg">Problem:</h3>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {currentExampleData.problem}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Step {currentStep + 1} of {currentExampleData.steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / currentExampleData.steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / currentExampleData.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Step Content */}
              <div className="space-y-6">
                {/* Step Content */}
                <div className="bg-gray-50 rounded-2xl p-6 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-800 text-lg mb-3">
                    {currentStepData.title}
                  </h3>
                  <pre className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200 mb-3 text-sm leading-relaxed whitespace-pre-wrap">
                    {currentStepData.content}
                  </pre>
                  <p className="text-gray-600 leading-relaxed">
                    {currentStepData.explanation}
                  </p>
                </div>

                {/* Interactive Section */}
                {currentStep === currentExampleData.steps.length - 1 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3 text-lg">Try It Yourself! 💡</h4>
                    <p className="text-green-700 mb-4">{currentExampleData.interactive.question}</p>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your answer..."
                        className="w-full px-4 py-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center font-mono"
                      />
                      
                      <div className="flex gap-2">
                        <button
                          onClick={checkAnswer}
                          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          Check Answer
                        </button>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium"
                        >
                          {showHint ? 'Hide' : 'Show'} Hint
                        </button>
                      </div>

                      {showHint && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="text-yellow-700 text-sm">
                            💡 {currentExampleData.interactive.hint}
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
                              The correct answer is: {currentExampleData.interactive.answer}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Final Explanation */}
                    <div className="mt-4 bg-white rounded-lg p-4 border">
                      <p className="text-gray-700 font-medium">{currentExampleData.explanation}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  <span>←</span>
                  <span>Previous Step</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={currentStep === currentExampleData.steps.length - 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                    currentStep === currentExampleData.steps.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <span>Next Step</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Step Navigation Dots */}
            <div className="flex justify-center space-x-2">
              {currentExampleData.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentStep 
                      ? 'bg-blue-500 scale-125' 
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