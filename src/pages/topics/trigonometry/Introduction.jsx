import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function TrigonometryIntroduction() {
  const [currentSection, setCurrentSection] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const speechSynth = useRef(null)
  const contentRef = useRef(null)

  const sections = [
    {
      title: "Welcome to Trigonometry! 📐",
      content: `Ready to explore triangles, angles, and waves? Trigonometry helps us understand patterns in nature and science!`,
      voiceText: "Welcome to Trigonometry. Let's explore triangles, angles, and waves.",
      type: "welcome",
      button: "Begin Exploration!",
      icon: "📐"
    },
    {
      title: "What is Trigonometry?",
      content: `Trigonometry is the study of relationships between angles and sides in triangles.

It helps us understand waves, motion, and even planetary orbits.`,
      voiceText: "Trigonometry is the study of relationships between angles and sides in triangles.",
      type: "concept",
      example: "Like measuring how tall a building is without climbing it!",
      button: "Continue",
      icon: "📏"
    },
    {
      title: "Trigonometric Ratios",
      content: `SOH-CAH-TOA:

Sine = Opposite / Hypotenuse
Cosine = Adjacent / Hypotenuse
Tangent = Opposite / Adjacent`,
      voiceText: "Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, tangent is opposite over adjacent.",
      type: "interactive",
      question: "Which ratio uses Opposite and Hypotenuse?",
      answer: "sine",
      button: "Got it!",
      icon: "📊"
    },
    {
      title: "Right Triangle Problem",
      content: `If sin(30°) = 0.5 and hypotenuse = 10, find opposite side.`,
      voiceText: "Use sine equals opposite over hypotenuse.",
      type: "problem",
      equation: "sin(30°) = Opposite / 10",
      solution: "5",
      hint: "Multiply sin(30°) by 10",
      button: "Reveal Answer",
      icon: "📐"
    },
    {
      title: "Real World Use",
      content: `Trigonometry is used in GPS, architecture, waves, and astronomy.`,
      voiceText: "Trigonometry is used in GPS, architecture, and waves.",
      type: "application",
      examples: [
        "GPS location tracking",
        "Bridge construction",
        "Sound waves in music"
      ],
      button: "Finish",
      icon: "🌍"
    }
  ]

  const stopSpeech = useCallback(() => {
    if (speechSynth.current) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }, [])

  const speakText = useCallback((text) => {
    stopSpeech()

    if (!('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    speechSynth.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [stopSpeech])

  const startLearning = () => {
    setShowIntro(false)
    setCurrentSection(0)
  }

  const handleNext = () => {
    stopSpeech()
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)

    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    }
  }

  const handleSectionChange = (index) => {
    stopSpeech()
    setUserAnswer('')
    setShowHint(false)
    setShowSolution(false)
    setCurrentSection(index)
  }

  const checkAnswer = () => {
    return userAnswer.trim().toLowerCase() === sections[currentSection]?.answer?.toLowerCase()
  }

  const handleAnswerSubmit = (e) => {
    e.preventDefault()
    if (checkAnswer()) {
      setShowSolution(true)
    } else {
      setShowHint(true)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Trigonometry...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">

        {/* INTRO */}
        {showIntro && (
          <div className="bg-white p-8 rounded-2xl text-center">
            <div className="text-5xl mb-4">📐</div>
            <h1 className="text-3xl font-bold mb-4">Trigonometry</h1>
            <p className="mb-6">Learn triangles, angles and waves</p>
            <button
              onClick={startLearning}
              className="bg-red-500 text-white px-6 py-3 rounded-xl"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* CONTENT */}
        {!showIntro && currentSection >= 0 && (
          <div className="bg-white p-6 rounded-2xl shadow">

            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">
                {sections[currentSection].title}
              </h2>

              <button
                onClick={() =>
                  isPlaying
                    ? stopSpeech()
                    : speakText(sections[currentSection].voiceText)
                }
                className="text-sm bg-gray-100 px-3 py-1 rounded"
              >
                {isPlaying ? "Stop" : "Listen"}
              </button>
            </div>

            {/* CONTENT */}
            <p className="mb-6 whitespace-pre-line">
              {sections[currentSection].content}
            </p>

            {/* INTERACTIVE */}
            {sections[currentSection].type === "interactive" && (
              <form onSubmit={handleAnswerSubmit} className="mb-4">
                <input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="border p-2 w-full mb-2"
                  placeholder="Your answer"
                />
                <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                  Check
                </button>
              </form>
            )}

            {showHint && (
              <p className="text-yellow-600">Hint: SOH-CAH-TOA</p>
            )}

            {showSolution && (
              <p className="text-green-600 font-bold">
                Correct Answer!
              </p>
            )}

            {/* NEXT */}
            <button
              onClick={handleNext}
              className="mt-6 bg-red-500 text-white px-6 py-3 rounded-xl w-full"
            >
              {sections[currentSection].button}
            </button>

            {/* DOT NAV */}
            <div className="flex justify-center mt-4 gap-2">
              {sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSectionChange(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === currentSection ? "bg-red-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* FINISH */}
        {!showIntro && currentSection === sections.length - 1 && (
          <div className="text-center p-8 bg-green-100 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">
              You finished Trigonometry 🎉
            </h2>

            <Link
              to="/topics/trigonometry"
              className="text-green-700 underline"
            >
              Back to Topics
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}