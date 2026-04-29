import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

export default function CalculusIntroduction() {
  const [currentSection, setCurrentSection] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const speechSynth = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      title: "Welcome to Calculus! 🚀",
      content: `Calculus is the mathematics of change and motion. It's used everywhere - from predicting weather patterns to designing spacecraft, from optimizing business profits to understanding how diseases spread.

In this course, you'll learn:
• Limits - Understanding what happens as we approach a value
• Derivatives - The mathematics of rates of change
• Applications of Derivatives - Optimization and curve sketching
• Integrals - The mathematics of accumulation

Calculus opens doors to advanced physics, engineering, economics, and data science. Ready to begin your journey into the mathematics of change? Let's dive in!`,
      voiceText: `Welcome to Calculus! Calculus is the mathematics of change and motion. It's used everywhere from predicting weather patterns to designing spacecraft, from optimizing business profits to understanding how diseases spread. In this course, you'll learn limits, derivatives, applications of derivatives, and integrals. Calculus opens doors to advanced physics, engineering, economics, and data science. Ready to begin your journey into the mathematics of change? Let's dive in!`,
      type: "welcome",
      button: "Let's Begin!",
      icon: "🚀",
      duration: "4 min",
      keyPoints: ["Limits", "Derivatives", "Applications", "Integrals"]
    },
    {
      title: "What is a Limit? 🔍",
      content: `The concept of a limit is the foundation of calculus. A limit describes what happens to a function as the input approaches a certain value.

Think of it like this: As you walk closer to a wall, you get closer and closer to touching it. The limit is the value you approach, even if you never quite reach it.

Example: Consider f(x) = (x² - 1)/(x - 1)
As x approaches 1, what happens to f(x)?

Let's calculate:
x = 0.9 → f(0.9) = 1.9
x = 0.99 → f(0.99) = 1.99
x = 1.01 → f(1.01) = 2.01
x = 1.1 → f(1.1) = 2.1

As x gets closer to 1, f(x) gets closer to 2. So we say the limit as x approaches 1 is 2.

Notation: lim(x→1) f(x) = 2`,
      voiceText: `The concept of a limit is the foundation of calculus. A limit describes what happens to a function as the input approaches a certain value. Think of it like this: As you walk closer to a wall, you get closer and closer to touching it. The limit is the value you approach, even if you never quite reach it. For example, consider f of x equals x squared minus one over x minus one. As x approaches one, f of x approaches two. So we say the limit as x approaches one is two.`,
      type: "concept",
      button: "Continue",
      icon: "🔍",
      duration: "5 min",
      keyPoints: ["Limits describe approach", "Value may never be reached", "Foundation of calculus"]
    },
    {
      title: "The Derivative 📈",
      content: `The derivative measures the instantaneous rate of change of a function. It's like calculating speed at an exact moment, not just average speed over time.

Real-world analogy: Your car's speedometer shows the derivative of your position - how fast you're going right now, not just your average speed for the whole trip.

Definition: The derivative of f(x) is:
f'(x) = lim(h→0) [f(x + h) - f(x)] / h

Example: Let's find the derivative of f(x) = x²

f'(x) = lim(h→0) [(x + h)² - x²] / h
= lim(h→0) [x² + 2xh + h² - x²] / h
= lim(h→0) [2xh + h²] / h
= lim(h→0) [2x + h]
= 2x

So the derivative of x² is 2x!`,
      voiceText: `The derivative measures the instantaneous rate of change of a function. It's like calculating speed at an exact moment, not just average speed over time. Your car's speedometer shows the derivative of your position. The definition of derivative is the limit as h approaches zero of f of x plus h minus f of x over h. For example, the derivative of x squared is 2x.`,
      type: "concept",
      button: "Continue",
      icon: "📈",
      duration: "6 min",
      keyPoints: ["Rate of change", "Instantaneous vs average", "Power rule: derivative of xⁿ is nxⁿ⁻¹"]
    },
    {
      title: "Power Rule Practice 📝",
      content: `The Power Rule is one of the most important derivative rules:

For f(x) = xⁿ, the derivative is f'(x) = n·xⁿ⁻¹

Examples:
• f(x) = x⁵ → f'(x) = 5x⁴
• f(x) = x³ → f'(x) = 3x²
• f(x) = x → f'(x) = 1 (since x¹, n=1 gives 1·x⁰ = 1)
• f(x) = 7 (constant) → f'(x) = 0

Let's practice! Find the derivative of f(x) = x⁴`,
      voiceText: `The Power Rule is one of the most important derivative rules. For f of x equals x to the n, the derivative is n times x to the n minus one. For example, derivative of x to the fifth is five x to the fourth. Derivative of x cubed is three x squared. Derivative of x is one. The derivative of a constant is zero.`,
      type: "interactive",
      question: "Find the derivative of f(x) = x⁴",
      answer: "4x^3",
      hint: "Apply the power rule: multiply by the exponent, then subtract 1 from the exponent",
      explanation: "Using the power rule: derivative of x⁴ = 4·x⁴⁻¹ = 4x³",
      button: "Check Answer",
      icon: "📝",
      duration: "4 min",
      keyPoints: ["Multiply by exponent", "Subtract 1 from exponent", "Derivative of constant is 0"]
    },
    {
      title: "What is an Integral? 📊",
      content: `While derivatives find rates of change, integrals find accumulation. Integration is the reverse process of differentiation.

Think of it like this:
• Derivative: How fast are you traveling right now?
• Integral: How far have you traveled total?

Notation: ∫ f(x) dx represents the integral of f(x)

Example: ∫ x² dx = (x³)/3 + C

The +C is the constant of integration - there are infinitely many functions that have the same derivative (differing by a constant).`,
      voiceText: `While derivatives find rates of change, integrals find accumulation. Integration is the reverse process of differentiation. Think of it like this: derivatives ask how fast are you traveling right now, while integrals ask how far have you traveled total. The integral of x squared dx is x cubed over three plus C. The plus C is the constant of integration.`,
      type: "concept",
      button: "Continue",
      icon: "📊",
      duration: "5 min",
      keyPoints: ["Integration accumulates", "Reverse of differentiation", "Add constant of integration"]
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
    setCurrentSection(index);
    setTimeout(() => {
      speakText(sections[index].voiceText);
    }, 300);
  };

  const checkAnswer = () => {
    const userLower = userAnswer.trim().toLowerCase().replace(/\s/g, '');
    const correctAnswer = sections[currentSection]?.answer?.toLowerCase().replace(/\s/g, '') || "";
    const isAnswerCorrect = userLower === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setShowSolution(true);
      speakText(`Correct! ${sections[currentSection]?.explanation}`);
    } else {
      setShowHint(true);
      speakText(`Not quite. ${sections[currentSection]?.hint}`);
    }
  };

  const [isCorrect, setIsCorrect] = useState(null);

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
            borderTopColor: '#EF4444',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: '#64748B' }}>Loading Calculus Introduction...</p>
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
        <Link to="/topics/calculus" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#EF4444',
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Back to Calculus
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
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '40px' : '50px',
              margin: '0 auto 24px'
            }}>
              📈
            </div>
            <h1 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #EF4444, #DC2626, #B91C1C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px'
            }}>
              Introduction to Calculus
            </h1>
            <p style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#64748B',
              marginBottom: '16px'
            }}>
              Master the mathematics of change and motion
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}>
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>5 Lessons</span>
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>~24 min</span>
              <span style={{ background: '#FEE2E2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#DC2626' }}>Intermediate</span>
            </div>
            <button
              onClick={startLearning}
              style={{
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
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
                  background: 'linear-gradient(90deg, #EF4444, #DC2626)',
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
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white'
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
                      background: '#FEE2E2',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: '#DC2626',
                      fontWeight: '500'
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
                  background: '#FEE2E2',
                  borderRadius: '16px',
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#991B1B', marginBottom: '12px' }}>📝 Quick Check</h3>
                  <p style={{ color: '#DC2626', marginBottom: '16px' }}>{sections[currentSection].question}</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #FECACA',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#DC2626',
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
                  <Link to="/topics/calculus" style={{
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
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
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
                    background: index === currentSection ? '#EF4444' : '#E2E8F0',
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