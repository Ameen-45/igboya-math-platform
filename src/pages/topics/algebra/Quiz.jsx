import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AlgebraQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(null)

  const algebraQuestions = [
    {
      id: 1,
      question: "Solve for x: 2x + 5 = 13",
      options: ["x = 4", "x = 3", "x = 5", "x = 6"],
      correctAnswer: 0,
      explanation: `Step 1: Subtract 5 from both sides
2x + 5 - 5 = 13 - 5
2x = 8

Step 2: Divide both sides by 2
2x/2 = 8/2
x = 4`
    },
    {
      id: 2,
      question: "What is the solution to x² - 5x + 6 = 0?",
      options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = -1, -6"],
      correctAnswer: 0,
      explanation: `Step 1: Factor the quadratic equation
We need two numbers that multiply to 6 and add to -5
Those numbers are -2 and -3

Step 2: Write the factored form
(x - 2)(x - 3) = 0

Step 3: Apply zero product property
x - 2 = 0 or x - 3 = 0
x = 2 or x = 3`
    },
    {
      id: 3,
      question: "Simplify: 3(x + 4) - 2(x - 1)",
      options: ["x + 14", "x + 10", "5x + 10", "5x + 14"],
      correctAnswer: 0,
      explanation: `Step 1: Distribute the coefficients
3(x + 4) = 3x + 12
-2(x - 1) = -2x + 2

Step 2: Combine like terms
3x + 12 - 2x + 2 = (3x - 2x) + (12 + 2) = x + 14`
    },
    {
      id: 4,
      question: "If y = 2x + 3 and y = 7, what is x?",
      options: ["x = 2", "x = 3", "x = 4", "x = 5"],
      correctAnswer: 0,
      explanation: `Step 1: Substitute y = 7 into the equation
7 = 2x + 3

Step 2: Subtract 3 from both sides
7 - 3 = 2x + 3 - 3
4 = 2x

Step 3: Divide both sides by 2
4/2 = 2x/2
x = 2`
    },
    {
      id: 5,
      question: "Solve: (x-3)/2 = 5",
      options: ["x = 13", "x = 10", "x = 8", "x = 7"],
      correctAnswer: 0,
      explanation: `Step 1: Multiply both sides by 2 to eliminate denominator
2 × (x-3)/2 = 2 × 5
x - 3 = 10

Step 2: Add 3 to both sides
x - 3 + 3 = 10 + 3
x = 13`
    },
    {
      id: 6,
      question: "What is the value of x in 4x - 7 = 3x + 5?",
      options: ["x = 12", "x = 2", "x = -12", "x = -2"],
      correctAnswer: 0,
      explanation: `Step 1: Subtract 3x from both sides
4x - 7 - 3x = 3x + 5 - 3x
x - 7 = 5

Step 2: Add 7 to both sides
x - 7 + 7 = 5 + 7
x = 12`
    },
    {
      id: 7,
      question: "Factor completely: x² + 7x + 12",
      options: ["(x+3)(x+4)", "(x+2)(x+6)", "(x+1)(x+12)", "(x+7)(x+1)"],
      correctAnswer: 0,
      explanation: `Step 1: Find two numbers that multiply to 12 and add to 7
Possible pairs: (1,12), (2,6), (3,4)
3 + 4 = 7 ✓
3 × 4 = 12 ✓

Step 2: Write the factored form
x² + 7x + 12 = (x + 3)(x + 4)`
    },
    {
      id: 8,
      question: "Solve the system: 2x + y = 7, x - y = 2",
      options: ["x=3, y=1", "x=2, y=3", "x=4, y=-1", "x=1, y=5"],
      correctAnswer: 0,
      explanation: `Step 1: Add the two equations to eliminate y
(2x + y) + (x - y) = 7 + 2
3x = 9

Step 2: Solve for x
3x = 9
x = 3

Step 3: Substitute x = 3 into second equation
3 - y = 2
-y = 2 - 3
-y = -1
y = 1`
    },
    {
      id: 9,
      question: "What is 3x² × 2x³?",
      options: ["6x⁵", "5x⁵", "6x⁶", "5x⁶"],
      correctAnswer: 0,
      explanation: `Step 1: Multiply the coefficients
3 × 2 = 6

Step 2: Add the exponents (same base)
x² × x³ = x²⁺³ = x⁵

Step 3: Combine results
3x² × 2x³ = 6x⁵`
    },
    {
      id: 10,
      question: "Solve for x: √(x + 5) = 3",
      options: ["x = 4", "x = 9", "x = 14", "x = 2"],
      correctAnswer: 0,
      explanation: `Step 1: Square both sides to eliminate square root
[√(x + 5)]² = 3²
x + 5 = 9

Step 2: Subtract 5 from both sides
x + 5 - 5 = 9 - 5
x = 4`
    },
    {
      id: 11,
      question: "Simplify: (2x² - 3x + 1) + (x² + 4x - 2)",
      options: ["3x² + x - 1", "3x² + 7x - 1", "x² + x - 1", "2x² + x - 1"],
      correctAnswer: 0,
      explanation: `Step 1: Group like terms
x² terms: 2x² + x² = 3x²
x terms: -3x + 4x = x
Constants: 1 + (-2) = -1

Step 2: Combine results
3x² + x - 1`
    },
    {
      id: 12,
      question: "If 3x - 2y = 8 and x + y = 4, what is y?",
      options: ["y = 0.8", "y = 1", "y = 2", "y = 3"],
      correctAnswer: 0,
      explanation: `Step 1: Solve second equation for x
x + y = 4
x = 4 - y

Step 2: Substitute into first equation
3(4 - y) - 2y = 8
12 - 3y - 2y = 8
12 - 5y = 8

Step 3: Solve for y
-5y = 8 - 12
-5y = -4
y = 4/5 = 0.8`
    },
    {
      id: 13,
      question: "What is the solution to |2x - 3| = 7?",
      options: ["x = 5 or x = -2", "x = 2 or x = -5", "x = 3 or x = -4", "x = 4 or x = -3"],
      correctAnswer: 0,
      explanation: `Step 1: Consider both cases for absolute value

Case 1: 2x - 3 = 7
2x = 7 + 3
2x = 10
x = 5

Case 2: 2x - 3 = -7
2x = -7 + 3
2x = -4
x = -2

Step 2: Both solutions are valid
x = 5 or x = -2`
    },
    {
      id: 14,
      question: "Expand: (x + 4)²",
      options: ["x² + 8x + 16", "x² + 4x + 16", "x² + 8x + 8", "x² + 16"],
      correctAnswer: 0,
      explanation: `Step 1: Use the formula (a + b)² = a² + 2ab + b²
Where a = x, b = 4

Step 2: Apply the formula
(x)² + 2(x)(4) + (4)² = x² + 8x + 16`
    },
    {
      id: 15,
      question: "Solve: 5(x - 2) = 3(x + 4)",
      options: ["x = 11", "x = 7", "x = 5", "x = 2"],
      correctAnswer: 0,
      explanation: `Step 1: Distribute both sides
5x - 10 = 3x + 12

Step 2: Subtract 3x from both sides
5x - 10 - 3x = 3x + 12 - 3x
2x - 10 = 12

Step 3: Add 10 to both sides
2x - 10 + 10 = 12 + 10
2x = 22

Step 4: Divide by 2
x = 11`
    },
    {
      id: 16,
      question: "What is the slope of the line 2x + 3y = 6?",
      options: ["-2/3", "2/3", "-3/2", "3/2"],
      correctAnswer: 0,
      explanation: `Step 1: Convert to slope-intercept form (y = mx + b)
2x + 3y = 6

Step 2: Isolate y
3y = -2x + 6
y = (-2/3)x + 2

Step 3: Identify slope (coefficient of x)
Slope m = -2/3`
    },
    {
      id: 17,
      question: "Simplify: (4x³y²)/(2xy)",
      options: ["2x²y", "2x³y", "4x²y", "4x³y"],
      correctAnswer: 0,
      explanation: `Step 1: Divide coefficients
4 ÷ 2 = 2

Step 2: Divide x terms (subtract exponents)
x³ ÷ x¹ = x³⁻¹ = x²

Step 3: Divide y terms (subtract exponents)
y² ÷ y¹ = y²⁻¹ = y¹ = y

Step 4: Combine results
2x²y`
    },
    {
      id: 18,
      question: "Solve: x² + 4x = 0",
      options: ["x = 0 or x = -4", "x = 0 or x = 4", "x = 2 or x = -2", "x = 1 or x = -4"],
      correctAnswer: 0,
      explanation: `Step 1: Factor out common factor x
x(x + 4) = 0

Step 2: Apply zero product property
x = 0 or x + 4 = 0
x = 0 or x = -4`
    },
    {
      id: 19,
      question: "What is the y-intercept of y = 3x - 5?",
      options: ["-5", "5", "3", "-3"],
      correctAnswer: 0,
      explanation: `Step 1: Identify slope-intercept form: y = mx + b
Where m = slope, b = y-intercept

Step 2: Compare with given equation y = 3x - 5
b = -5

Step 3: y-intercept is the point where x = 0
When x = 0, y = 3(0) - 5 = -5`
    },
    {
      id: 20,
      question: "Solve: 2/x = 3/6",
      options: ["x = 4", "x = 3", "x = 2", "x = 1"],
      correctAnswer: 0,
      explanation: `Step 1: Simplify right side
3/6 = 1/2
So 2/x = 1/2

Step 2: Cross multiply
2 × 2 = 1 × x
4 = x

Step 3: Solution
x = 4`
    },
    {
      id: 21,
      question: "Factor: 4x² - 9",
      options: ["(2x-3)(2x+3)", "(4x-3)(x+3)", "(2x-9)(2x+1)", "(4x-1)(x+9)"],
      correctAnswer: 0,
      explanation: `Step 1: Recognize difference of squares pattern
a² - b² = (a - b)(a + b)

Step 2: Identify a and b
4x² = (2x)², 9 = 3²
So a = 2x, b = 3

Step 3: Apply formula
4x² - 9 = (2x)² - 3² = (2x - 3)(2x + 3)`
    },
    {
      id: 22,
      question: "Solve: 3(x + 2) - 2(2x - 1) = 4",
      options: ["x = 4", "x = 2", "x = 0", "x = -2"],
      correctAnswer: 0,
      explanation: `Step 1: Distribute
3(x + 2) = 3x + 6
-2(2x - 1) = -4x + 2

Step 2: Combine
3x + 6 - 4x + 2 = 4
-x + 8 = 4

Step 3: Solve for x
-x = 4 - 8
-x = -4
x = 4`
    },
    {
      id: 23,
      question: "What is the solution to 2x - 1 > 5?",
      options: ["x > 3", "x < 3", "x > 2", "x < 2"],
      correctAnswer: 0,
      explanation: `Step 1: Add 1 to both sides
2x - 1 + 1 > 5 + 1
2x > 6

Step 2: Divide both sides by 2
2x/2 > 6/2
x > 3`
    },
    {
      id: 24,
      question: "Simplify: √(16x⁴)",
      options: ["4x²", "8x²", "4x", "8x"],
      correctAnswer: 0,
      explanation: `Step 1: Separate square root
√(16x⁴) = √16 × √x⁴

Step 2: Simplify each part
√16 = 4
√x⁴ = x²  (since (x²)² = x⁴)

Step 3: Combine results
4 × x² = 4x²`
    },
    {
      id: 25,
      question: "Solve: (x+1)/3 = (x-2)/2",
      options: ["x = 8", "x = 4", "x = -4", "x = -8"],
      correctAnswer: 0,
      explanation: `Step 1: Cross multiply
2(x + 1) = 3(x - 2)

Step 2: Distribute
2x + 2 = 3x - 6

Step 3: Solve for x
2x - 3x = -6 - 2
-x = -8
x = 8`
    },
    {
      id: 26,
      question: "What is the vertex of y = x² - 4x + 3?",
      options: ["(2, -1)", "(1, 0)", "(4, 3)", "(-2, 15)"],
      correctAnswer: 0,
      explanation: `Step 1: Use vertex formula for y = ax² + bx + c
x-coordinate = -b/(2a)
a = 1, b = -4
x = -(-4)/(2×1) = 4/2 = 2

Step 2: Find y-coordinate by substituting x = 2
y = (2)² - 4(2) + 3 = 4 - 8 + 3 = -1

Step 3: Vertex is (2, -1)`
    },
    {
      id: 27,
      question: "Solve: 2ˣ = 8",
      options: ["x = 3", "x = 4", "x = 2", "x = 1"],
      correctAnswer: 0,
      explanation: `Step 1: Express both sides with same base
8 = 2³
So 2ˣ = 2³

Step 2: Since bases are equal, exponents must be equal
x = 3`
    },
    {
      id: 28,
      question: "What is the solution to x² + 6x + 9 = 0?",
      options: ["x = -3", "x = 3", "x = -6", "x = 0"],
      correctAnswer: 0,
      explanation: `Step 1: Recognize perfect square trinomial
x² + 6x + 9 = (x + 3)²

Step 2: Set equal to zero
(x + 3)² = 0

Step 3: Solve
x + 3 = 0
x = -3`
    },
    {
      id: 29,
      question: "Simplify: (x² + 3x - 10)/(x - 2)",
      options: ["x + 5", "x - 5", "x + 2", "x - 2"],
      correctAnswer: 0,
      explanation: `Step 1: Factor numerator
x² + 3x - 10 = (x + 5)(x - 2)

Step 2: Simplify fraction
(x + 5)(x - 2)/(x - 2) = x + 5

Step 3: Result after cancellation
x + 5`
    },
    {
      id: 30,
      question: "Solve: log₂(x) = 3",
      options: ["x = 8", "x = 6", "x = 9", "x = 4"],
      correctAnswer: 0,
      explanation: `Step 1: Convert from logarithmic to exponential form
log₂(x) = 3 means 2³ = x

Step 2: Calculate
2³ = 2 × 2 × 2 = 8

Step 3: Solution
x = 8`
    }
  ]

  // Shuffle questions for random order
  const [shuffledQuestions, setShuffledQuestions] = useState([])

  useEffect(() => {
    // Shuffle questions when component mounts
    const shuffled = [...algebraQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  useEffect(() => {
    if (!quizStarted || timeLeft <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, timeLeft, showResults])

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const handleRetry = () => {
    // Reshuffle questions and reset state
    const reshuffled = [...algebraQuestions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(reshuffled)
    setUserAnswers({})
    setShowResults(false)
    setCurrentQuestion(0)
    setTimeLeft(1800)
    setQuizStarted(false)
    setShowExplanation(null)
  }

  const calculateScore = () => {
    let correct = 0
    shuffledQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const score = calculateScore()
  const percentage = Math.round((score / shuffledQuestions.length) * 100)

  const getResultMessage = () => {
    if (percentage >= 90) return "Outstanding! 🎉 You're an algebra genius!"
    if (percentage >= 80) return "Excellent work! 🌟 You've mastered algebra!"
    if (percentage >= 70) return "Great job! 💪 You understand algebra well!"
    if (percentage >= 60) return "Good effort! 👍 Keep practicing!"
    if (percentage >= 50) return "Not bad! 📚 Review the explanations and try again!"
    return "Keep practicing! 🔥 Every mistake is a learning opportunity. Try again!"
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">📝</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Algebra Quiz Challenge
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Test your algebra knowledge with 30 challenging questions. You have 30 minutes to complete the quiz!
          </p>
          
          <div className="bg-yellow-50 rounded-2xl p-6 mb-6 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-3">Quiz Details:</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                <span>30 Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                <span>30 Minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                <span>Multiple Choice</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs">4</div>
                <span>Step-by-step Solutions</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setQuizStarted(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-12 py-4 rounded-2xl hover:from-purple-600 hover:to-blue-700 transition-all font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            Start Quiz Now 🚀
          </button>

          <Link
            to="/topics/algebra"
            className="block mt-4 text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Algebra Topics
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Results Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 text-center">
            <div className={`text-6xl mb-4 ${
              percentage >= 70 ? 'text-green-500' : 
              percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Completed!
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              {getResultMessage()}
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {score}/{shuffledQuestions.length}
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-4">
                  {percentage}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      percentage >= 70 ? 'bg-green-500' : 
                      percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
              <button
                onClick={handleRetry}
                className="bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition-colors font-semibold"
              >
                Try Again 🔄
              </button>
              <Link
                to="/topics/algebra"
                className="bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold text-center"
              >
                Back to Topics
              </Link>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Review Your Answers
            </h3>
            <div className="space-y-6">
              {shuffledQuestions.map((question, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-2 ${
                    userAnswers[index] === question.correctAnswer
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg">Question {index + 1}</span>
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      userAnswers[index] === question.correctAnswer
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {userAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <p className="text-lg font-medium text-gray-800 mb-4">
                    {question.question}
                  </p>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Your answer:</p>
                    <div className={`p-3 rounded-lg ${
                      userAnswers[index] === question.correctAnswer
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-red-100 border border-red-300'
                    }`}>
                      {userAnswers[index] !== undefined ? (
                        <span className="font-medium">
                          {question.options[userAnswers[index]]}
                        </span>
                      ) : (
                        <span className="text-gray-500">Not answered</span>
                      )}
                    </div>
                  </div>

                  {userAnswers[index] !== question.correctAnswer && (
                    <div className="mb-4">
                      <p className="font-semibold text-green-700 mb-2">Correct answer:</p>
                      <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                        <span className="font-medium">
                          {question.options[question.correctAnswer]}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setShowExplanation(showExplanation === index ? null : index)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold mb-3"
                    >
                      {showExplanation === index ? 'Hide Solution' : 'Show Step-by-Step Solution'}
                    </button>
                    
                    {showExplanation === index && (
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <h4 className="font-bold text-yellow-800 mb-3 text-lg">Step-by-Step Solution:</h4>
                        <pre className="text-yellow-800 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {question.explanation}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Algebra Quiz</h1>
              <p className="text-gray-600 text-sm">
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                ⏱️ {formatTime(timeLeft)}
              </div>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Submit Quiz
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Question Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {shuffledQuestions.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {shuffledQuestions[currentQuestion].question}
                  </h2>

                  <div className="space-y-3">
                    {shuffledQuestions[currentQuestion].options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          userAnswers[currentQuestion] === optionIndex
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            userAnswers[currentQuestion] === optionIndex
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentQuestion(prev => Math.min(shuffledQuestions.length - 1, prev + 1))}
                disabled={currentQuestion === shuffledQuestions.length - 1}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                  currentQuestion === shuffledQuestions.length - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                <span>Next</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-3">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {shuffledQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      currentQuestion === index
                        ? 'bg-purple-500 text-white shadow-md'
                        : userAnswers[index] !== undefined
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}