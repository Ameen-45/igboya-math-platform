import { Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function StatisticsIntroduction() {
  const [currentSection, setCurrentSection] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const speechSynth = useRef(null)

  const sections = [
    {
      title: "Welcome to Statistics! 📊",
      content: `Ready to unlock the power of data analysis? Statistics helps us make sense of information and discover patterns in our world!`,
      voiceText: "Welcome to Statistics! Get ready to unlock the power of data analysis and discover patterns in our world.",
      type: "welcome",
      button: "Let's Begin!",
      icon: "📊"
    },
    {
      title: "What is Statistics?",
      content: `Statistics is the science of collecting, analyzing, and interpreting data. It helps us make informed decisions based on evidence rather than guesswork.`,
      voiceText: "Statistics is the science of collecting, analyzing, and interpreting data.",
      type: "concept",
      question: "If all values are the same, what is the range?",
      answer: "0",
      button: "Continue",
      icon: "🔍"
    },
    {
      title: "Measures of Central Tendency",
      content: `Mean, Median, and Mode are the main tools used to summarize data.`,
      voiceText: "Mean, Median, and Mode summarize data.",
      type: "interactive",
      question: "In 3, 7, 7, 8, 10 — what is the mode?",
      answer: "7",
      button: "Got it!",
      icon: "⚖️"
    },
    {
      title: "The Mean",
      content: `Mean = sum of values ÷ number of values`,
      voiceText: "Mean is sum divided by number of values.",
      type: "problem",
      equation: "Mean = (12 + 14 + 13 + 15 + 16) ÷ 5",
      solution: "14",
      hint: "Add all values then divide by 5",
      button: "Reveal Answer",
      icon: "📈"
    }
  ]

  // ✅ STOP SPEECH (FIXED)
  const stopSpeech = useCallback(() => {
    if (speechSynth.current) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }, [])

  // ✅ SPEAK TEXT (FIXED)
  const speakText = useCallback((text) => {
    stopSpeech()

    if (!window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
    speechSynth.current = utterance
  }, [stopSpeech])

  const startLearning = () => {
    setShowIntro(false)
    setCurrentSection(0)
  }

  const handleNext = () => {
    stopSpeech()
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    }
  }

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* INTRO */}
        {showIntro && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="text-5xl mb-4">📊</div>

            <h1 className="text-4xl font-bold mb-3">
              Introduction to Statistics
            </h1>

            <p className="text-gray-600 mb-8">
              Learn how to analyze and understand data easily.
            </p>

            <button
              onClick={startLearning}
              className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold"
            >
              Start Learning →
            </button>
          </div>
        )}

        {/* CONTENT */}
        {!showIntro && currentSection >= 0 && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold">
                {sections[currentSection].title}
              </h2>

              <p className="mt-4 text-gray-700 whitespace-pre-line">
                {sections[currentSection].content}
              </p>

              <button
                onClick={() =>
                  isPlaying
                    ? stopSpeech()
                    : speakText(sections[currentSection].voiceText)
                }
                className="mt-4 bg-orange-100 px-4 py-2 rounded-xl"
              >
                {isPlaying ? "Stop 🔇" : "Listen 🔊"}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="bg-orange-500 text-white px-8 py-3 rounded-xl"
              >
                {sections[currentSection].button}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}