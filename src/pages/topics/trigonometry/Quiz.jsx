import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function TrigonometryQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(null)

  const trigonometryQuestions = [
    {
      id: 1,
      question: "In a right triangle, if the opposite side is 3 and the hypotenuse is 5, what is sin(θ)?",
      options: ["3/5", "4/5", "5/3", "3/4"],
      correctAnswer: 0,
      explanation: `Step 1: Recall the definition of sine
sin(θ) = Opposite / Hypotenuse

Step 2: Substitute the given values
Opposite = 3, Hypotenuse = 5
sin(θ) = 3/5

Step 3: The sine ratio is 3/5`
    },
    {
      id: 2,
      question: "What is cos(60°)?",
      options: ["1/2", "√3/2", "√2/2", "1"],
      correctAnswer: 0,
      explanation: `Step 1: Recall the exact value for cos(60°)
From the unit circle or special triangles:
cos(60°) = 1/2

Step 2: This is a standard trigonometric value
In a 30-60-90 triangle, adjacent/hypotenuse = 1/2`
    },
    {
      id: 3,
      question: "If tan(θ) = 1, what is the value of θ in degrees?",
      options: ["45°", "30°", "60°", "90°"],
      correctAnswer: 0,
      explanation: `Step 1: Recall when tangent equals 1
tan(θ) = Opposite/Adjacent = 1
This happens when opposite = adjacent

Step 2: This occurs in an isosceles right triangle
In a 45-45-90 triangle, both acute angles are 45°
Therefore θ = 45°`
    },
    {
      id: 4,
      question: "What is the value of sin(90°)?",
      options: ["1", "0", "√3/2", "1/2"],
      correctAnswer: 0,
      explanation: `Step 1: Understand the unit circle definition
At 90°, the point on the unit circle is (0,1)

Step 2: Sine is the y-coordinate
sin(90°) = y-coordinate = 1

Step 3: This represents the maximum value of sine`
    },
    {
      id: 5,
      question: "In triangle ABC, angle A = 40°, angle B = 60°, side a = 8. Find side b using sine rule.",
      options: ["10.78", "9.45", "11.23", "12.15"],
      correctAnswer: 0,
      explanation: `Step 1: Apply sine rule formula
a/sinA = b/sinB

Step 2: Substitute known values
8/sin(40°) = b/sin(60°)

Step 3: Solve for b
b = (8 × sin(60°)) / sin(40°)
b = (8 × 0.8660) / 0.6428
b ≈ 6.928 / 0.6428 ≈ 10.78`
    },
    {
      id: 6,
      question: "What is the period of y = sin(2x)?",
      options: ["π", "2π", "π/2", "4π"],
      correctAnswer: 0,
      explanation: `Step 1: Recall period formula for sine
For y = sin(Bx), period = 2π/B

Step 2: Apply the formula
B = 2
Period = 2π/2 = π

Step 3: The function completes one full cycle every π radians`
    },
    {
      id: 7,
      question: "If cos(θ) = 0.6 and θ is acute, what is sin(θ)?",
      options: ["0.8", "0.4", "0.6", "1.0"],
      correctAnswer: 0,
      explanation: `Step 1: Use Pythagorean identity
sin²(θ) + cos²(θ) = 1

Step 2: Substitute cos(θ) = 0.6
sin²(θ) + (0.6)² = 1
sin²(θ) + 0.36 = 1

Step 3: Solve for sin(θ)
sin²(θ) = 1 - 0.36 = 0.64
sin(θ) = √0.64 = 0.8 (positive since θ is acute)`
    },
    {
      id: 8,
      question: "What is the amplitude of y = 3cos(x) + 2?",
      options: ["3", "2", "5", "1"],
      correctAnswer: 0,
      explanation: `Step 1: Understand amplitude definition
Amplitude is the coefficient of the trigonometric function
For y = A·cos(Bx) + C, amplitude = |A|

Step 2: Identify A from the equation
y = 3cos(x) + 2
A = 3

Step 3: Amplitude = |3| = 3
The +2 only affects vertical shift, not amplitude`
    },
    {
      id: 9,
      question: "Convert 150° to radians.",
      options: ["5π/6", "2π/3", "3π/4", "π/2"],
      correctAnswer: 0,
      explanation: `Step 1: Use conversion formula
Radians = Degrees × π/180

Step 2: Apply conversion
150° × π/180 = 150π/180

Step 3: Simplify the fraction
150π/180 = 15π/18 = 5π/6`
    },
    {
      id: 10,
      question: "What is sec(45°)?",
      options: ["√2", "2", "1", "√2/2"],
      correctAnswer: 0,
      explanation: `Step 1: Recall secant definition
sec(θ) = 1/cos(θ)

Step 2: Find cos(45°)
cos(45°) = √2/2

Step 3: Calculate sec(45°)
sec(45°) = 1/(√2/2) = 2/√2 = √2`
    },
    {
      id: 11,
      question: "In which quadrant is sin positive and cos negative?",
      options: ["Second", "First", "Third", "Fourth"],
      correctAnswer: 0,
      explanation: `Step 1: Recall the ASTC rule
A - All positive in first quadrant
S - Sine positive in second quadrant
T - Tangent positive in third quadrant
C - Cosine positive in fourth quadrant

Step 2: Identify the quadrant
sin positive and cos negative occurs in second quadrant`
    },
    {
      id: 12,
      question: "What is tan(π/4)?",
      options: ["1", "√3", "1/√3", "0"],
      correctAnswer: 0,
      explanation: `Step 1: Convert radians to degrees
π/4 = 45°

Step 2: Recall tan(45°)
tan(45°) = Opposite/Adjacent = 1

Step 3: In a 45-45-90 triangle, both legs are equal
Therefore tan(45°) = 1`
    },
    {
      id: 13,
      question: "Find the area of a triangle with sides 7, 8, and 9 using Heron's formula.",
      options: ["26.83", "24.00", "28.00", "30.00"],
      correctAnswer: 0,
      explanation: `Step 1: Calculate semi-perimeter
s = (7 + 8 + 9)/2 = 24/2 = 12

Step 2: Apply Heron's formula
Area = √[s(s-a)(s-b)(s-c)]
Area = √[12(12-7)(12-8)(12-9)]
Area = √[12×5×4×3]

Step 3: Calculate
Area = √[720] ≈ 26.83`
    },
    {
      id: 14,
      question: "What is sin(180° - θ) equal to?",
      options: ["sin(θ)", "-sin(θ)", "cos(θ)", "-cos(θ)"],
      correctAnswer: 0,
      explanation: `Step 1: Use trigonometric identity
sin(180° - θ) = sin(θ)

Step 2: Understand the reasoning
This is a supplementary angle identity
In the unit circle, sin(180° - θ) has the same y-coordinate as sin(θ)`
    },
    {
      id: 15,
      question: "If a ladder 10m long leans against a wall making 60° with ground, how high up the wall does it reach?",
      options: ["8.66m", "5m", "10m", "7.07m"],
      correctAnswer: 0,
      explanation: `Step 1: Set up the right triangle
Hypotenuse (ladder) = 10m
Angle with ground = 60°
Height = Opposite side

Step 2: Use sine ratio
sin(60°) = Opposite/Hypotenuse
√3/2 = Height/10

Step 3: Solve for height
Height = 10 × √3/2 = 5√3 ≈ 8.66m`
    },
    {
      id: 16,
      question: "What is the phase shift of y = sin(x - π/4)?",
      options: ["π/4 to the right", "π/4 to the left", "π/2 to the right", "No phase shift"],
      correctAnswer: 0,
      explanation: `Step 1: Understand phase shift formula
For y = sin(x - C), phase shift = C to the right

Step 2: Identify C from the equation
y = sin(x - π/4)
C = π/4

Step 3: Phase shift is π/4 to the right`
    },
    {
      id: 17,
      question: "Find cos(120°) using reference angles.",
      options: ["-1/2", "1/2", "-√3/2", "√3/2"],
      correctAnswer: 0,
      explanation: `Step 1: Identify quadrant and reference angle
120° is in second quadrant
Reference angle = 180° - 120° = 60°

Step 2: Determine sign in second quadrant
In second quadrant, cosine is negative

Step 3: Apply reference angle
cos(120°) = -cos(60°) = -1/2`
    },
    {
      id: 18,
      question: "What is the value of sin²(θ) + cos²(θ)?",
      options: ["1", "0", "2", "sin(2θ)"],
      correctAnswer: 0,
      explanation: `Step 1: Recall the fundamental Pythagorean identity
sin²(θ) + cos²(θ) = 1

Step 2: This identity is true for all values of θ
It comes from the unit circle definition
x² + y² = 1 where x = cos(θ), y = sin(θ)`
    },
    {
      id: 19,
      question: "In triangle ABC, sides b=5, c=7, angle A=40°. Find side a using cosine rule.",
      options: ["4.52", "5.23", "6.15", "3.89"],
      correctAnswer: 0,
      explanation: `Step 1: Apply cosine rule
a² = b² + c² - 2bc·cosA

Step 2: Substitute values
a² = 5² + 7² - 2×5×7×cos(40°)
a² = 25 + 49 - 70×0.7660

Step 3: Calculate
a² = 74 - 53.62 = 20.38
a = √20.38 ≈ 4.52`
    },
    {
      id: 20,
      question: "What is cot(45°)?",
      options: ["1", "√3", "1/√3", "0"],
      correctAnswer: 0,
      explanation: `Step 1: Recall cotangent definition
cot(θ) = 1/tan(θ) = cos(θ)/sin(θ)

Step 2: Find tan(45°)
tan(45°) = 1

Step 3: Calculate cot(45°)
cot(45°) = 1/tan(45°) = 1/1 = 1`
    },
    {
      id: 21,
      question: "If sin(θ) = 0.8 and θ is in first quadrant, what is cos(θ)?",
      options: ["0.6", "0.4", "0.8", "1.0"],
      correctAnswer: 0,
      explanation: `Step 1: Use Pythagorean identity
sin²(θ) + cos²(θ) = 1

Step 2: Substitute sin(θ) = 0.8
(0.8)² + cos²(θ) = 1
0.64 + cos²(θ) = 1

Step 3: Solve for cos(θ)
cos²(θ) = 1 - 0.64 = 0.36
cos(θ) = √0.36 = 0.6 (positive in first quadrant)`
    },
    {
      id: 22,
      question: "What is the range of y = 2sin(x) + 1?",
      options: ["[-1, 3]", "[0, 2]", "[-2, 2]", "[1, 3]"],
      correctAnswer: 0,
      explanation: `Step 1: Find range of basic sine function
sin(x) ranges from -1 to 1

Step 2: Apply transformations
2sin(x) ranges from -2 to 1
2sin(x) + 1 ranges from -2+1 to 2+1 = -1 to 3

Step 3: Range is [-1, 3]`
    },
    {
      id: 23,
      question: "Convert 3π/2 radians to degrees.",
      options: ["270°", "180°", "90°", "360°"],
      correctAnswer: 0,
      explanation: `Step 1: Use conversion formula
Degrees = Radians × 180/π

Step 2: Apply conversion
3π/2 × 180/π = (3/2) × 180

Step 3: Calculate
(3/2) × 180 = 3 × 90 = 270°`
    },
    {
      id: 24,
      question: "What is csc(30°)?",
      options: ["2", "√3", "2/√3", "1"],
      correctAnswer: 0,
      explanation: `Step 1: Recall cosecant definition
csc(θ) = 1/sin(θ)

Step 2: Find sin(30°)
sin(30°) = 1/2

Step 3: Calculate csc(30°)
csc(30°) = 1/(1/2) = 2`
    },
    {
      id: 25,
      question: "In a right triangle, if tan(θ) = 3/4, what is sin(θ)?",
      options: ["3/5", "4/5", "3/4", "5/3"],
      correctAnswer: 0,
      explanation: `Step 1: Set up the triangle
tan(θ) = Opposite/Adjacent = 3/4
So Opposite = 3, Adjacent = 4

Step 2: Find hypotenuse using Pythagorean theorem
Hypotenuse = √(3² + 4²) = √(9 + 16) = √25 = 5

Step 3: Calculate sin(θ)
sin(θ) = Opposite/Hypotenuse = 3/5`
    },
    {
      id: 26,
      question: "What is the value of sin(π/6)?",
      options: ["1/2", "√3/2", "√2/2", "1"],
      correctAnswer: 0,
      explanation: `Step 1: Convert radians to degrees
π/6 = 30°

Step 2: Recall exact value
sin(30°) = 1/2

Step 3: This is a standard trigonometric value
In a 30-60-90 triangle, opposite/hypotenuse = 1/2`
    },
    {
      id: 27,
      question: "If cos(θ) = -0.5 and θ is in second quadrant, what is tan(θ)?",
      options: ["-√3", "√3", "-1/√3", "1/√3"],
      correctAnswer: 0,
      explanation: `Step 1: Find sin(θ) using identity
sin²(θ) = 1 - cos²(θ) = 1 - (-0.5)² = 1 - 0.25 = 0.75
sin(θ) = √0.75 = √3/2 (positive in second quadrant)

Step 2: Calculate tan(θ)
tan(θ) = sin(θ)/cos(θ) = (√3/2)/(-0.5) = -√3`
    },
    {
      id: 28,
      question: "What is the amplitude of y = -4sin(x)?",
      options: ["4", "-4", "2", "1"],
      correctAnswer: 0,
      explanation: `Step 1: Understand amplitude definition
Amplitude is always positive
It's the absolute value of the coefficient

Step 2: Identify the coefficient
y = -4sin(x)
Coefficient = -4

Step 3: Amplitude = |-4| = 4
The negative sign only affects phase, not amplitude`
    },
    {
      id: 29,
      question: "Find the exact value of sin(75°) using sum formula.",
      options: ["(√6 + √2)/4", "(√6 - √2)/4", "(√3 + 1)/2", "(√3 - 1)/2"],
      correctAnswer: 0,
      explanation: `Step 1: Use angle sum identity
sin(75°) = sin(45° + 30°)
= sin(45°)cos(30°) + cos(45°)sin(30°)

Step 2: Substitute exact values
= (√2/2)(√3/2) + (√2/2)(1/2)
= (√6/4) + (√2/4)

Step 3: Combine terms
= (√6 + √2)/4`
    },
    {
      id: 30,
      question: "What is the domain of y = tan(x)?",
      options: ["All real numbers except π/2 + kπ", "All real numbers", "[-1,1]", "[0,∞)"],
      correctAnswer: 0,
      explanation: `Step 1: Understand tangent definition
tan(x) = sin(x)/cos(x)

Step 2: Identify restrictions
tan(x) is undefined when cos(x) = 0
cos(x) = 0 at x = π/2 + kπ where k is an integer

Step 3: Domain is all real numbers except these points`
    }
  ]

  // Shuffle questions for random order
  const [shuffledQuestions, setShuffledQuestions] = useState([])

  useEffect(() => {
    // Shuffle questions when component mounts
    const shuffled = [...trigonometryQuestions].sort(() => Math.random() - 0.5)
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
    const reshuffled = [...trigonometryQuestions].sort(() => Math.random() - 0.5)
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
    if (percentage >= 90) return "Outstanding! 🎉 You're a trigonometry master!"
    if (percentage >= 80) return "Excellent work! 🌟 You've mastered trigonometric concepts!"
    if (percentage >= 70) return "Great job! 💪 You understand trigonometry well!"
    if (percentage >= 60) return "Good effort! 👍 Keep practicing trigonometric ratios!"
    if (percentage >= 50) return "Not bad! 📚 Review the explanations and try again!"
    return "Keep practicing! 🔥 Every triangle you solve makes you better. Try again!"
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">📐</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Trigonometry Quiz Challenge
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Test your trigonometry knowledge with 30 challenging questions. You have 30 minutes to complete the quiz!
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

          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Topics Covered:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
              <span>• Trigonometric Ratios</span>
              <span>• Unit Circle</span>
              <span>• Sine & Cosine Rules</span>
              <span>• Identities</span>
              <span>• Graphs</span>
              <span>• Applications</span>
            </div>
          </div>

          <button
            onClick={() => setQuizStarted(true)}
            className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-12 py-4 rounded-2xl hover:from-red-600 hover:to-orange-700 transition-all font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            Start Quiz Now 🚀
          </button>

          <Link
            to="/topics/trigonometry"
            className="block mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Trigonometry Topics
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
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
                <div className="text-4xl font-bold text-red-600 mb-2">
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
                className="bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-semibold"
              >
                Try Again 🔄
              </button>
              <Link
                to="/topics/trigonometry"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Trigonometry Quiz</h1>
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
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
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
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            userAnswers[currentQuestion] === optionIndex
                              ? 'bg-red-500 text-white'
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
                    : 'bg-red-500 text-white hover:bg-red-600'
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
                        ? 'bg-red-500 text-white shadow-md'
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
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
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