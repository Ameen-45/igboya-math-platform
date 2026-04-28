import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

export default function AlgebraIntroduction() {
  const [currentSection, setCurrentSection] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // FIXED: missing ref
  const contentRef = useRef(null);

  // Speech synthesis ref
  const speechSynth = useRef(null);

  const sections = [
    {
      title: "Welcome to Algebra! 🎯",
      content:
        "Ready to unlock the power of algebra? This is where math becomes a superpower for solving real-world problems!",
      voiceText:
        "Welcome to Algebra! Get ready to unlock the power of mathematics and solve real-world problems like a pro.",
      type: "welcome",
      button: "Let's Begin!",
      icon: "🚀",
    },
    {
      title: "What is Algebra?",
      content: `Algebra is like a secret code that uses letters and symbols to represent numbers.

Instead of just numbers like 3 + 5, algebra lets us work with unknown values like x + 5 = 8.`,
      voiceText:
        "Algebra is a secret code using letters and symbols to represent numbers.",
      type: "concept",
      example: "Think of x as an unknown number you need to discover!",
      button: "Continue",
      icon: "🔍",
    },
    {
      title: "Meet the Algebra Team",
      content: `Variables, constants, expressions, and equations all work together.`,
      voiceText:
        "Meet your algebra team: variables, constants, expressions, and equations.",
      type: "interactive",
      question: "In 3x + 2 = 11, what is the variable?",
      answer: "x",
      button: "Got it!",
      icon: "👥",
    },
    {
      title: "Algebra in Action!",
      content: `If x + 5 = 8, what is x?`,
      voiceText:
        "If x plus five equals eight, what is x?",
      type: "problem",
      equation: "x + 5 = 8",
      solution: "3",
      hint: "Think: what plus 5 equals 8?",
      button: "Reveal Answer",
      icon: "🔎",
    },
  ];

  // =========================
  // SPEECH FUNCTIONS (FIXED)
  // =========================

  const stopSpeech = useCallback(() => {
    if (speechSynth.current) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const speakText = useCallback((text) => {
    stopSpeech();

    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynth.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stopSpeech]);

  // =========================
  // NAVIGATION
  // =========================

  const startLearning = () => {
    setShowIntro(false);
    setCurrentSection(0);
  };

  const handleNext = () => {
    stopSpeech();
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);

    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handleSectionChange = (index) => {
    stopSpeech();
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
    setCurrentSection(index);
  };

  const checkAnswer = () => {
    return (
      userAnswer.trim().toLowerCase() ===
      sections[currentSection]?.answer?.toLowerCase()
    );
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (checkAnswer()) {
      setShowSolution(true);
    } else {
      setShowHint(true);
    }
  };

  // Loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup speech
  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Algebra...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4">

        {/* INTRO */}
        {showIntro && (
          <div className="text-center bg-white p-6 rounded-2xl shadow-xl">
            <div className="text-5xl mb-4">🧮</div>
            <h1 className="text-3xl font-bold">Introduction to Algebra</h1>
            <p className="text-gray-600 mt-2">
              Learn algebra step by step
            </p>

            <button
              onClick={startLearning}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* CONTENT */}
        {!showIntro && currentSection >= 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-xl mt-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {sections[currentSection].title}
              </h2>

              <button
                onClick={() =>
                  isPlaying
                    ? stopSpeech()
                    : speakText(sections[currentSection].voiceText)
                }
                className="bg-gray-200 px-3 py-1 rounded"
              >
                {isPlaying ? "Stop" : "Listen"}
              </button>
            </div>

            <p className="whitespace-pre-line text-gray-700">
              {sections[currentSection].content}
            </p>

            {/* SIMPLE NEXT */}
            <button
              onClick={handleNext}
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
            >
              Next
            </button>

          </div>
        )}
      </div>
    </div>
  );
}