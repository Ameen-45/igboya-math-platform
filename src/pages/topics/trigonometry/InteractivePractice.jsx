import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

// ============================================
// CUSTOM HOOKS
// ============================================

// Speech synthesis hook
const useSpeechSynthesis = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const speechSynth = useRef(null)

  const stopSpeech = useCallback(() => {
    if (speechSynth.current) {
      speechSynth.current.cancel()
    }
    setIsPlaying(false)
  }, [])

  const speakText = useCallback((text) => {
    if (isPlaying) {
      stopSpeech()
      return
    }
    
    if ('speechSynthesis' in window) {
      if (speechSynth.current) {
        speechSynth.current.cancel()
      }
      
      speechSynth.current = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.9
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => {
        setIsPlaying(false)
        console.error('Speech synthesis error')
      }
      speechSynth.current.speak(utterance)
      setIsPlaying(true)
    } else {
      console.warn('Speech synthesis not supported')
    }
  }, [isPlaying, stopSpeech])

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  return { isPlaying, speakText, stopSpeech }
}

// Problem management hook
const useProblemManager = (problems) => {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [practiceMode, setPracticeMode] = useState('guided')
  const [score, setScore] = useState(0)
  const [problemsAttempted, setProblemsAttempted] = useState(0)
  const [correctProblems, setCorrectProblems] = useState(new Set())

  const currentProblemData = problems[currentProblem]
  const currentStepData = currentProblemData?.steps[currentStep]

  const resetProblemState = useCallback(() => {
    setUserInput('')
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
    setCurrentStep(0)
  }, [])

  const goToNextStep = useCallback(() => {
    if (currentStep < currentProblemData.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep, currentProblemData])

  const goToPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const goToNextProblem = useCallback(() => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(prev => prev + 1)
      resetProblemState()
    }
  }, [currentProblem, problems.length, resetProblemState])

  const goToPrevProblem = useCallback(() => {
    if (currentProblem > 0) {
      setCurrentProblem(prev => prev - 1)
      resetProblemState()
    }
  }, [currentProblem, resetProblemState])

  const selectProblem = useCallback((index) => {
    setCurrentProblem(index)
    resetProblemState()
  }, [resetProblemState])

  const checkAnswer = useCallback(() => {
    if (isCorrect !== null) return
    
    const normalizedInput = userInput.trim().toLowerCase()
    const normalizedAnswer = currentProblemData.finalAnswer.toLowerCase()
    const isAnswerCorrect = normalizedInput === normalizedAnswer || 
                           normalizedInput === `${normalizedAnswer} ${currentProblemData.unit}`.toLowerCase()
    
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect && !correctProblems.has(currentProblem)) {
      setScore(prev => prev + 1)
      setCorrectProblems(prev => new Set([...prev, currentProblem]))
    }
    setProblemsAttempted(prev => prev + 1)
  }, [userInput, currentProblem, currentProblemData, isCorrect, correctProblems])

  return {
    currentProblem, currentStep, userInput, showHint, showSolution,
    isCorrect, practiceMode, score, problemsAttempted,
    currentProblemData, currentStepData,
    setUserInput, setShowHint, setShowSolution, setPracticeMode,
    goToNextStep, goToPrevStep, goToNextProblem, goToPrevProblem,
    selectProblem, checkAnswer, resetProblemState
  }
}

// ============================================
// REUSABLE COMPONENTS
// ============================================

const ProblemSidebar = ({ 
  problems, 
  currentProblem, 
  onSelectProblem, 
  problemsAttempted, 
  totalProblems, 
  score, 
  practiceMode, 
  onModeChange 
}) => {
  const accuracy = problemsAttempted > 0 ? Math.round((score / problemsAttempted) * 100) : 0

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4">
        <h3 className="font-semibold text-gray-800 mb-4 text-lg">Practice Problems</h3>
        <div className="space-y-2">
          {problems.map((problem, index) => (
            <button
              key={problem.id}
              onClick={() => onSelectProblem(index)}
              className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all ${
                currentProblem === index
                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  currentProblem === index ? 'bg-white text-green-500' : 'bg-green-100 text-green-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm sm:text-base">{problem.title}</div>
                  <div className="text-xs opacity-75 mt-1">{problem.type}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">📊 Your Progress</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Problems Attempted:</span>
              <span className="font-semibold text-blue-800">{problemsAttempted}/{totalProblems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Correct Answers:</span>
              <span className="font-semibold text-green-600">{score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Accuracy:</span>
              <span className="font-semibold text-blue-800">{accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">🎯 Practice Mode</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => onModeChange('guided')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                practiceMode === 'guided'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Guided
            </button>
            <button
              onClick={() => onModeChange('independent')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                practiceMode === 'independent'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Independent
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProblemHeader = ({ title, type, currentIndex, totalProblems, onSpeak, isPlaying }) => (
  <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4">
    <div>
      <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-800 mb-2">{title}</h2>
      <div className="flex items-center space-x-3">
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">{type}</span>
        <span className="text-gray-500 text-sm">Problem {currentIndex + 1} of {totalProblems}</span>
      </div>
    </div>
    <button 
      onClick={onSpeak}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
        isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
      }`}
    >
      <span>{isPlaying ? '⏹️' : '🔊'}</span>
      <span className="font-medium hidden sm:inline">{isPlaying ? 'Stop' : 'Listen'}</span>
    </button>
  </div>
)

const ProblemStatement = ({ problem, given }) => (
  <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-blue-500">
    <h3 className="font-bold text-blue-800 text-lg sm:text-xl mb-3">Problem Statement</h3>
    <p className="text-blue-700 leading-relaxed text-base sm:text-lg">{problem}</p>
    <div className="mt-4 bg-white rounded-xl p-4 border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Given:</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        {Object.entries(given).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="text-blue-600 font-medium">{key}:</span>
            <span className="text-blue-700">{value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const StepViewer = ({ step, currentStep, totalSteps, showHint, onToggleHint, onPrev, onNext, canGoPrev, canGoNext }) => (
  <div className="space-y-6 mb-6 sm:mb-8">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-gray-800 text-lg sm:text-xl">Step-by-Step Guidance</h3>
      <div className="text-sm text-gray-600">Step {currentStep + 1} of {totalSteps}</div>
    </div>

    <div className="bg-green-50 rounded-2xl p-4 sm:p-6 border-l-4 border-green-500">
      <h4 className="font-bold text-green-800 text-lg sm:text-xl mb-3">{step.title}</h4>
      <p className="text-green-700 leading-relaxed text-base sm:text-lg mb-4">{step.content}</p>

      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <button onClick={onToggleHint} className="flex items-center justify-between w-full mb-2">
          <span className="font-semibold text-yellow-800 text-sm sm:text-base">💡 Need Help?</span>
          <span className={`transform transition-transform ${showHint ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {showHint && (
          <div className="animate-fade-in">
            <p className="text-yellow-700 text-sm sm:text-base">{step.hint}</p>
          </div>
        )}
      </div>

      <div className="mt-4 bg-white rounded-xl p-4 border border-green-200">
        <h5 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Explanation:</h5>
        <p className="text-green-700 leading-relaxed text-sm sm:text-base">{step.explanation}</p>
      </div>
    </div>

    <div className="flex justify-between">
      <button onClick={onPrev} disabled={!canGoPrev}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
          !canGoPrev ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}>
        <span>←</span><span className="font-medium">Previous Step</span>
      </button>
      <button onClick={onNext} disabled={!canGoNext}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
          !canGoNext ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
        }`}>
        <span className="font-medium">Next Step</span><span>→</span>
      </button>
    </div>
  </div>
)

const AnswerInput = ({ 
  unit, userInput, onInputChange, onCheckAnswer, onToggleSolution, onReset, 
  showSolution, isCorrect, steps, finalAnswer, explanation, inputRef 
}) => (
  <div className="bg-purple-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-purple-500">
    <h3 className="font-bold text-purple-800 text-lg sm:text-xl mb-4">Your Solution</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-purple-700 font-medium mb-2 text-sm sm:text-base">
          Enter your answer {unit && `(in ${unit})`}:
        </label>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && userInput.trim() && onCheckAnswer()}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={onCheckAnswer} className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors font-semibold text-sm sm:text-base">Check Answer</button>
        <button onClick={onToggleSolution} className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-semibold text-sm sm:text-base">
          {showSolution ? 'Hide Solution' : 'Show Full Solution'}
        </button>
        <button onClick={onReset} className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold text-sm sm:text-base">Reset</button>
      </div>

      {isCorrect !== null && (
        <div className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-100 border-green-300 text-green-700' : 'bg-red-100 border-red-300 text-red-700'}`}>
          <div className="flex items-center space-x-2">
            <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p className="font-semibold">{isCorrect ? 'Correct! Well done!' : 'Not quite. Try again!'}</p>
              {!isCorrect && <p className="text-sm mt-1">Review the steps and check your calculations.</p>}
            </div>
          </div>
        </div>
      )}

      {showSolution && (
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 animate-fade-in">
          <h4 className="font-bold text-yellow-800 mb-3 text-lg">Complete Solution:</h4>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="border-l-4 border-yellow-400 pl-4 py-2">
                <h5 className="font-semibold text-yellow-700 mb-1">{step.title}</h5>
                <p className="text-yellow-600 text-sm">{step.explanation}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
            <p className="font-semibold text-green-700">Final Answer: {finalAnswer} {unit}</p>
            <p className="text-green-600 text-sm mt-1">{explanation}</p>
          </div>
        </div>
      )}
    </div>
  </div>
)

const ProblemNavigation = ({ onPrev, onNext, canPrev, canNext }) => (
  <div className="flex justify-between pt-6 border-t border-gray-200">
    <button onClick={onPrev} disabled={!canPrev}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
        !canPrev ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      }`}>
      <span>←</span><span className="font-medium">Previous Problem</span>
    </button>
    <button onClick={onNext} disabled={!canNext}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
        !canNext ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
      }`}>
      <span className="font-medium">Next Problem</span><span>→</span>
    </button>
  </div>
)

const TipsSection = () => (
  <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
    <h3 className="font-semibold text-gray-800 mb-4 text-lg">💡 Practice Tips</h3>
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      <div className="space-y-2">
        <p className="text-gray-700"><strong>Draw Diagrams:</strong> Always sketch the triangle or scenario</p>
        <p className="text-gray-700"><strong>Label Clearly:</strong> Mark known values and what you need to find</p>
        <p className="text-gray-700"><strong>Check Units:</strong> Ensure all measurements are in consistent units</p>
      </div>
      <div className="space-y-2">
        <p className="text-gray-700"><strong>Use Calculator:</strong> Have a scientific calculator ready</p>
        <p className="text-gray-700"><strong>Review Steps:</strong> Understand each step before moving forward</p>
        <p className="text-gray-700"><strong>Practice Regularly:</strong> Consistent practice builds confidence</p>
      </div>
    </div>
  </div>
)

// ============================================
// MAIN COMPONENT
// ============================================

export default function TrigonometryInteractivePractice() {
  const inputRef = useRef(null)
  const { isPlaying, speakText, stopSpeech } = useSpeechSynthesis()
  
  // ALL ORIGINAL DATA - COMPLETELY PRESERVED
  const practiceProblems = useMemo(() => [
    {
      id: 1,
      title: "Right Triangle - Finding Side Length",
      type: "right-triangle",
      problem: "In a right triangle, the hypotenuse is 13 cm and one angle is 22.6°. Find the length of the side opposite to this angle.",
      given: {
        hypotenuse: 13,
        angle: 22.6,
        opposite: "?"
      },
      steps: [
        {
          title: "Step 1: Identify the Trigonometric Ratio",
          content: "We need to find the opposite side and we know the hypotenuse. Which trigonometric ratio relates opposite and hypotenuse?",
          hint: "Remember SOH-CAH-TOA: Sine = Opposite/Hypotenuse",
          explanation: "Since we have the hypotenuse and need the opposite side, we use the sine ratio."
        },
        {
          title: "Step 2: Set Up the Equation",
          content: "Write the sine equation using the given values.",
          hint: "sin(angle) = Opposite / Hypotenuse",
          explanation: "sin(22.6°) = Opposite / 13"
        },
        {
          title: "Step 3: Solve for the Opposite Side",
          content: "Rearrange the equation to solve for the opposite side.",
          hint: "Multiply both sides by the hypotenuse",
          explanation: "Opposite = 13 × sin(22.6°)"
        },
        {
          title: "Step 4: Calculate the Value",
          content: "Use a calculator to find sin(22.6°) and complete the calculation.",
          hint: "sin(22.6°) ≈ 0.3846",
          explanation: "Opposite = 13 × 0.3846 ≈ 5 cm"
        }
      ],
      finalAnswer: "5",
      unit: "cm",
      explanation: "The side opposite to the 22.6° angle is approximately 5 cm long."
    },
    {
      id: 2,
      title: "Angle of Elevation",
      type: "application",
      problem: "A person standing 50 meters away from a tree measures the angle of elevation to the top of the tree as 30°. How tall is the tree?",
      given: {
        distance: 50,
        angle: 30,
        height: "?"
      },
      steps: [
        {
          title: "Step 1: Visualize the Scenario",
          content: "Draw a right triangle where the distance to the tree is the adjacent side, and the tree height is the opposite side.",
          hint: "The angle of elevation is between the ground and the line of sight to the top",
          explanation: "We have a right triangle with adjacent side = 50m, angle = 30°, need to find opposite side (tree height)."
        },
        {
          title: "Step 2: Choose the Correct Ratio",
          content: "Which trigonometric ratio relates the opposite and adjacent sides?",
          hint: "Remember: Tangent = Opposite/Adjacent",
          explanation: "We use tangent because we have adjacent and need opposite."
        },
        {
          title: "Step 3: Set Up the Equation",
          content: "Write the tangent equation with the given values.",
          hint: "tan(angle) = Opposite / Adjacent",
          explanation: "tan(30°) = Height / 50"
        },
        {
          title: "Step 4: Solve for Height",
          content: "Rearrange the equation to solve for height.",
          hint: "Multiply both sides by 50",
          explanation: "Height = 50 × tan(30°)"
        },
        {
          title: "Step 5: Calculate",
          content: "Use the exact value of tan(30°) and compute the height.",
          hint: "tan(30°) = 1/√3 ≈ 0.5774",
          explanation: "Height = 50 × (1/√3) ≈ 50 × 0.5774 ≈ 28.87 meters"
        }
      ],
      finalAnswer: "28.87",
      unit: "meters",
      explanation: "The tree is approximately 28.87 meters tall."
    },
    {
      id: 3,
      title: "Sine Rule Application",
      type: "sine-rule",
      problem: "In triangle ABC, angle A = 40°, angle B = 60°, and side a = 8 cm. Find the length of side b.",
      given: {
        angleA: 40,
        angleB: 60,
        sideA: 8,
        sideB: "?"
      },
      steps: [
        {
          title: "Step 1: Recall Sine Rule Formula",
          content: "Write the sine rule formula that relates sides and angles.",
          hint: "a/sinA = b/sinB = c/sinC",
          explanation: "The sine rule states: a/sinA = b/sinB"
        },
        {
          title: "Step 2: Set Up the Proportion",
          content: "Substitute the known values into the sine rule formula.",
          hint: "Use a/sinA = b/sinB",
          explanation: "8/sin(40°) = b/sin(60°)"
        },
        {
          title: "Step 3: Solve for Side b",
          content: "Rearrange the equation to isolate b.",
          hint: "Cross multiply to solve for b",
          explanation: "b = (8 × sin(60°)) / sin(40°)"
        },
        {
          title: "Step 4: Calculate Trigonometric Values",
          content: "Find the values of sin(60°) and sin(40°).",
          hint: "sin(60°) = √3/2 ≈ 0.8660, sin(40°) ≈ 0.6428",
          explanation: "sin(60°) ≈ 0.8660, sin(40°) ≈ 0.6428"
        },
        {
          title: "Step 5: Complete the Calculation",
          content: "Perform the final calculation to find side b.",
          hint: "b = (8 × 0.8660) / 0.6428",
          explanation: "b ≈ (6.928) / 0.6428 ≈ 10.78 cm"
        }
      ],
      finalAnswer: "10.78",
      unit: "cm",
      explanation: "Side b is approximately 10.78 cm long."
    },
    {
      id: 4,
      title: "Cosine Rule - Finding Side",
      type: "cosine-rule",
      problem: "In triangle ABC, sides b = 7 cm, c = 9 cm, and angle A = 50°. Find side a.",
      given: {
        sideB: 7,
        sideC: 9,
        angleA: 50,
        sideA: "?"
      },
      steps: [
        {
          title: "Step 1: Recall Cosine Rule Formula",
          content: "Write the cosine rule formula for finding a side when you know two sides and the included angle.",
          hint: "a² = b² + c² - 2bc·cosA",
          explanation: "The cosine rule for side a is: a² = b² + c² - 2bc·cosA"
        },
        {
          title: "Step 2: Substitute Known Values",
          content: "Plug in the given values into the cosine rule formula.",
          hint: "b = 7, c = 9, A = 50°",
          explanation: "a² = 7² + 9² - 2×7×9×cos(50°)"
        },
        {
          title: "Step 3: Calculate Squares and Product",
          content: "Compute the squares and the product 2bc.",
          hint: "7² = 49, 9² = 81, 2×7×9 = 126",
          explanation: "a² = 49 + 81 - 126×cos(50°) = 130 - 126×cos(50°)"
        },
        {
          title: "Step 4: Find cos(50°)",
          content: "Calculate the value of cos(50°).",
          hint: "cos(50°) ≈ 0.6428",
          explanation: "cos(50°) ≈ 0.6428"
        },
        {
          title: "Step 5: Complete the Calculation",
          content: "Finish the calculation and take the square root.",
          hint: "a² = 130 - 126×0.6428",
          explanation: "a² ≈ 130 - 80.99 = 49.01, a ≈ √49.01 ≈ 7.00 cm"
        }
      ],
      finalAnswer: "7.00",
      unit: "cm",
      explanation: "Side a is approximately 7.00 cm long."
    },
    {
      id: 5,
      title: "Trigonometric Identity",
      type: "identity",
      problem: "If sin(θ) = 3/5 and θ is in the first quadrant, find cos(θ) and tan(θ).",
      given: {
        sinTheta: "3/5",
        quadrant: "first",
        cosTheta: "?",
        tanTheta: "?"
      },
      steps: [
        {
          title: "Step 1: Use Pythagorean Identity",
          content: "Which identity relates sin²(θ) and cos²(θ)?",
          hint: "sin²(θ) + cos²(θ) = 1",
          explanation: "We use the identity: sin²(θ) + cos²(θ) = 1"
        },
        {
          title: "Step 2: Substitute sin(θ)",
          content: "Plug in the value of sin(θ) into the identity.",
          hint: "sin(θ) = 3/5, so sin²(θ) = (3/5)² = 9/25",
          explanation: "(3/5)² + cos²(θ) = 1 → 9/25 + cos²(θ) = 1"
        },
        {
          title: "Step 3: Solve for cos²(θ)",
          content: "Rearrange the equation to find cos²(θ).",
          hint: "cos²(θ) = 1 - 9/25",
          explanation: "cos²(θ) = 1 - 9/25 = 16/25"
        },
        {
          title: "Step 4: Find cos(θ)",
          content: "Take the square root to find cos(θ). Consider the quadrant.",
          hint: "In first quadrant, cos(θ) is positive",
          explanation: "cos(θ) = √(16/25) = 4/5"
        },
        {
          title: "Step 5: Find tan(θ)",
          content: "Use the definition of tangent.",
          hint: "tan(θ) = sin(θ)/cos(θ)",
          explanation: "tan(θ) = (3/5) / (4/5) = 3/4"
        }
      ],
      finalAnswer: "cos=4/5, tan=3/4",
      unit: "",
      explanation: "cos(θ) = 4/5 and tan(θ) = 3/4"
    },
    {
      id: 6,
      title: "Area of Triangle Using Trigonometry",
      type: "area",
      problem: "Find the area of a triangle with sides 8 cm and 10 cm, and the included angle between them is 60°.",
      given: {
        side1: 8,
        side2: 10,
        angle: 60,
        area: "?"
      },
      steps: [
        {
          title: "Step 1: Recall Area Formula",
          content: "What is the formula for area of a triangle when you know two sides and the included angle?",
          hint: "Area = ½ × a × b × sin(C)",
          explanation: "Area = ½ × side1 × side2 × sin(included angle)"
        },
        {
          title: "Step 2: Substitute Values",
          content: "Plug in the given values into the area formula.",
          hint: "a = 8, b = 10, C = 60°",
          explanation: "Area = ½ × 8 × 10 × sin(60°)"
        },
        {
          title: "Step 3: Calculate Product",
          content: "Compute ½ × 8 × 10.",
          hint: "½ × 8 × 10 = 40",
          explanation: "½ × 8 × 10 = 40"
        },
        {
          title: "Step 4: Find sin(60°)",
          content: "What is the exact value of sin(60°)?",
          hint: "sin(60°) = √3/2",
          explanation: "sin(60°) = √3/2 ≈ 0.8660"
        },
        {
          title: "Step 5: Complete Calculation",
          content: "Multiply to find the final area.",
          hint: "Area = 40 × (√3/2)",
          explanation: "Area = 40 × (√3/2) = 20√3 ≈ 34.64 cm²"
        }
      ],
      finalAnswer: "34.64",
      unit: "cm²",
      explanation: "The area of the triangle is approximately 34.64 cm²."
    }
  ], [])

  const {
    currentProblem, currentStep, userInput, showHint, showSolution,
    isCorrect, practiceMode, score, problemsAttempted,
    currentProblemData, currentStepData,
    setUserInput, setShowHint, setShowSolution, setPracticeMode,
    goToNextStep, goToPrevStep, goToNextProblem, goToPrevProblem,
    selectProblem, checkAnswer, resetProblemState
  } = useProblemManager(practiceProblems)

  // Auto-focus input when problem changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [currentProblem])

  // Reset state when practice mode changes
  useEffect(() => {
    resetProblemState()
  }, [practiceMode, resetProblemState])

  const handleSpeak = () => speakText(currentProblemData.problem)
  const handleModeChange = (mode) => setPracticeMode(mode)
  const handleToggleHint = () => setShowHint(prev => !prev)
  const handleToggleSolution = () => setShowSolution(prev => !prev)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-8 sm:pb-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 sm:mb-12 pt-6">
          <Link to="/topics/trigonometry" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4 text-sm sm:text-base">
            ← Back to Trigonometry Topics
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-800 mb-3 sm:mb-4">
            Interactive Trigonometry Practice
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Practice trigonometric problems with step-by-step guidance and instant feedback
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <ProblemSidebar
            problems={practiceProblems}
            currentProblem={currentProblem}
            onSelectProblem={selectProblem}
            problemsAttempted={problemsAttempted}
            totalProblems={practiceProblems.length}
            score={score}
            practiceMode={practiceMode}
            onModeChange={handleModeChange}
          />

          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/50">
              
              <ProblemHeader
                title={currentProblemData.title}
                type={currentProblemData.type}
                currentIndex={currentProblem}
                totalProblems={practiceProblems.length}
                onSpeak={handleSpeak}
                isPlaying={isPlaying}
              />

              <ProblemStatement
                problem={currentProblemData.problem}
                given={currentProblemData.given}
              />

              {practiceMode === 'guided' && (
                <StepViewer
                  step={currentStepData}
                  currentStep={currentStep}
                  totalSteps={currentProblemData.steps.length}
                  showHint={showHint}
                  onToggleHint={handleToggleHint}
                  onPrev={goToPrevStep}
                  onNext={goToNextStep}
                  canGoPrev={currentStep > 0}
                  canGoNext={currentStep < currentProblemData.steps.length - 1}
                />
              )}

              <AnswerInput
                unit={currentProblemData.unit}
                userInput={userInput}
                onInputChange={setUserInput}
                onCheckAnswer={checkAnswer}
                onToggleSolution={handleToggleSolution}
                onReset={resetProblemState}
                showSolution={showSolution}
                isCorrect={isCorrect}
                steps={currentProblemData.steps}
                finalAnswer={currentProblemData.finalAnswer}
                explanation={currentProblemData.explanation}
                inputRef={inputRef}
              />

              <ProblemNavigation
                onPrev={goToPrevProblem}
                onNext={goToNextProblem}
                canPrev={currentProblem > 0}
                canNext={currentProblem < practiceProblems.length - 1}
              />
            </div>

            <TipsSection />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}