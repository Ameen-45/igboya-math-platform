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
  const [isMobile, setIsMobile] = useState(false);
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  const speechSynth = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      title: "Welcome to Algebra! 🎯",
      content: "Algebra is the gateway to higher mathematics! It's used everywhere - from calculating loan payments to designing video games and predicting weather patterns.\n\nIn this course, you'll learn:\n• How to work with variables and expressions\n• Solve equations step by step\n• Apply algebra to real-world problems\n• Build critical thinking skills\n\nReady to begin your algebra journey? Let's dive in!",
      voiceText: "Welcome to Algebra! Algebra is the gateway to higher mathematics. It's used everywhere from calculating loan payments to designing video games and predicting weather patterns. In this course, you will learn how to work with variables and expressions, solve equations step by step, apply algebra to real-world problems, and build critical thinking skills. Ready to begin your algebra journey? Let's dive in!",
      type: "welcome",
      button: "Let's Begin!",
      icon: "🚀",
      duration: "3 min",
      keyPoints: ["Variables & Expressions", "Solving Equations", "Real-world Applications", "Critical Thinking"]
    },
    {
      title: "What is Algebra? 🤔",
      content: "Think of algebra as a detective game where letters are clues and equations are puzzles waiting to be solved!\n\n🔍 Key Concepts:\n• Variables (letters like x, y, z) represent unknown numbers\n• Constants are fixed numbers (like 2, 5, 10)\n• Expressions combine variables and constants (like 2x + 3)\n• Equations show two expressions are equal (like 2x + 3 = 7)\n\nReal-life Example: If you buy x apples at $2 each and pay $10 total, we write: 2x = 10, so x = 5 apples!",
      voiceText: "Think of algebra as a detective game where letters are clues and equations are puzzles waiting to be solved. Variables like x, y, and z represent unknown numbers. Constants are fixed numbers like two, five, and ten. Expressions combine variables and constants like two x plus three. Equations show two expressions are equal like two x plus three equals seven. For example, if you buy x apples at two dollars each and pay ten dollars total, we write two x equals ten, so x equals five apples!",
      type: "concept",
      example: "If you buy x apples at $2 each and pay $10 total: 2x = 10 → x = 5 apples",
      button: "Continue",
      icon: "🔍",
      duration: "4 min",
      keyPoints: ["Variables represent unknowns", "Constants are fixed numbers", "Expressions combine terms", "Equations show balance"]
    },
    {
      title: "Meet the Algebra Team 👥",
      content: "Every algebra problem has four key players working together:\n\n📌 VARIABLES (x, y, z): The mystery numbers we're trying to find\n📌 CONSTANTS (2, 5, -3): The fixed numbers that don't change\n📌 EXPRESSIONS (2x + 3): A mathematical phrase without an equal sign\n📌 EQUATIONS (2x + 3 = 7): A complete sentence with an equal sign\n\nThink of it like a recipe: Variables are the ingredients we need to find, constants are the measured amounts, expressions are the mixing instructions, and equations are the final balanced dish!",
      voiceText: "Every algebra problem has four key players working together. Variables like x, y, and z are the mystery numbers we are trying to find. Constants like two, five, and negative three are the fixed numbers that do not change. Expressions like two x plus three are mathematical phrases without an equal sign. Equations like two x plus three equals seven are complete sentences with an equal sign. Think of it like a recipe: variables are the ingredients we need to find, constants are the measured amounts, expressions are the mixing instructions, and equations are the final balanced dish!",
      type: "interactive",
      question: "In the equation 3x + 2 = 11, identify the variable.",
      answer: "x",
      hint: "The variable is the letter representing an unknown number.",
      explanation: "The variable is x (the unknown we solve for). The numbers 3, 2, and 11 are constants.",
      button: "Check Answer",
      icon: "👥",
      duration: "5 min",
      keyPoints: ["Variables = Unknowns", "Constants = Fixed numbers", "Expressions = Phrases", "Equations = Complete sentences"]
    },
    {
      title: "Solving Simple Equations 🔧",
      content: "Solving equations is like unwrapping a present - we need to uncover what's inside!\n\nStep-by-Step Method (The Balance Approach):\n\nExample 1: x + 5 = 8\nStep 1: Identify what's added to x (it's +5)\nStep 2: Do the opposite operation to both sides (subtract 5)\nStep 3: x + 5 - 5 = 8 - 5\nStep 4: Simplify → x = 3\n\nExample 2: 2x = 10\nStep 1: Identify what's multiplying x (it's ×2)\nStep 2: Do the opposite (divide both sides by 2)\nStep 3: 2x ÷ 2 = 10 ÷ 2\nStep 4: Simplify → x = 5\n\nRemember: Whatever you do to one side, you MUST do to the other!",
      voiceText: "Solving equations is like unwrapping a present. We need to uncover what is inside. Let me show you the step by step method using the balance approach. Example one: x plus five equals eight. Step one, identify what is added to x, it's plus five. Step two, do the opposite operation to both sides, subtract five. Step three, x plus five minus five equals eight minus five. Step four, simplify to get x equals three. Example two: two x equals ten. Step one, identify what is multiplying x, it's times two. Step two, do the opposite, divide both sides by two. Step three, two x divided by two equals ten divided by two. Step four, simplify to get x equals five. Remember, whatever you do to one side, you must do to the other!",
      type: "problem",
      equation: "x + 5 = 8",
      solution: "3",
      hint: "Think: what number plus 5 equals 8?",
      explanation: "Subtract 5 from both sides: 8 - 5 = 3, so x = 3",
      button: "Show Solution",
      icon: "🔧",
      duration: "4 min",
      keyPoints: ["Keep equation balanced", "Do opposite operations", "Simplify step by step", "Check your answer!"]
    },
    {
      title: "Practice Problem 🎯",
      content: "Now it's your turn to solve!\n\nProblem: 3x = 15\n\nThink about what you need to do:\n• What operation is being done to x?\n• What's the opposite operation?\n• Apply it to both sides\n• What do you get?\n\nTry solving it yourself before revealing the answer!",
      voiceText: "Now it's your turn to solve. Problem: three x equals fifteen. Think about what you need to do. What operation is being done to x? What is the opposite operation? Apply it to both sides. What do you get? Try solving it yourself before revealing the answer!",
      type: "practice",
      equation: "3x = 15",
      solution: "5",
      hint: "3x means 3 multiplied by x. The opposite of multiplication is division.",
      explanation: "Divide both sides by 3: 3x ÷ 3 = 15 ÷ 3 → x = 5",
      button: "Check Your Answer",
      icon: "🎯",
      duration: "3 min",
      keyPoints: ["Identify the operation", "Use inverse operation", "Apply to both sides", "Verify your answer"]
    }
  ];

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
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    speechSynth.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stopSpeech]);

  const startLearning = () => {
    setShowIntro(false);
    setCurrentSection(0);
    setTimeout(() => {
      speakText(sections[0].voiceText);
    }, 300);
  };

  const handleNext = () => {
    stopSpeech();
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
    setShowFullAnswer(false);
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setTimeout(() => {
        speakText(sections[currentSection + 1].voiceText);
      }, 300);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
    setShowFullAnswer(false);
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setTimeout(() => {
        speakText(sections[currentSection - 1].voiceText);
      }, 300);
    }
  };

  const handleSectionChange = (index) => {
    stopSpeech();
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
    setShowFullAnswer(false);
    setCurrentSection(index);
    setTimeout(() => {
      speakText(sections[index].voiceText);
    }, 300);
  };

  const checkAnswer = () => {
    const userLower = userAnswer.trim().toLowerCase();
    const correctAnswer = sections[currentSection]?.answer?.toLowerCase() || "";
    const correctSolution = sections[currentSection]?.solution || "";
    return userLower === correctAnswer || userLower === correctSolution;
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (checkAnswer()) {
      setShowSolution(true);
      speakText(`Correct! ${sections[currentSection]?.explanation}`);
    } else {
      setShowHint(true);
      speakText(`Not quite. ${sections[currentSection]?.hint}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E2E8F0',
            borderTopColor: '#6366F1',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: '#64748B' }}>Loading Algebra Introduction...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Back Button */}
        <Link to="/topics/algebra" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6366F1',
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Back to Algebra
        </Link>

        {/* INTRO SCREEN */}
        {showIntro && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '48px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              width: isMobile ? '80px' : '100px',
              height: isMobile ? '80px' : '100px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '40px' : '50px',
              margin: '0 auto 24px'
            }}>
              🧮
            </div>
            <h1 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: '700',
              color: '#0F172A',
              marginBottom: '12px'
            }}>
              Introduction to Algebra
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Master the fundamentals of algebra with interactive lessons
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}>
              <span style={{ background: '#EEF2FF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#6366F1' }}>5 Lessons</span>
              <span style={{ background: '#EEF2FF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#6366F1' }}>~20 min</span>
              <span style={{ background: '#EEF2FF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#6366F1' }}>Beginner Friendly</span>
            </div>
            <button
              onClick={startLearning}
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '16px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Learning →
            </button>
          </div>
        )}

        {/* CONTENT SECTION */}
        {!showIntro && currentSection >= 0 && (
          <>
            {/* Progress Bar */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#64748B' }}>
                <span>📊 Lesson Progress</span>
                <span>{currentSection + 1} of {sections.length} • {Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
              </div>
              <div style={{
                width: '100%',
                background: '#E2E8F0',
                borderRadius: '9999px',
                height: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((currentSection + 1) / sections.length) * 100}%`,
                  background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                  height: '100%',
                  borderRadius: '9999px',
                  transition: 'width 0.5s'
                }}></div>
              </div>
            </div>

            {/* Main Card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '24px' : '32px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {sections[currentSection].icon}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A' }}>
                      {sections[currentSection].title}
                    </h2>
                    <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                      ⏱️ {sections[currentSection].duration}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => isPlaying ? stopSpeech() : speakText(sections[currentSection].voiceText)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: isPlaying ? '#EF4444' : '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <span>{isPlaying ? '🔊' : '🔈'}</span>
                  <span>{isPlaying ? 'Playing...' : 'Listen'}</span>
                </button>
              </div>

              {/* Key Points */}
              {sections[currentSection].keyPoints && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #E2E8F0'
                }}>
                  {sections[currentSection].keyPoints.map((point, idx) => (
                    <span key={idx} style={{
                      background: '#F1F5F9',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: '#475569'
                    }}>
                      📌 {point}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                lineHeight: '1.8',
                color: '#334155',
                whiteSpace: 'pre-line',
                fontSize: isMobile ? '14px' : '15px'
              }}>
                {sections[currentSection].content}
              </div>

              {/* Interactive Question Section */}
              {sections[currentSection].type === "interactive" && (
                <div style={{
                  background: '#EEF2FF',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>📝 Quick Check</h3>
                  <p style={{ color: '#4F46E5', marginBottom: '16px' }}>{sections[currentSection].question}</p>
                  
                  <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #C7D2FE',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#6366F1',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Check Answer
                    </button>
                  </form>

                  {showHint && (
                    <div style={{
                      background: '#FEF3C7',
                      borderRadius: '12px',
                      padding: '12px',
                      marginTop: '16px',
                      color: '#92400E',
                      fontSize: '13px'
                    }}>
                      💡 Hint: {sections[currentSection].hint}
                    </div>
                  )}

                  {showSolution && (
                    <div style={{
                      background: '#D1FAE5',
                      borderRadius: '12px',
                      padding: '12px',
                      marginTop: '16px',
                      color: '#065F46',
                      fontSize: '13px'
                    }}>
                      ✅ Correct! {sections[currentSection].explanation}
                    </div>
                  )}
                </div>
              )}

              {/* Problem Section */}
              {(sections[currentSection].type === "problem" || sections[currentSection].type === "practice") && (
                <div style={{
                  background: '#FEF3C7',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#D97706', marginBottom: '16px' }}>
                    {sections[currentSection].equation}
                  </div>
                  
                  {!showSolution && !showFullAnswer ? (
                    <button
                      onClick={() => {
                        if (sections[currentSection].type === "practice") {
                          setShowFullAnswer(true);
                        } else {
                          setShowSolution(true);
                        }
                        speakText(sections[currentSection].explanation);
                      }}
                      style={{
                        background: '#F59E0B',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      {sections[currentSection].button}
                    </button>
                  ) : (
                    <div>
                      <div style={{
                        background: '#FEF3C7',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '12px',
                        textAlign: 'left'
                      }}>
                        <p style={{ fontWeight: '600', marginBottom: '8px' }}>📖 Solution:</p>
                        <p style={{ color: '#92400E' }}>{sections[currentSection].explanation}</p>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '12px', textAlign: 'center' }}>
                          Answer: x = {sections[currentSection].solution}
                        </p>
                      </div>
                      <button
                        onClick={() => speakText(sections[currentSection].explanation)}
                        style={{
                          background: '#6366F1',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🔊 Hear Explanation Again
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '32px',
                gap: '12px'
              }}>
                <button
                  onClick={handlePrev}
                  disabled={currentSection === 0}
                  style={{
                    padding: '12px 24px',
                    background: currentSection === 0 ? '#F1F5F9' : 'white',
                    color: currentSection === 0 ? '#94A3B8' : '#64748B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  ← Previous
                </button>

                {currentSection === sections.length - 1 ? (
                  <Link to="/topics/algebra" style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    🎉 Complete Course →
                  </Link>
                ) : (
                  <button
                    onClick={handleNext}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Next Section →
                  </button>
                )}
              </div>
            </div>

            {/* Section Navigation Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionChange(index)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentSection ? '#6366F1' : '#E2E8F0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Completion Message */}
            {currentSection === sections.length - 1 && (
              <div style={{
                textAlign: 'center',
                marginTop: '16px',
                padding: '12px',
                background: '#D1FAE5',
                borderRadius: '12px'
              }}>
                <p style={{ fontSize: '13px', color: '#065F46' }}>
                  🎉 You've completed all sections! Click "Complete Course" to finish.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}