import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function AlgebraQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [quizStarted, setQuizStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState([])

  const speechSynth = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ============================================================
     QUESTION BANK — 30 verified questions (10 EASY, 12 MEDIUM, 8 HARD)
     ============================================================ */
  const questionBank = [
    /* ------------------------- EASY (10) ------------------------- */
    {
      id: 1, difficulty: 'easy',
      question: "Solve for x: 2x + 5 = 13",
      options: ["x = 4", "x = 3", "x = 5", "x = 6"],
      correctAnswer: 0,
      explanation: "Step 1: Subtract 5 from both sides → 2x = 8\nStep 2: Divide by 2 → x = 4",
      voiceText: "Solve for x: 2x plus 5 equals 13. x equals 4."
    },
    {
      id: 2, difficulty: 'easy',
      question: "Solve for y: 3y - 7 = 14",
      options: ["y = 7", "y = 5", "y = 6", "y = 8"],
      correctAnswer: 0,
      explanation: "Step 1: Add 7 to both sides → 3y = 21\nStep 2: Divide by 3 → y = 7",
      voiceText: "Solve for y: 3y minus 7 equals 14. y equals 7."
    },
    {
      id: 3, difficulty: 'easy',
      question: "Simplify: 3(x + 4) - 2(x - 1)",
      options: ["x + 14", "x + 10", "5x + 10", "5x + 14"],
      correctAnswer: 0,
      explanation: "Step 1: Distribute → 3x + 12 - 2x + 2\nStep 2: Combine → x + 14",
      voiceText: "Simplify 3 times x plus 4 minus 2 times x minus 1. Answer is x plus 14."
    },
    {
      id: 4, difficulty: 'easy',
      question: "If y = 2x + 3 and y = 7, what is x?",
      options: ["x = 2", "x = 3", "x = 4", "x = 5"],
      correctAnswer: 0,
      explanation: "Step 1: Substitute → 7 = 2x + 3\nStep 2: 2x = 4 → x = 2",
      voiceText: "If y equals 2x plus 3 and y equals 7, what is x? x equals 2."
    },
    {
      id: 5, difficulty: 'easy',
      question: "Solve: (x - 3)/2 = 5",
      options: ["x = 13", "x = 10", "x = 8", "x = 7"],
      correctAnswer: 0,
      explanation: "Step 1: Multiply both sides by 2 → x - 3 = 10\nStep 2: Add 3 → x = 13",
      voiceText: "Solve x minus 3 over 2 equals 5. x equals 13."
    },
    {
      id: 6, difficulty: 'easy',
      question: "Solve for a: a + 8 = 15",
      options: ["a = 7", "a = 6", "a = 8", "a = 5"],
      correctAnswer: 0,
      explanation: "Subtract 8 from both sides → a = 7",
      voiceText: "Solve a plus 8 equals 15. a equals 7."
    },
    {
      id: 7, difficulty: 'easy',
      question: "Solve for m: m/4 = 6",
      options: ["m = 24", "m = 10", "m = 18", "m = 2"],
      correctAnswer: 0,
      explanation: "Multiply both sides by 4 → m = 24",
      voiceText: "Solve m over 4 equals 6. m equals 24."
    },
    {
      id: 8, difficulty: 'easy',
      question: "Solve for n: 5n = 45",
      options: ["n = 9", "n = 8", "n = 7", "n = 10"],
      correctAnswer: 0,
      explanation: "Divide both sides by 5 → n = 9",
      voiceText: "Solve 5n equals 45. n equals 9."
    },
    {
      id: 9, difficulty: 'easy',
      question: "Simplify: 4a - 3 + 2a + 5",
      options: ["6a + 2", "6a - 8", "2a + 2", "8a + 2"],
      correctAnswer: 0,
      explanation: "Combine like terms: (4a + 2a) + (-3 + 5) = 6a + 2",
      voiceText: "Simplify 4a minus 3 plus 2a plus 5. Answer is 6a plus 2."
    },
    {
      id: 10, difficulty: 'easy',
      question: "Solve for b: b - 6 = -2",
      options: ["b = 4", "b = 8", "b = -4", "b = -8"],
      correctAnswer: 0,
      explanation: "Add 6 to both sides → b = 4",
      voiceText: "Solve b minus 6 equals negative 2. b equals 4."
    },

    /* ------------------------ MEDIUM (12) ------------------------ */
    {
      id: 11, difficulty: 'medium',
      question: "Solve: x² - 5x + 6 = 0",
      options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = -2 or x = -3", "x = -1 or x = -6"],
      correctAnswer: 0,
      explanation: "Factor: (x - 2)(x - 3) = 0 → x = 2 or x = 3",
      voiceText: "Solve x squared minus 5x plus 6 equals zero. x equals 2 or x equals 3."
    },
    {
      id: 12, difficulty: 'medium',
      question: "Solve: 2x² + 13x = 15",
      options: ["x = -7.5 or x = 1", "x = 7.5 or x = -1", "x = 3 or x = -2.5", "x = -3 or x = 2.5"],
      correctAnswer: 0,
      explanation: "2x² + 13x - 15 = 0 → (2x + 15)(x - 1) = 0 → x = -7.5 or x = 1",
      voiceText: "Solve 2x squared plus 13x equals 15. x equals negative 7.5 or x equals 1."
    },
    {
      id: 13, difficulty: 'medium',
      question: "Factor: x² + 7x + 12",
      options: ["(x+3)(x+4)", "(x+2)(x+6)", "(x+1)(x+12)", "(x+5)(x+7)"],
      correctAnswer: 0,
      explanation: "3 × 4 = 12 and 3 + 4 = 7 → (x + 3)(x + 4)",
      voiceText: "Factor x squared plus 7x plus 12. Answer is x plus 3 times x plus 4."
    },
    {
      id: 14, difficulty: 'medium',
      question: "Solve the system: 2x + y = 7 and x - y = 2",
      options: ["x = 3, y = 1", "x = 2, y = 3", "x = 4, y = -1", "x = 1, y = 5"],
      correctAnswer: 0,
      explanation: "Add equations → 3x = 9 → x = 3. Then y = 1.",
      voiceText: "Solve system: 2x plus y equals 7 and x minus y equals 2. x equals 3, y equals 1."
    },
    {
      id: 15, difficulty: 'medium',
      question: "Simplify: (2x² - 3x + 1) + (x² + 4x - 2)",
      options: ["3x² + x - 1", "3x² + 7x - 1", "x² + x - 1", "2x² + x - 1"],
      correctAnswer: 0,
      explanation: "Combine: (2+1)x² + (-3+4)x + (1-2) = 3x² + x - 1",
      voiceText: "Simplify. Answer is 3x squared plus x minus 1."
    },
    {
      id: 16, difficulty: 'medium',
      question: "Solve: 5(x - 2) = 3(x + 4)",
      options: ["x = 11", "x = 7", "x = 5", "x = 2"],
      correctAnswer: 0,
      explanation: "5x - 10 = 3x + 12 → 2x = 22 → x = 11",
      voiceText: "Solve 5 times x minus 2 equals 3 times x plus 4. x equals 11."
    },
    {
      id: 17, difficulty: 'medium',
      question: "Solve: x² + 4x = 0",
      options: ["x = 0 or x = -4", "x = 0 or x = 4", "x = 2 or x = -2", "x = 1 or x = -4"],
      correctAnswer: 0,
      explanation: "Factor: x(x + 4) = 0 → x = 0 or x = -4",
      voiceText: "Solve x squared plus 4x equals zero. x equals zero or x equals negative 4."
    },
    {
      id: 18, difficulty: 'medium',
      question: "Solve: 2/x = 3/6",
      options: ["x = 4", "x = 3", "x = 2", "x = 1"],
      correctAnswer: 0,
      explanation: "3/6 = 1/2 → 2/x = 1/2 → x = 4",
      voiceText: "Solve 2 over x equals 3 over 6. x equals 4."
    },
    {
      id: 19, difficulty: 'medium',
      question: "Factor: 4x² - 9",
      options: ["(2x-3)(2x+3)", "(4x-3)(x+3)", "(2x-9)(2x+1)", "(4x-1)(x+9)"],
      correctAnswer: 0,
      explanation: "Difference of squares: (2x)² - 3² = (2x - 3)(2x + 3)",
      voiceText: "Factor 4x squared minus 9. Answer is 2x minus 3 times 2x plus 3."
    },
    {
      id: 20, difficulty: 'medium',
      question: "Solve: 3(x + 2) - 2(2x - 1) = 4",
      options: ["x = 4", "x = 2", "x = 0", "x = -2"],
      correctAnswer: 0,
      explanation: "3x + 6 - 4x + 2 = 4 → -x + 8 = 4 → x = 4",
      voiceText: "Solve 3 times x plus 2 minus 2 times 2x minus 1 equals 4. x equals 4."
    },
    {
      id: 21, difficulty: 'medium',
      question: "Solve: (x+1)/3 = (x-2)/2",
      options: ["x = 8", "x = 4", "x = -4", "x = -8"],
      correctAnswer: 0,
      explanation: "Cross multiply: 2(x+1) = 3(x-2) → 2x + 2 = 3x - 6 → x = 8",
      voiceText: "Solve x plus 1 over 3 equals x minus 2 over 2. x equals 8."
    },
    {
      id: 22, difficulty: 'medium',
      question: "Solve: x² + 6x + 9 = 0",
      options: ["x = -3", "x = 3", "x = -6", "x = 0"],
      correctAnswer: 0,
      explanation: "(x + 3)² = 0 → x = -3 (repeated root)",
      voiceText: "Solve x squared plus 6x plus 9 equals zero. x equals negative 3."
    },

    /* ------------------------- HARD (8) -------------------------- */
    {
      id: 23, difficulty: 'hard',
      question: "Solve: (x+3)² = 7",
      options: ["x = -3 + √7 or x = -3 - √7", "x = 3 + √7 or x = 3 - √7", "x = 7 or x = -7", "x = √7"],
      correctAnswer: 0,
      explanation: "Take square root: x + 3 = ±√7 → x = -3 ± √7",
      voiceText: "Solve x plus 3 squared equals 7. x equals negative 3 plus or minus square root of 7."
    },
    {
      id: 24, difficulty: 'hard',
      question: "Solve using quadratic formula: 3x² - 5x - 7 = 0",
      options: ["x ≈ 2.57 or x ≈ -0.91", "x ≈ 1.5 or x ≈ -1.5", "x ≈ 3.2 or x ≈ -0.5", "x ≈ 2 or x ≈ -1"],
      correctAnswer: 0,
      explanation: "x = [5 ± √(25 + 84)] / 6 = [5 ± √109] / 6 ≈ 2.57 or -0.91",
      voiceText: "Solve 3x squared minus 5x minus 7 equals zero. x is approximately 2.57 or negative 0.91."
    },
    {
      id: 25, difficulty: 'hard',
      question: "What is the solution to |2x - 3| = 7?",
      options: ["x = 5 or x = -2", "x = 2 or x = -5", "x = 3 or x = -4", "x = 4 or x = -3"],
      correctAnswer: 0,
      explanation: "Case 1: 2x - 3 = 7 → x = 5\nCase 2: 2x - 3 = -7 → x = -2",
      voiceText: "Solve absolute value of 2x minus 3 equals 7. x equals 5 or x equals negative 2."
    },
    {
      id: 26, difficulty: 'hard',
      question: "Solve: x² + 6x - 7 = 0",
      options: ["x = 1 or x = -7", "x = -1 or x = 7", "x = 3 or x = -2", "x = 2 or x = -3"],
      correctAnswer: 0,
      explanation: "Factor: (x - 1)(x + 7) = 0 → x = 1 or x = -7",
      voiceText: "Solve x squared plus 6x minus 7 equals zero. x equals 1 or x equals negative 7."
    },
    {
      id: 27, difficulty: 'hard',
      question: "Solve: 2x² + 5x - 3 = 0",
      options: ["x = 0.5 or x = -3", "x = -0.5 or x = 3", "x = 1.5 or x = -1", "x = 2 or x = -1.5"],
      correctAnswer: 0,
      explanation: "Factor: (2x - 1)(x + 3) = 0 → x = 0.5 or x = -3",
      voiceText: "Solve 2x squared plus 5x minus 3 equals zero. x equals 0.5 or x equals negative 3."
    },
    {
      id: 28, difficulty: 'hard',
      question: "Simplify: (x² + 3x - 10)/(x - 2)",
      options: ["x + 5", "x - 5", "x + 2", "x - 2"],
      correctAnswer: 0,
      explanation: "Factor numerator: (x + 5)(x - 2). Cancel (x - 2) → x + 5",
      voiceText: "Simplify x squared plus 3x minus 10 over x minus 2. Answer is x plus 5."
    },
    {
      id: 29, difficulty: 'hard',
      question: "If 3x - 2y = 8 and x + y = 4, what is y?",
      options: ["y = 0.8", "y = 1", "y = 2", "y = 3"],
      correctAnswer: 0,
      explanation: "x = 4 - y → 3(4 - y) - 2y = 8 → 12 - 5y = 8 → y = 0.8",
      voiceText: "If 3x minus 2y equals 8 and x plus y equals 4, y equals 0.8."
    },
    {
      id: 30, difficulty: 'hard',
      question: "Solve: 2ˣ = 8",
      options: ["x = 3", "x = 4", "x = 2", "x = 1"],
      correctAnswer: 0,
      explanation: "8 = 2³ → 2ˣ = 2³ → x = 3",
      voiceText: "Solve 2 to the power x equals 8. x equals 3."
    }
  ]

  /* ============================================================
     SHUFFLE UTILITIES
     ============================================================ */
  const shuffleArray = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Shuffle options of a question while tracking the correct answer
  const shuffleOptions = (question) => {
    const correctText = question.options[question.correctAnswer]
    const shuffledOptions = shuffleArray(question.options)
    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: shuffledOptions.indexOf(correctText)
    }
  }

  // Build a quiz: 4 easy + 4 medium + 2 hard, options shuffled
  const buildQuiz = () => {
    const easy = shuffleArray(questionBank.filter(q => q.difficulty === 'easy')).slice(0, 4)
    const medium = shuffleArray(questionBank.filter(q => q.difficulty === 'medium')).slice(0, 4)
    const hard = shuffleArray(questionBank.filter(q => q.difficulty === 'hard')).slice(0, 2)
    const selected = shuffleArray([...easy, ...medium, ...hard])
    return selected.map(q => shuffleOptions(q))
  }

  /* ============================================================
     SPEECH
     ============================================================ */
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

  /* ============================================================
     TIMER
     ============================================================ */
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

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  /* ============================================================
     HANDLERS
     ============================================================ */
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
    const q = shuffledQuestions[questionIndex]
    speakText(`You selected option ${String.fromCharCode(65 + optionIndex)}: ${q.options[optionIndex]}`)
  }

  const handleSubmit = () => {
    setShowResults(true)
    stopSpeech()
    const score = calculateScore()
    speakText(`Quiz completed! You scored ${score} out of ${shuffledQuestions.length}. ${getResultMessage()}`)
  }

  const handleRetry = () => {
    const fresh = buildQuiz()
    setShuffledQuestions(fresh)
    setUserAnswers({})
    setShowResults(false)
    setCurrentQuestion(0)
    setTimeLeft(900)
    setQuizStarted(false)
    setShowExplanation(null)
    stopSpeech()
  }

  const calculateScore = () => {
    let correct = 0
    shuffledQuestions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) correct++
    })
    return correct
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const score = calculateScore()
  const percentage = shuffledQuestions.length ? Math.round((score / shuffledQuestions.length) * 100) : 0

  const getResultMessage = () => {
    if (percentage >= 90) return "Outstanding! You're an algebra genius!"
    if (percentage >= 80) return "Excellent work! You've mastered algebra!"
    if (percentage >= 70) return "Great job! You understand algebra well!"
    if (percentage >= 60) return "Good effort! Keep practicing!"
    if (percentage >= 50) return "Not bad! Review the explanations and try again!"
    return "Keep practicing! Every mistake is a learning opportunity. Try again!"
  }

  const readQuestion = () => {
    const q = shuffledQuestions[currentQuestion]
    if (!q) return
    speakText(`Question ${currentQuestion + 1}: ${q.question}. Options: A: ${q.options[0]}, B: ${q.options[1]}, C: ${q.options[2]}, D: ${q.options[3]}`)
  }

  /* ============================================================
     START SCREEN
     ============================================================ */
  if (!quizStarted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}>
        <div style={{
          maxWidth: '600px', width: '100%', background: 'white',
          borderRadius: '32px', padding: isMobile ? '32px 24px' : '48px',
          textAlign: 'center', border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: isMobile ? '80px' : '100px', height: isMobile ? '80px' : '100px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: '30px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: isMobile ? '40px' : '50px', margin: '0 auto 24px'
          }}>
            📝
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#0F172A', marginBottom: '12px' }}>
            Algebra Quiz Challenge
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B', marginBottom: '24px' }}>
            Test your algebra knowledge with 10 randomly selected questions. You have 15 minutes!
          </p>

          <div style={{
            background: '#FEF3C7', borderRadius: '20px', padding: '20px',
            marginBottom: '24px', border: '1px solid #FDE68A'
          }}>
            <h3 style={{ fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>Quiz Details:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>1</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>10 Questions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>2</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>15 Minutes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>3</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>Randomized Questions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: '#F59E0B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>4</div>
                <span style={{ fontSize: '13px', color: '#92400E' }}>Step-by-step Solutions</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShuffledQuestions(buildQuiz())
              setQuizStarted(true)
              speakText("Quiz started! You have 15 minutes. Good luck!")
            }}
            style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white', border: 'none', borderRadius: '20px',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px'
            }}
          >
            Start Quiz Now 🚀
          </button>

          <Link to="/topics/algebra" style={{ color: '#6366F1', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Algebra Topics
          </Link>
        </div>
      </div>
    )
  }

  /* ============================================================
     RESULTS SCREEN
     ============================================================ */
  if (showResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
        padding: isMobile ? '16px' : '24px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: 'white', borderRadius: '32px',
            padding: isMobile ? '24px' : '32px', marginBottom: '24px',
            textAlign: 'center', border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>
              {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
              Quiz Completed!
            </h2>
            <p style={{ fontSize: '16px', color: '#64748B', marginBottom: '20px' }}>
              {getResultMessage()}
            </p>

            <div style={{ background: '#F8FAFC', borderRadius: '20px', padding: '20px', maxWidth: '300px', margin: '0 auto 20px' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#6366F1', marginBottom: '4px' }}>
                {score}/{shuffledQuestions.length}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>
                {percentage}%
              </div>
              <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                <div style={{
                  width: `${percentage}%`,
                  background: percentage >= 70 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444',
                  height: '100%', borderRadius: '9999px', transition: 'width 1s'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleRetry}
                style={{
                  padding: '12px 24px', background: '#6366F1', color: 'white',
                  border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '600'
                }}>
                Try Again 🔄
              </button>
              <Link to="/topics/algebra" style={{
                padding: '12px 24px', background: '#64748B', color: 'white',
                borderRadius: '16px', textDecoration: 'none', fontWeight: '600'
              }}>
                Back to Topics
              </Link>
            </div>
          </div>

          <div style={{
            background: 'white', borderRadius: '32px',
            padding: isMobile ? '20px' : '28px', border: '1px solid #E2E8F0'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '20px', textAlign: 'center' }}>
              Review Your Answers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {shuffledQuestions.map((question, index) => (
                <div key={index} style={{
                  padding: '20px', borderRadius: '20px',
                  background: userAnswers[index] === question.correctAnswer ? '#DCFCE7' : '#FEE2E2',
                  border: `1px solid ${userAnswers[index] === question.correctAnswer ? '#86EFAC' : '#FECACA'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>Question {index + 1}</span>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '500',
                      background: userAnswers[index] === question.correctAnswer ? '#10B981' : '#EF4444',
                      color: 'white'
                    }}>
                      {userAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#0F172A', marginBottom: '16px' }}>
                    {question.question}
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontWeight: '600', color: '#475569', marginBottom: '8px', fontSize: '13px' }}>Your answer:</p>
                    <div style={{
                      padding: '12px', borderRadius: '12px',
                      background: userAnswers[index] === question.correctAnswer ? '#D1FAE5' : '#FEE2E2',
                      border: `1px solid ${userAnswers[index] === question.correctAnswer ? '#10B981' : '#EF4444'}`
                    }}>
                      {userAnswers[index] !== undefined ? question.options[userAnswers[index]] : 'Not answered'}
                    </div>
                  </div>
                  {userAnswers[index] !== question.correctAnswer && (
                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ fontWeight: '600', color: '#10B981', marginBottom: '8px', fontSize: '13px' }}>Correct answer:</p>
                      <div style={{ padding: '12px', borderRadius: '12px', background: '#D1FAE5', border: '1px solid #10B981' }}>
                        {question.options[question.correctAnswer]}
                      </div>
                    </div>
                  )}
                  <div>
                    <button
                      onClick={() => {
                        if (showExplanation === index) {
                          setShowExplanation(null)
                          stopSpeech()
                        } else {
                          setShowExplanation(index)
                          speakText(question.explanation)
                        }
                      }}
                      style={{
                        padding: '8px 16px', background: '#3B82F6', color: 'white',
                        border: 'none', borderRadius: '12px', cursor: 'pointer',
                        fontSize: '13px', marginBottom: '12px'
                      }}>
                      {showExplanation === index ? 'Hide Solution' : 'Show Step-by-Step Solution'}
                    </button>
                    {showExplanation === index && (
                      <div style={{
                        background: '#FEF3C7', borderRadius: '16px',
                        padding: '16px', border: '1px solid #FDE68A'
                      }}>
                        <h4 style={{ fontWeight: '700', color: '#92400E', marginBottom: '12px' }}>Step-by-Step Solution:</h4>
                        <pre style={{
                          margin: 0, fontSize: '13px', color: '#92400E',
                          whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.6'
                        }}>
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

  /* ============================================================
     QUIZ SCREEN
     ============================================================ */
  const currentQ = shuffledQuestions[currentQuestion]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '16px', marginBottom: '20px', border: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>Algebra Quiz</h1>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Question {currentQuestion + 1} of {shuffledQuestions.length}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#FEE2E2', padding: '6px 12px', borderRadius: '20px',
                fontSize: '13px', fontWeight: '600', color: '#DC2626'
              }}>
                ⏱️ {formatTime(timeLeft)}
              </div>
              <button onClick={readQuestion}
                style={{
                  padding: '6px 12px', background: '#E0E7FF', border: 'none',
                  borderRadius: '12px', cursor: 'pointer', fontSize: '12px', color: '#4338CA'
                }}>
                🔊 Read Question
              </button>
              <button onClick={handleSubmit}
                style={{
                  padding: '8px 16px', background: '#10B981', color: 'white',
                  border: 'none', borderRadius: '12px', cursor: 'pointer',
                  fontWeight: '500', fontSize: '13px'
                }}>
                Submit Quiz
              </button>
            </div>
          </div>
          <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '9999px', height: '6px', marginTop: '12px' }}>
            <div style={{
              width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%`,
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
              height: '100%', borderRadius: '9999px', transition: 'width 0.3s'
            }}></div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
          <div style={{ flex: 3 }}>
            <div style={{
              background: 'white', borderRadius: '24px',
              padding: isMobile ? '20px' : '28px', border: '1px solid #E2E8F0'
            }}>
              <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#0F172A', marginBottom: '24px' }}>
                {currentQ?.question}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentQ?.options.map((option, optionIndex) => (
                  <button key={optionIndex}
                    onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '16px',
                      borderRadius: '16px',
                      border: `2px solid ${userAnswers[currentQuestion] === optionIndex ? '#6366F1' : '#E2E8F0'}`,
                      background: userAnswers[currentQuestion] === optionIndex ? '#EEF2FF' : 'white',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '600',
                        background: userAnswers[currentQuestion] === optionIndex ? '#6366F1' : '#F1F5F9',
                        color: userAnswers[currentQuestion] === optionIndex ? 'white' : '#64748B'
                      }}>
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <span style={{ fontSize: '15px', color: '#0F172A' }}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', gap: '12px' }}>
              <button onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                style={{
                  padding: '12px 20px',
                  background: currentQuestion === 0 ? '#F1F5F9' : 'white',
                  color: currentQuestion === 0 ? '#94A3B8' : '#64748B',
                  border: '1px solid #E2E8F0', borderRadius: '14px',
                  cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', fontWeight: '500'
                }}>
                ← Previous
              </button>
              <button onClick={() => setCurrentQuestion(prev => Math.min(shuffledQuestions.length - 1, prev + 1))}
                disabled={currentQuestion === shuffledQuestions.length - 1}
                style={{
                  padding: '12px 20px',
                  background: currentQuestion === shuffledQuestions.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: currentQuestion === shuffledQuestions.length - 1 ? '#94A3B8' : 'white',
                  border: 'none', borderRadius: '14px',
                  cursor: currentQuestion === shuffledQuestions.length - 1 ? 'not-allowed' : 'pointer', fontWeight: '500'
                }}>
                Next →
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white', borderRadius: '20px',
              padding: '16px', border: '1px solid #E2E8F0',
              position: 'sticky', top: '20px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>Questions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {shuffledQuestions.map((_, index) => (
                  <button key={index} onClick={() => setCurrentQuestion(index)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: '500',
                      background: currentQuestion === index ? '#6366F1' : userAnswers[index] !== undefined ? '#10B981' : '#F1F5F9',
                      color: currentQuestion === index || userAnswers[index] !== undefined ? 'white' : '#64748B',
                      border: 'none', cursor: 'pointer'
                    }}>
                    {index + 1}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#6366F1', borderRadius: '3px' }}></div>
                  <span>Current</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#10B981', borderRadius: '3px' }}></div>
                  <span>Answered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#F1F5F9', borderRadius: '3px', border: '1px solid #E2E8F0' }}></div>
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