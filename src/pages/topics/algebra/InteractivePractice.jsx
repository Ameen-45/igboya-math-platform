import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function InteractivePractice() {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [practiceHistory, setPracticeHistory] = useState([])
  const [showCelebration, setShowCelebration] = useState(false)

  const practiceProblems = [
    {
      id: 1,
      type: 'linear',
      difficulty: 'beginner',
      problem: "Solve for x: 2x + 7 = 15",
      hint: "Try isolating x by first subtracting 7 from both sides, then dividing by 2.",
      stepByStep: [
        "Step 1: Subtract 7 from both sides\n2x + 7 - 7 = 15 - 7\n2x = 8",
        "Step 2: Divide both sides by 2\n2x ÷ 2 = 8 ÷ 2\nx = 4"
      ],
      answer: "4",
      explanation: "The solution is x = 4. You can verify by substituting back: 2(4) + 7 = 8 + 7 = 15 ✓"
    },
    {
      id: 2,
      type: 'linear',
      difficulty: 'beginner',
      problem: "Find x: 3(x - 4) = 9",
      hint: "First distribute the 3, then isolate x by adding 12 to both sides and dividing by 3.",
      stepByStep: [
        "Step 1: Distribute the 3\n3 × x - 3 × 4 = 9\n3x - 12 = 9",
        "Step 2: Add 12 to both sides\n3x - 12 + 12 = 9 + 12\n3x = 21",
        "Step 3: Divide both sides by 3\n3x ÷ 3 = 21 ÷ 3\nx = 7"
      ],
      answer: "7",
      explanation: "The solution is x = 7. Check: 3(7 - 4) = 3(3) = 9 ✓"
    },
    {
      id: 3,
      type: 'quadratic',
      difficulty: 'intermediate',
      problem: "Solve: x² - 5x + 6 = 0",
      hint: "This quadratic can be factored. Look for two numbers that multiply to 6 and add to -5.",
      stepByStep: [
        "Step 1: Factor the quadratic\nWe need numbers that multiply to 6 and add to -5\nThese are -2 and -3\n(x - 2)(x - 3) = 0",
        "Step 2: Apply zero product property\nx - 2 = 0 or x - 3 = 0",
        "Step 3: Solve each equation\nx = 2 or x = 3"
      ],
      answer: "2,3",
      explanation: "The solutions are x = 2 and x = 3. Both satisfy the original equation."
    },
    {
      id: 4,
      type: 'system',
      difficulty: 'intermediate',
      problem: "Solve the system: 2x + y = 10 and x - y = 2",
      hint: "Try adding the two equations together to eliminate y.",
      stepByStep: [
        "Step 1: Add the equations\n(2x + y) + (x - y) = 10 + 2\n3x = 12",
        "Step 2: Solve for x\n3x = 12\nx = 4",
        "Step 3: Substitute x = 4 into second equation\n4 - y = 2\n-y = 2 - 4\n-y = -2\ny = 2"
      ],
      answer: "4,2",
      explanation: "The solution is x = 4, y = 2. Check: 2(4) + 2 = 10 and 4 - 2 = 2 ✓"
    },
    {
      id: 5,
      type: 'rational',
      difficulty: 'advanced',
      problem: "Solve: (x + 3)/(x - 1) = 2",
      hint: "Start by cross-multiplying, then solve the resulting linear equation.",
      stepByStep: [
        "Step 1: Cross multiply\nx + 3 = 2(x - 1)",
        "Step 2: Distribute the 2\nx + 3 = 2x - 2",
        "Step 3: Move variables to one side\nx - 2x = -2 - 3\n-x = -5",
        "Step 4: Solve for x\nx = 5"
      ],
      answer: "5",
      explanation: "The solution is x = 5. Check: (5 + 3)/(5 - 1) = 8/4 = 2 ✓"
    },
    {
      id: 6,
      type: 'quadratic',
      difficulty: 'advanced',
      problem: "Solve using quadratic formula: 2x² - 4x - 6 = 0",
      hint: "Use the quadratic formula: x = [-b ± √(b² - 4ac)] / 2a",
      stepByStep: [
        "Step 1: Identify coefficients\na = 2, b = -4, c = -6",
        "Step 2: Calculate discriminant\nD = b² - 4ac = (-4)² - 4(2)(-6) = 16 + 48 = 64",
        "Step 3: Apply quadratic formula\nx = [4 ± √64] / 4\nx = [4 ± 8] / 4",
        "Step 4: Calculate both solutions\nx = (4 + 8)/4 = 12/4 = 3\nx = (4 - 8)/4 = -4/4 = -1"
      ],
      answer: "3,-1",
      explanation: "The solutions are x = 3 and x = -1. Both satisfy the original equation."
    },
    {
      id: 7,
      type: 'word',
      difficulty: 'intermediate',
      problem: "The sum of two numbers is 25, and their difference is 7. Find the numbers.",
      hint: "Let the numbers be x and y. Set up two equations: x + y = 25 and x - y = 7.",
      stepByStep: [
        "Step 1: Set up equations\nLet the numbers be x and y\nx + y = 25\nx - y = 7",
        "Step 2: Add the equations\n(x + y) + (x - y) = 25 + 7\n2x = 32",
        "Step 3: Solve for x\n2x = 32\nx = 16",
        "Step 4: Find y\n16 + y = 25\ny = 25 - 16\ny = 9"
      ],
      answer: "16,9",
      explanation: "The numbers are 16 and 9. Check: 16 + 9 = 25 and 16 - 9 = 7 ✓"
    },
    {
      id: 8,
      type: 'inequality',
      difficulty: 'intermediate',
      problem: "Solve the inequality: 3x - 8 < 7",
      hint: "Solve it like a regular equation, but remember the inequality direction.",
      stepByStep: [
        "Step 1: Add 8 to both sides\n3x - 8 + 8 < 7 + 8\n3x < 15",
        "Step 2: Divide both sides by 3\n3x ÷ 3 < 15 ÷ 3\nx < 5"
      ],
      answer: "x<5",
      explanation: "The solution is x < 5. This means x can be any number less than 5."
    }
  ]

  useEffect(() => {
    // Load practice history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('algebraPracticeHistory')) || []
    setPracticeHistory(savedHistory)
  }, [])

  const saveToHistory = (problem, userAnswer, correct) => {
    const historyItem = {
      id: Date.now(),
      problem: problem.problem,
      userAnswer,
      correctAnswer: problem.answer,
      correct,
      timestamp: new Date().toLocaleString(),
      difficulty: problem.difficulty,
      type: problem.type
    }
    
    const updatedHistory = [historyItem, ...practiceHistory.slice(0, 9)] // Keep last 10
    setPracticeHistory(updatedHistory)
    localStorage.setItem('algebraPracticeHistory', JSON.stringify(updatedHistory))
  }

  const checkAnswer = () => {
    const current = practiceProblems[currentProblem]
    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = current.answer.toLowerCase()
    
    const correct = normalizedUserAnswer === normalizedCorrectAnswer
    
    setIsCorrect(correct)
    
    if (correct) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
    
    saveToHistory(current, userAnswer, correct)
  }

  const handleNextProblem = () => {
    setCurrentProblem(prev => (prev + 1) % practiceProblems.length)
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)
    setIsCorrect(null)
  }

  const handleShowHint = () => {
    setShowHint(true)
  }

  const handleShowSolution = () => {
    setShowSolution(true)
  }

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
      case 'linear': return '📈'
      case 'quadratic': return '🔄'
      case 'system': return '⚖️'
      case 'rational': return '➗'
      case 'word': return '📝'
      case 'inequality': return '⚡'
      default: return '❓'
    }
  }

  const currentProblemData = practiceProblems[currentProblem]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="animate-bounce text-6xl">🎉</div>
            <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sm"></div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <Link 
            to="/topics/algebra" 
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-4 text-sm"
          >
            ← Back to Algebra Topics
          </Link>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-3">
            🎯 Interactive Practice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hands-on practice problems with hints and step-by-step solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Main Practice Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              
              {/* Problem Header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Practice Problem</h2>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(currentProblemData.difficulty)}`}>
                      {currentProblemData.difficulty}
                    </span>
                    <span className="flex items-center space-x-1 text-sm text-gray-600">
                      <span>{getTypeIcon(currentProblemData.type)}</span>
                      <span>{currentProblemData.type}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      Problem {currentProblem + 1} of {practiceProblems.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem Display */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-6 border-2 border-blue-200 shadow-inner">
                <div className="text-xl font-mono text-gray-800 text-center mb-6 font-bold">
                  {currentProblemData.problem}
                </div>
                
                {/* Answer Input */}
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Enter your answer below:
                  </label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-6 py-4 border-2 border-indigo-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 text-center font-mono text-lg shadow-lg transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                  <div className="text-xs text-gray-500 mt-3 text-center">
                    💡 For multiple answers, use commas (e.g., 2,3)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  🎯 Check Answer
                </button>
                
                <button
                  onClick={handleShowHint}
                  disabled={showHint}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-4 rounded-2xl hover:from-orange-600 hover:to-amber-700 transition-all font-semibold shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {showHint ? '💡 Hint Shown' : '💡 Get Hint'}
                </button>
                
                <button
                  onClick={handleShowSolution}
                  disabled={showSolution}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition-all font-semibold shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {showSolution ? '📖 Solution Shown' : '📖 Show Solution'}
                </button>
              </div>

              {/* Immediate Answer Feedback */}
              {isCorrect !== null && (
                <div className={`rounded-2xl p-6 mb-6 border-2 shadow-lg transform transition-all duration-500 ${
                  isCorrect 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 animate-pulse' 
                    : 'bg-gradient-to-br from-red-50 to-pink-100 border-red-300'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`text-4xl ${isCorrect ? 'text-green-500 animate-bounce' : 'text-red-500 animate-shake'}`}>
                      {isCorrect ? '🎉' : '💡'}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Excellent! You got it right! 🏆' : 'Almost there! Keep trying! 💪'}
                      </h3>
                      
                      {isCorrect ? (
                        <div className="space-y-3">
                          <p className="text-green-700 text-lg font-medium">
                            {currentProblemData.explanation}
                          </p>
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={handleNextProblem}
                              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors font-semibold"
                            >
                              Next Challenge →
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-red-700">
                            Don't worry! Every great mathematician started somewhere. 
                            {!showHint && " Try using the hint button for guidance!"}
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setUserAnswer('')}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              Try Again
                            </button>
                            {!showHint && (
                              <button
                                onClick={handleShowHint}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                              >
                                Get Hint
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Hint Section */}
              {showHint && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 mb-6 border-2 border-yellow-300 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl text-yellow-600">💡</div>
                    <h3 className="font-bold text-yellow-800 text-lg">Helpful Hint</h3>
                  </div>
                  <p className="text-yellow-800 leading-relaxed text-lg">{currentProblemData.hint}</p>
                  <div className="mt-4 text-yellow-600 text-sm">
                    💪 Try applying this hint to solve the problem!
                  </div>
                </div>
              )}

              {/* Solution Section */}
              {showSolution && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="text-3xl text-blue-600">📖</div>
                    <h3 className="font-bold text-blue-800 text-lg">Step-by-Step Solution</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {currentProblemData.stepByStep.map((step, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 shadow-md">
                            {index + 1}
                          </div>
                          <pre className="text-blue-800 whitespace-pre-wrap font-sans text-base leading-relaxed flex-1">
                            {step}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 bg-white rounded-xl p-4 border border-blue-200">
                    <p className="text-blue-700 font-semibold text-lg">{currentProblemData.explanation}</p>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleNextProblem}
                      className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors font-semibold shadow-lg"
                    >
                      Practice Next Problem →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Problem Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Practice Problems</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {practiceProblems.map((problem, index) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      setCurrentProblem(index)
                      setUserAnswer('')
                      setShowHint(false)
                      setShowSolution(false)
                      setIsCorrect(null)
                    }}
                    className={`p-4 rounded-2xl border-2 text-center transition-all transform hover:scale-105 ${
                      currentProblem === index
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                    }`}
                  >
                    <div className="text-lg mb-2">{getTypeIcon(problem.type)}</div>
                    <div className="text-sm font-bold">Problem {index + 1}</div>
                    <div className={`text-xs px-2 py-1 rounded-full mt-2 font-medium ${
                      problem.difficulty === 'beginner' ? 'bg-green-100 text-green-700 border border-green-200' :
                      problem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {problem.difficulty}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Recent Practice</h3>
                {practiceHistory.length > 0 && (
                  <button 
                    onClick={() => {
                      setPracticeHistory([])
                      localStorage.removeItem('algebraPracticeHistory')
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {practiceHistory.length > 0 ? (
                  practiceHistory.map((item, index) => (
                    <div key={item.id} className={`p-3 rounded-xl border-2 ${
                      item.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          item.correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {item.correct ? '✓' : '✗'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 font-medium truncate">{item.problem}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Your answer: <span className={item.correct ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {item.userAnswer}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="text-gray-400 text-4xl mb-3">📝</div>
                    <p className="text-sm text-gray-500 font-medium">No practice history yet</p>
                    <p className="text-xs text-gray-400 mt-1">Start solving problems to see your progress!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-semibold mb-4 text-lg">🚀 Pro Tips</h3>
              <ul className="text-sm space-y-3 opacity-95">
                <li className="flex items-start space-x-2">
                  <span className="text-lg">🎯</span>
                  <span>Try solving without hints first to build confidence</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-lg">📚</span>
                  <span>Review the step-by-step solutions to learn methods</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-lg">💪</span>
                  <span>Practice regularly - consistency is key to mastery</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-lg">🌟</span>
                  <span>Celebrate every correct answer - you're learning!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}