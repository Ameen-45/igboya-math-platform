import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function InteractivePractice() {
  const [currentDataset, setCurrentDataset] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState('dataset')
  const [practiceMode, setPracticeMode] = useState('guided')

  const datasets = [
    {
      id: 1,
      name: "Student Test Scores",
      description: "Mathematics exam scores from a class of 30 students",
      data: [85, 92, 78, 96, 88, 76, 95, 89, 91, 84, 72, 98, 87, 83, 79, 94, 86, 90, 77, 93, 82, 75, 97, 81, 74, 99, 80, 73, 100, 71],
      type: "numerical",
      questions: [
        {
          id: 1,
          question: "What is the mean test score?",
          type: "calculation",
          answer: 85.1,
          tolerance: 0.1,
          explanation: "Sum all scores: 85+92+78+96+88+76+95+89+91+84+72+98+87+83+79+94+86+90+77+93+82+75+97+81+74+99+80+73+100+71 = 2553\nDivide by 30 students: 2553 ÷ 30 = 85.1"
        },
        {
          id: 2,
          question: "What is the median test score?",
          type: "calculation",
          answer: 85.5,
          tolerance: 0.1,
          explanation: "Sorted scores: 71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100\nMiddle values: 85 and 86\nMedian = (85 + 86) ÷ 2 = 85.5"
        },
        {
          id: 3,
          question: "What is the range of the test scores?",
          type: "calculation",
          answer: 29,
          tolerance: 0,
          explanation: "Maximum score: 100\nMinimum score: 71\nRange = 100 - 71 = 29"
        }
      ]
    },
    {
      id: 2,
      name: "Weather Temperature Data",
      description: "Daily maximum temperatures for 20 days in Celsius",
      data: [22, 24, 19, 26, 23, 25, 21, 27, 20, 28, 18, 29, 17, 30, 16, 31, 15, 32, 14, 33],
      type: "numerical",
      questions: [
        {
          id: 1,
          question: "What is the mean temperature?",
          type: "calculation",
          answer: 23.5,
          tolerance: 0.1,
          explanation: "Sum all temperatures: 22+24+19+26+23+25+21+27+20+28+18+29+17+30+16+31+15+32+14+33 = 470\nDivide by 20 days: 470 ÷ 20 = 23.5°C"
        },
        {
          id: 2,
          question: "How many days had temperatures above 25°C?",
          type: "count",
          answer: 8,
          tolerance: 0,
          explanation: "Temperatures above 25: 26, 27, 28, 29, 30, 31, 32, 33\nTotal = 8 days"
        },
        {
          id: 3,
          question: "What is the mode temperature?",
          type: "text",
          answer: "No mode",
          tolerance: 0,
          explanation: "All temperatures appear only once. There is no mode in this dataset."
        }
      ]
    },
    {
      id: 3,
      name: "Sales Revenue",
      description: "Monthly sales revenue (in $1000) for a small business",
      data: [12.5, 15.3, 18.7, 14.2, 16.8, 20.1, 22.4, 19.6, 17.3, 21.5, 23.8, 25.2],
      type: "numerical",
      questions: [
        {
          id: 1,
          question: "What is the total annual revenue?",
          type: "calculation",
          answer: 227.4,
          tolerance: 0.1,
          explanation: "Sum all monthly revenues: 12.5+15.3+18.7+14.2+16.8+20.1+22.4+19.6+17.3+21.5+23.8+25.2 = 227.4\nTotal = $227,400"
        },
        {
          id: 2,
          question: "What is the average monthly revenue?",
          type: "calculation",
          answer: 18.95,
          tolerance: 0.1,
          explanation: "Total revenue ÷ 12 months = 227.4 ÷ 12 = 18.95\nAverage = $18,950 per month"
        },
        {
          id: 3,
          question: "What is the revenue growth from first to last month?",
          type: "calculation",
          answer: 12.7,
          tolerance: 0.1,
          explanation: "Last month - First month = 25.2 - 12.5 = 12.7\nGrowth = $12,700"
        }
      ]
    }
  ]

  const challengeProblems = [
    {
      id: 1,
      scenario: "A factory produces light bulbs with a mean lifespan of 800 hours and standard deviation of 50 hours. What percentage of bulbs last between 750 and 850 hours?",
      type: "normal-distribution",
      answer: 68.27,
      tolerance: 0.5,
      explanation: "Step 1: Calculate z-scores\nz1 = (750 - 800) ÷ 50 = -1\nz2 = (850 - 800) ÷ 50 = +1\n\nStep 2: Use empirical rule\nIn normal distribution, 68.27% of data falls within ±1 standard deviation\n\nStep 3: Answer\n68.27% of bulbs last between 750 and 850 hours",
      hint: "Use the empirical rule for normal distributions"
    },
    {
      id: 2,
      scenario: "In a survey, 60% of people prefer coffee over tea. If you randomly select 10 people, what's the probability exactly 7 prefer coffee?",
      type: "binomial",
      answer: 21.5,
      tolerance: 0.5,
      explanation: "Step 1: Use binomial probability formula\nP(X=7) = C(10,7) × (0.6)⁷ × (0.4)³\n\nStep 2: Calculate combinations\nC(10,7) = 120\n\nStep 3: Calculate probabilities\n(0.6)⁷ = 0.0279936\n(0.4)³ = 0.064\n\nStep 4: Multiply\n120 × 0.0279936 × 0.064 = 0.215 = 21.5%",
      hint: "This is a binomial probability problem with n=10, p=0.6, k=7"
    }
  ]

  const currentData = practiceMode === 'guided' ? datasets[currentDataset] : challengeProblems[currentDataset]

  const handleAnswerSubmit = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateResults = () => {
    const results = {}
    if (practiceMode === 'guided') {
      currentData.questions.forEach(question => {
        const userAnswer = userAnswers[question.id]
        if (userAnswer !== undefined && userAnswer !== '') {
          if (question.type === 'calculation') {
            const userNum = parseFloat(userAnswer)
            const isCorrect = Math.abs(userNum - question.answer) <= question.tolerance
            results[question.id] = {
              correct: isCorrect,
              userAnswer: userAnswer,
              correctAnswer: question.answer,
              explanation: question.explanation
            }
          } else {
            const isCorrect = userAnswer.toString().toLowerCase() === question.answer.toString().toLowerCase()
            results[question.id] = {
              correct: isCorrect,
              userAnswer: userAnswer,
              correctAnswer: question.answer,
              explanation: question.explanation
            }
          }
        }
      })
    } else {
      const problem = challengeProblems[currentDataset]
      const userAnswer = userAnswers[problem.id]
      if (userAnswer !== undefined && userAnswer !== '') {
        const userNum = parseFloat(userAnswer)
        const isCorrect = Math.abs(userNum - problem.answer) <= problem.tolerance
        results[problem.id] = {
          correct: isCorrect,
          userAnswer: userAnswer,
          correctAnswer: problem.answer,
          explanation: problem.explanation
        }
      }
    }
    return results
  }

  const results = calculateResults()
  const totalQuestions = practiceMode === 'guided' ? currentData.questions.length : 1
  const correctAnswers = Object.values(results).filter(r => r.correct).length
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const handleNextDataset = () => {
    const maxIndex = practiceMode === 'guided' ? datasets.length - 1 : challengeProblems.length - 1
    setCurrentDataset(prev => prev >= maxIndex ? 0 : prev + 1)
    setUserAnswers({})
    setShowResults(false)
    setActiveTab('dataset')
  }

  const handlePreviousDataset = () => {
    const maxIndex = practiceMode === 'guided' ? datasets.length - 1 : challengeProblems.length - 1
    setCurrentDataset(prev => prev === 0 ? maxIndex : prev - 1)
    setUserAnswers({})
    setShowResults(false)
    setActiveTab('dataset')
  }

  const resetPractice = () => {
    setUserAnswers({})
    setShowResults(false)
    setActiveTab('dataset')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/topics/statistics" 
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-4 text-sm font-medium"
          >
            ← Back to Statistics
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Interactive Practice
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Practice statistical analysis with real datasets and challenging problems
          </p>
        </div>

        {/* Practice Mode Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl shadow-lg p-1 inline-flex">
            <button
              onClick={() => {
                setPracticeMode('guided')
                setCurrentDataset(0)
                resetPractice()
              }}
              className={`px-6 py-3 rounded-lg transition-all font-medium ${
                practiceMode === 'guided'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              🎯 Guided Practice
            </button>
            <button
              onClick={() => {
                setPracticeMode('challenge')
                setCurrentDataset(0)
                resetPractice()
              }}
              className={`px-6 py-3 rounded-lg transition-all font-medium ${
                practiceMode === 'challenge'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              🚀 Challenge Problems
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-4 text-center font-medium ${
                    activeTab === 'dataset' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('dataset')}
                >
                  {practiceMode === 'guided' ? '📈 Dataset' : '💡 Problem'}
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium ${
                    activeTab === 'questions' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('questions')}
                >
                  ❓ Questions
                </button>
                <button
                  className={`flex-1 py-4 text-center font-medium ${
                    activeTab === 'results' 
                      ? 'text-orange-600 border-b-2 border-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('results')}
                >
                  📊 Results
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'dataset' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        {practiceMode === 'guided' ? currentData.name : 'Challenge Problem'}
                      </h2>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                        {currentDataset + 1} of {practiceMode === 'guided' ? datasets.length : challengeProblems.length}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-6 text-lg">
                      {practiceMode === 'guided' ? currentData.description : currentData.scenario}
                    </p>

                    {practiceMode === 'guided' && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Dataset Values:</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2">
                          {currentData.data.map((value, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-2 text-center text-sm font-medium">
                              {value}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 text-sm text-gray-500 flex justify-between">
                          <span><strong>Count:</strong> {currentData.data.length} values</span>
                          <span><strong>Type:</strong> {currentData.type}</span>
                        </div>
                      </div>
                    )}

                    {practiceMode === 'challenge' && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2">💡 Hint:</h3>
                        <p className="text-blue-700">{currentData.hint}</p>
                      </div>
                    )}

                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                      <h3 className="font-semibold text-yellow-800 mb-2">📝 Instructions:</h3>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Switch to the Questions tab to solve problems</li>
                        <li>• Use the Results tab to check your answers</li>
                        <li>• Round answers to appropriate decimal places</li>
                        {practiceMode === 'challenge' && (
                          <li>• These are advanced problems requiring statistical reasoning</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'questions' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Practice Questions
                    </h2>

                    {practiceMode === 'guided' ? (
                      <div className="space-y-6">
                        {currentData.questions.map((question) => (
                          <div key={question.id} className="border border-gray-200 rounded-xl p-5">
                            <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                              {question.question}
                            </h3>
                            <div className="flex items-center space-x-4">
                              <input
                                type="text"
                                placeholder="Enter your answer..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                                value={userAnswers[question.id] || ''}
                              />
                              {showResults && results[question.id] && (
                                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                                  results[question.id].correct 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-red-100 text-red-600'
                                }`}>
                                  {results[question.id].correct ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                          {currentData.scenario}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            placeholder="Enter your answer..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                            onChange={(e) => handleAnswerSubmit(currentData.id, e.target.value)}
                            value={userAnswers[currentData.id] || ''}
                          />
                          {showResults && results[currentData.id] && (
                            <span className={`px-4 py-2 rounded-full font-semibold ${
                              results[currentData.id].correct 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {results[currentData.id].correct ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-8">
                      <button
                        onClick={handlePreviousDataset}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                      >
                        ← Previous
                      </button>
                      
                      <div className="space-x-3">
                        <button
                          onClick={() => setShowResults(true)}
                          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                        >
                          Check Answers
                        </button>
                        <button
                          onClick={handleNextDataset}
                          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'results' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6">
                      Results & Explanations
                    </h2>

                    {Object.keys(results).length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-600 mb-4 text-lg">Complete the questions to see results</p>
                        <button
                          onClick={() => setActiveTab('questions')}
                          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                        >
                          Go to Questions
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Score Summary */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-6 mb-6 text-center">
                          <div className="text-4xl font-bold mb-2">{score}%</div>
                          <div className="text-lg mb-4">
                            {correctAnswers} out of {totalQuestions} correct
                          </div>
                          <div className="w-full bg-orange-400 rounded-full h-3">
                            <div 
                              className="bg-white h-3 rounded-full transition-all duration-1000"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Detailed Results */}
                        <div className="space-y-4">
                          {practiceMode === 'guided' ? (
                            currentData.questions.map((question) => (
                              results[question.id] && (
                                <div key={question.id} className={`border-2 rounded-xl p-5 ${
                                  results[question.id].correct 
                                    ? 'border-green-200 bg-green-50' 
                                    : 'border-red-200 bg-red-50'
                                }`}>
                                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                                    {question.question}
                                  </h3>
                                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                                    <div className="text-lg">
                                      <strong>Your Answer:</strong> {results[question.id].userAnswer}
                                    </div>
                                    <div className="text-lg">
                                      <strong>Correct Answer:</strong> {results[question.id].correctAnswer}
                                    </div>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 border">
                                    <strong className="text-gray-800">Explanation:</strong>
                                    <p className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">
                                      {results[question.id].explanation}
                                    </p>
                                  </div>
                                </div>
                              )
                            ))
                          ) : (
                            results[currentData.id] && (
                              <div className={`border-2 rounded-xl p-6 ${
                                results[currentData.id].correct 
                                  ? 'border-green-200 bg-green-50' 
                                  : 'border-red-200 bg-red-50'
                              }`}>
                                <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                                  {currentData.scenario}
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                  <div className="text-lg">
                                    <strong>Your Answer:</strong> {results[currentData.id].userAnswer}
                                  </div>
                                  <div className="text-lg">
                                    <strong>Correct Answer:</strong> {results[currentData.id].correctAnswer}
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 border">
                                  <strong className="text-gray-800">Step-by-Step Solution:</strong>
                                  <p className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {results[currentData.id].explanation}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/topics/statistics/data-analyzer"
                  className="block w-full text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Open Data Analyzer
                </Link>
                <Link
                  to="/topics/statistics/examples"
                  className="block w-full text-center border border-orange-500 text-orange-600 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
                >
                  View Examples
                </Link>
              </div>
            </div>

            {/* Practice Tips */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Practice Tips</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Try solving without calculator first</li>
                <li>• Show your work step by step</li>
                <li>• Review explanations for mistakes</li>
                <li>• Practice regularly for best results</li>
                {practiceMode === 'guided' && (
                  <li>• Use the Data Analyzer for complex calculations</li>
                )}
              </ul>
            </div>

            {/* Dataset Navigator */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                {practiceMode === 'guided' ? 'Datasets' : 'Problems'}
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(practiceMode === 'guided' ? datasets : challengeProblems).map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentDataset(index)
                      resetPractice()
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                      currentDataset === index
                        ? 'bg-orange-50 border border-orange-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="font-medium text-gray-800">
                      {item.name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {practiceMode === 'guided' ? item.description : item.scenario.substring(0, 40)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}