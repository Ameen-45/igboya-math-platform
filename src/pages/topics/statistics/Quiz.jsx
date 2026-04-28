import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function StatisticsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(null)

  const statisticsQuestions = [
    {
      id: 1,
      question: "What is the mean of the dataset: 5, 7, 8, 10, 15?",
      options: ["9", "8", "7.5", "10"],
      correctAnswer: 0,
      explanation: `Step 1: Add all values
5 + 7 + 8 + 10 + 15 = 45

Step 2: Divide by number of values
45 ÷ 5 = 9

Step 3: The mean is 9`
    },
    {
      id: 2,
      question: "What is the median of: 12, 8, 15, 6, 20?",
      options: ["12", "10", "15", "8"],
      correctAnswer: 0,
      explanation: `Step 1: Arrange in ascending order
6, 8, 12, 15, 20

Step 2: Find middle value (odd number of values)
Middle position: (5 + 1) ÷ 2 = 3rd value

Step 3: The median is 12`
    },
    {
      id: 3,
      question: "What is the mode of: 4, 7, 4, 3, 7, 4, 9?",
      options: ["4", "7", "3", "No mode"],
      correctAnswer: 0,
      explanation: `Step 1: Count frequency of each value
4 appears 3 times
7 appears 2 times
3 appears 1 time
9 appears 1 time

Step 2: Identify most frequent value
4 appears most frequently (3 times)

Step 3: The mode is 4`
    },
    {
      id: 4,
      question: "Calculate the range: 25, 31, 42, 18, 37",
      options: ["24", "19", "26", "23"],
      correctAnswer: 0,
      explanation: `Step 1: Find maximum value
Maximum = 42

Step 2: Find minimum value
Minimum = 18

Step 3: Calculate range
Range = Maximum - Minimum = 42 - 18 = 24`
    },
    {
      id: 5,
      question: "What is the probability of rolling an even number on a fair die?",
      options: ["1/2", "1/3", "2/3", "1/6"],
      correctAnswer: 0,
      explanation: `Step 1: Identify favorable outcomes
Even numbers on a die: 2, 4, 6 (3 outcomes)

Step 2: Identify total possible outcomes
Total numbers on a die: 1, 2, 3, 4, 5, 6 (6 outcomes)

Step 3: Calculate probability
Probability = Favorable outcomes / Total outcomes = 3/6 = 1/2`
    },
    {
      id: 6,
      question: "Calculate variance for: 2, 4, 6, 8, 10",
      options: ["8", "6", "10", "4"],
      correctAnswer: 0,
      explanation: `Step 1: Find mean
Mean = (2+4+6+8+10)/5 = 30/5 = 6

Step 2: Calculate squared differences
(2-6)²=16, (4-6)²=4, (6-6)²=0, (8-6)²=4, (10-6)²=16

Step 3: Sum squared differences
16+4+0+4+16 = 40

Step 4: Divide by number of values
40 ÷ 5 = 8

Step 5: Variance = 8`
    },
    {
      id: 7,
      question: "What is the standard deviation if variance is 16?",
      options: ["4", "8", "16", "256"],
      correctAnswer: 0,
      explanation: `Step 1: Recall relationship
Standard Deviation = √Variance

Step 2: Calculate square root
√16 = 4

Step 3: Standard Deviation = 4`
    },
    {
      id: 8,
      question: "If P(A) = 0.3 and P(B) = 0.4, and A and B are independent, what is P(A and B)?",
      options: ["0.12", "0.7", "0.1", "0.58"],
      correctAnswer: 0,
      explanation: `Step 1: Use multiplication rule for independent events
For independent events: P(A and B) = P(A) × P(B)

Step 2: Multiply probabilities
0.3 × 0.4 = 0.12

Step 3: P(A and B) = 0.12`
    },
    {
      id: 9,
      question: "What is Q1 (first quartile) of: 3, 7, 8, 12, 14, 18, 21, 24?",
      options: ["7.5", "8", "10", "12"],
      correctAnswer: 0,
      explanation: `Step 1: Find median of lower half
Dataset: 3, 7, 8, 12, 14, 18, 21, 24
Lower half (first 4 values): 3, 7, 8, 12

Step 2: Find median of lower half
(7 + 8) ÷ 2 = 15 ÷ 2 = 7.5

Step 3: Q1 = 7.5`
    },
    {
      id: 10,
      question: "Calculate z-score for x=85, μ=75, σ=5",
      options: ["2", "1.5", "2.5", "3"],
      correctAnswer: 0,
      explanation: `Step 1: Use z-score formula
z = (x - μ) ÷ σ

Step 2: Substitute values
z = (85 - 75) ÷ 5 = 10 ÷ 5 = 2

Step 3: z-score = 2`
    },
    {
      id: 11,
      question: "What is the correlation coefficient range?",
      options: ["-1 to +1", "0 to 1", "-1 to 0", "0 to 100"],
      correctAnswer: 0,
      explanation: `Step 1: Understand correlation coefficient
Pearson's correlation coefficient (r) measures linear relationship

Step 2: Know the range
r ranges from -1 to +1

Step 3: Interpret values
-1 = perfect negative correlation
+1 = perfect positive correlation
0 = no correlation`
    },
    {
      id: 12,
      question: "If P(A) = 0.6, what is P(not A)?",
      options: ["0.4", "0.6", "0.3", "0.5"],
      correctAnswer: 0,
      explanation: `Step 1: Use complement rule
P(not A) = 1 - P(A)

Step 2: Substitute value
P(not A) = 1 - 0.6 = 0.4

Step 3: P(not A) = 0.4`
    },
    {
      id: 13,
      question: "What is the IQR for: 5, 7, 9, 12, 15, 18, 22?",
      options: ["9", "8", "10", "11"],
      correctAnswer: 0,
      explanation: `Step 1: Find Q1 (median of lower half)
Lower half: 5, 7, 9 → Q1 = 7

Step 2: Find Q3 (median of upper half)
Upper half: 15, 18, 22 → Q3 = 18

Step 3: Calculate IQR
IQR = Q3 - Q1 = 18 - 7 = 11`
    },
    {
      id: 14,
      question: "In normal distribution, what percentage lies within ±1σ?",
      options: ["68%", "95%", "99.7%", "50%"],
      correctAnswer: 0,
      explanation: `Step 1: Recall empirical rule
For normal distribution:
±1σ contains 68% of data
±2σ contains 95% of data
±3σ contains 99.7% of data

Step 2: Answer for ±1σ
68% of data lies within ±1 standard deviation`
    },
    {
      id: 15,
      question: "Calculate coefficient of variation if μ=50 and σ=10",
      options: ["20%", "25%", "15%", "30%"],
      correctAnswer: 0,
      explanation: `Step 1: Use CV formula
CV = (σ ÷ μ) × 100%

Step 2: Substitute values
CV = (10 ÷ 50) × 100% = 0.2 × 100% = 20%

Step 3: Coefficient of Variation = 20%`
    },
    {
      id: 16,
      question: "What is the probability of drawing a heart from a standard deck?",
      options: ["1/4", "1/13", "1/52", "1/2"],
      correctAnswer: 0,
      explanation: `Step 1: Count favorable outcomes
Hearts in a deck: 13 cards

Step 2: Count total outcomes
Total cards: 52

Step 3: Calculate probability
Probability = 13/52 = 1/4`
    },
    {
      id: 17,
      question: "If P(A|B) = 0.3 and P(B) = 0.5, what is P(A and B)?",
      options: ["0.15", "0.2", "0.3", "0.8"],
      correctAnswer: 0,
      explanation: `Step 1: Use conditional probability formula
P(A|B) = P(A and B) ÷ P(B)

Step 2: Rearrange formula
P(A and B) = P(A|B) × P(B)

Step 3: Calculate
P(A and B) = 0.3 × 0.5 = 0.15`
    },
    {
      id: 18,
      question: "What is the geometric mean of 4 and 9?",
      options: ["6", "6.5", "5", "7"],
      correctAnswer: 0,
      explanation: `Step 1: Use geometric mean formula
Geometric Mean = √(a × b)

Step 2: Multiply values
4 × 9 = 36

Step 3: Take square root
√36 = 6

Step 4: Geometric Mean = 6`
    },
    {
      id: 19,
      question: "Calculate harmonic mean of 2, 3, and 6",
      options: ["3", "2.5", "3.5", "4"],
      correctAnswer: 0,
      explanation: `Step 1: Use harmonic mean formula
Harmonic Mean = n ÷ (∑(1/x))

Step 2: Calculate sum of reciprocals
1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1

Step 3: Divide number of values
3 ÷ 1 = 3

Step 4: Harmonic Mean = 3`
    },
    {
      id: 20,
      question: "What is the expected value of fair die roll?",
      options: ["3.5", "3", "4", "3.8"],
      correctAnswer: 0,
      explanation: `Step 1: List all outcomes and probabilities
Each number 1-6 has probability 1/6

Step 2: Calculate expected value
E(X) = (1+2+3+4+5+6) × (1/6) = 21 × (1/6) = 3.5

Step 3: Expected Value = 3.5`
    },
    {
      id: 21,
      question: "If variance is 25, what is standard deviation?",
      options: ["5", "10", "25", "625"],
      correctAnswer: 0,
      explanation: `Step 1: Relationship between variance and standard deviation
Standard Deviation = √Variance

Step 2: Calculate square root
√25 = 5

Step 3: Standard Deviation = 5`
    },
    {
      id: 22,
      question: "What is P(A or B) if P(A)=0.4, P(B)=0.3, and P(A and B)=0.1?",
      options: ["0.6", "0.7", "0.5", "0.8"],
      correctAnswer: 0,
      explanation: `Step 1: Use addition rule
P(A or B) = P(A) + P(B) - P(A and B)

Step 2: Substitute values
P(A or B) = 0.4 + 0.3 - 0.1 = 0.6

Step 3: P(A or B) = 0.6`
    },
    {
      id: 23,
      question: "What is the median of normal distribution?",
      options: ["Equal to mean", "Greater than mean", "Less than mean", "Zero"],
      correctAnswer: 0,
      explanation: `Step 1: Understand normal distribution properties
In normal distribution:
- Mean, median, and mode are all equal
- Distribution is symmetric

Step 2: Conclusion
Median = Mean in normal distribution`
    },
    {
      id: 24,
      question: "Calculate skewness if mean=50, median=45, mode=40",
      options: ["Positive", "Negative", "Zero", "Cannot determine"],
      correctAnswer: 0,
      explanation: `Step 1: Use relationship between mean, median, mode
For unimodal distributions:
If mean > median > mode → Positive skew
If mean < median < mode → Negative skew

Step 2: Analyze given values
50 > 45 > 40 → Mean > Median > Mode

Step 3: Conclusion
Distribution is positively skewed`
    },
    {
      id: 25,
      question: "What is the range of probability values?",
      options: ["0 to 1", "-1 to 1", "0 to 100", "0 to infinity"],
      correctAnswer: 0,
      explanation: `Step 1: Understand probability axioms
Probability values must satisfy:
1. 0 ≤ P(A) ≤ 1 for any event A
2. P(sample space) = 1
3. P(empty set) = 0

Step 2: Range conclusion
All probability values range from 0 to 1 inclusive`
    },
    {
      id: 26,
      question: "If r=0.8, how would you describe correlation?",
      options: ["Strong positive", "Weak positive", "Strong negative", "No correlation"],
      correctAnswer: 0,
      explanation: `Step 1: Interpret correlation coefficient
r = +0.8 indicates:
- Positive relationship (both variables increase together)
- Strong correlation (close to +1)

Step 2: Description
Strong positive linear correlation`
    },
    {
      id: 27,
      question: "What is the formula for sample variance?",
      options: ["∑(x-μ)²/(n-1)", "∑(x-μ)²/n", "∑(x-μ)/n", "√[∑(x-μ)²/n]"],
      correctAnswer: 0,
      explanation: `Step 1: Distinguish population vs sample variance
Population variance: σ² = ∑(x-μ)²/N
Sample variance: s² = ∑(x-x̄)²/(n-1)

Step 2: Sample variance uses n-1 (Bessel's correction)
This corrects bias in estimating population variance

Step 3: Correct formula: ∑(x-μ)²/(n-1)`
    },
    {
      id: 28,
      question: "What percentage lies between Q1 and Q3?",
      options: ["50%", "25%", "75%", "68%"],
      correctAnswer: 0,
      explanation: `Step 1: Understand quartiles
Q1 = 25th percentile
Q3 = 75th percentile

Step 2: Calculate percentage between
75% - 25% = 50%

Step 3: Conclusion
50% of data lies between Q1 and Q3`
    },
    {
      id: 29,
      question: "If P(A)=0.2, P(B)=0.3, and they're mutually exclusive, what is P(A and B)?",
      options: ["0", "0.06", "0.5", "0.1"],
      correctAnswer: 0,
      explanation: `Step 1: Understand mutually exclusive events
Mutually exclusive events cannot occur together
P(A and B) = 0 for mutually exclusive events

Step 2: Apply definition
Since A and B are mutually exclusive, P(A and B) = 0`
    },
    {
      id: 30,
      question: "What is the formula for binomial probability?",
      options: ["C(n,k)p^k(1-p)^(n-k)", "np", "√[np(1-p)]", "p(1-p)"],
      correctAnswer: 0,
      explanation: `Step 1: Binomial probability formula
P(X=k) = C(n,k) × p^k × (1-p)^(n-k)

Where:
C(n,k) = combinations
p = probability of success
n = number of trials
k = number of successes

Step 2: Correct formula
C(n,k)p^k(1-p)^(n-k)`
    }
  ]

  // Shuffle questions for random order
  const [shuffledQuestions, setShuffledQuestions] = useState([])

  useEffect(() => {
    // Shuffle questions when component mounts
    const shuffled = [...statisticsQuestions].sort(() => Math.random() - 0.5)
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
    const reshuffled = [...statisticsQuestions].sort(() => Math.random() - 0.5)
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
    if (percentage >= 90) return "Outstanding! 🎉 You're a statistics genius!"
    if (percentage >= 80) return "Excellent work! 🌟 You've mastered statistics!"
    if (percentage >= 70) return "Great job! 💪 You understand statistics well!"
    if (percentage >= 60) return "Good effort! 👍 Keep practicing!"
    if (percentage >= 50) return "Not bad! 📚 Review the explanations and try again!"
    return "Keep practicing! 🔥 Every mistake is a learning opportunity. Try again!"
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Statistics Quiz Challenge
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Test your statistics knowledge with 30 challenging questions. You have 30 minutes to complete the quiz!
          </p>
          
          <div className="bg-yellow-50 rounded-2xl p-6 mb-6 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-3">Quiz Details:</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                <span>30 Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                <span>30 Minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                <span>Multiple Choice</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">4</div>
                <span>Step-by-step Solutions</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setQuizStarted(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-12 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-lg shadow-2xl transform hover:scale-105"
          >
            Start Quiz Now 🚀
          </button>

          <Link
            to="/topics/statistics"
            className="block mt-4 text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Statistics Topics
          </Link>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
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
                <div className="text-4xl font-bold text-orange-600 mb-2">
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
                className="bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors font-semibold"
              >
                Try Again 🔄
              </button>
              <Link
                to="/topics/statistics"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Statistics Quiz</h1>
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
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
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
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            userAnswers[currentQuestion] === optionIndex
                              ? 'bg-orange-500 text-white'
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
                    : 'bg-orange-500 text-white hover:bg-orange-600'
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
                        ? 'bg-orange-500 text-white shadow-md'
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
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
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