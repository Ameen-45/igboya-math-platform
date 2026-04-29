import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function AlgebraExamples() {
  const [currentExample, setCurrentExample] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const speechSynth = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const examples = [
    {
      title: "Zero Product Rule",
      type: "quadratic",
      equation: "(x-4)(x+9)=0",
      voiceText: "Zero Product Rule example. Equation: x minus four times x plus nine equals zero.",
      steps: [
        {
          title: "Understand the Rule",
          content: "This equation shows the product of two numbers equals zero. The Zero Product Rule says: if two numbers multiply to give 0, then at least one of them must be 0.",
          explanation: "That means either (x-4)=0 OR (x+9)=0",
          voiceText: "This equation shows the product of two numbers equals zero. The Zero Product Rule says: if two numbers multiply to give zero, then at least one of them must be zero. That means either x minus four equals zero or x plus nine equals zero."
        },
        {
          title: "Solve First Part",
          content: "For (x - 4) = 0",
          explanation: "Add 4 to both sides: x - 4 + 4 = 0 + 4 → x = 4",
          working: "x - 4 = 0\nx = 4",
          voiceText: "For x minus four equals zero. Add four to both sides. x minus four plus four equals zero plus four. Therefore x equals four."
        },
        {
          title: "Solve Second Part",
          content: "For (x + 9) = 0",
          explanation: "Subtract 9 from both sides: x + 9 - 9 = 0 - 9 → x = -9",
          working: "x + 9 = 0\nx = -9",
          voiceText: "For x plus nine equals zero. Subtract nine from both sides. x plus nine minus nine equals zero minus nine. Therefore x equals negative nine."
        },
        {
          title: "Final Answer",
          content: "Therefore, the solutions are:",
          explanation: "x = 4 or x = -9",
          voiceText: "Therefore, the solutions are x equals four or x equals negative nine.",
          interactive: {
            question: "What are the solutions to (x-4)(x+9)=0?",
            answer: "x=4 or x=-9",
            hint: "Remember the Zero Product Rule!",
            voiceText: "What are the solutions? Remember the Zero Product Rule."
          }
        }
      ],
      visualization: {
        table: {
          headers: ["x", "(x−4)", "(x+9)", "(x−4)(x+9)"],
          rows: [
            [-9, -13, 0, 0],
            [4, 0, 13, 0],
            [0, -4, 9, -36],
            [2, -2, 11, -22]
          ]
        }
      }
    },
    {
      title: "Standard Quadratic Equation",
      type: "quadratic",
      equation: "2x² + 13x = 15",
      voiceText: "Standard Quadratic Equation example. Two x squared plus thirteen x equals fifteen.",
      steps: [
        {
          title: "Step 1: Make One Side Zero",
          content: "Bring all terms to one side to set the equation to zero.",
          explanation: "Subtract 15 from both sides:\n2x² + 13x - 15 = 0",
          working: "2x² + 13x = 15\n2x² + 13x - 15 = 0",
          voiceText: "Step one. Bring all terms to one side to set the equation to zero. Subtract fifteen from both sides. Two x squared plus thirteen x minus fifteen equals zero."
        },
        {
          title: "Step 2: Factorize",
          content: "Find two numbers that multiply to (2 × -15) = -30 and add to 13.",
          explanation: "The numbers are 15 and -2\nSo we factorize as: (2x + 15)(x - 1) = 0",
          working: "2x² + 13x - 15 = 0\n(2x + 15)(x - 1) = 0",
          voiceText: "Step two. Factorize. Find two numbers that multiply to negative thirty and add to thirteen. The numbers are fifteen and negative two. So we factorize as two x plus fifteen times x minus one equals zero."
        },
        {
          title: "Step 3: Apply Zero Product Rule",
          content: "Set each factor equal to zero.",
          explanation: "2x + 15 = 0 OR x - 1 = 0",
          voiceText: "Step three. Apply Zero Product Rule. Set each factor equal to zero. Two x plus fifteen equals zero or x minus one equals zero."
        },
        {
          title: "Step 4: Solve Each Equation",
          content: "Solve for x in each case:",
          explanation: "From 2x + 15 = 0:\n2x = -15 → x = -15/2 = -7.5\n\nFrom x - 1 = 0:\nx = 1",
          working: "2x + 15 = 0 → x = -15/2\nx - 1 = 0 → x = 1",
          voiceText: "Step four. Solve each equation. From two x plus fifteen equals zero, two x equals negative fifteen, so x equals negative seven point five. From x minus one equals zero, x equals one."
        },
        {
          title: "Final Answer",
          content: "The solutions are:",
          explanation: "x = -7.5 or x = 1",
          voiceText: "Final answer. The solutions are x equals negative seven point five or x equals one.",
          interactive: {
            question: "Solve: 2x² + 13x = 15",
            answer: "x=-7.5 or x=1",
            hint: "Don't forget to set the equation to zero first!",
            voiceText: "Solve two x squared plus thirteen x equals fifteen. Don't forget to set the equation to zero first."
          }
        }
      ]
    },
    {
      title: "Square Root Method",
      type: "quadratic",
      equation: "(x+3)² = 7",
      voiceText: "Square Root Method example. Open parenthesis x plus three close parenthesis squared equals seven.",
      steps: [
        {
          title: "Step 1: Understand the Equation",
          content: "We have a squared quantity equal to a number.",
          explanation: "(x + 3)² = 7 means when we square (x + 3), we get 7.",
          voiceText: "Step one. Understand the equation. We have a squared quantity equal to a number. x plus three squared equals seven means when we square x plus three, we get seven."
        },
        {
          title: "Step 2: Take Square Root",
          content: "Take square root of both sides. Remember both positive and negative roots!",
          explanation: "√(x + 3)² = ±√7\nx + 3 = ±√7",
          working: "(x + 3)² = 7\nx + 3 = ±√7",
          voiceText: "Step two. Take square root of both sides. Remember both positive and negative roots. The square root of x plus three squared equals plus or minus square root of seven. So x plus three equals plus or minus square root of seven."
        },
        {
          title: "Step 3: Isolate x",
          content: "Solve for x by subtracting 3 from both sides.",
          explanation: "x = -3 ± √7",
          working: "x + 3 = ±√7\nx = -3 ± √7",
          voiceText: "Step three. Isolate x. Solve for x by subtracting three from both sides. x equals negative three plus or minus square root of seven."
        },
        {
          title: "Final Answer",
          content: "The exact solutions are:",
          explanation: "x = -3 + √7 or x = -3 - √7",
          voiceText: "Final answer. The exact solutions are x equals negative three plus square root of seven or x equals negative three minus square root of seven.",
          interactive: {
            question: "Solve: (x+3)² = 7",
            answer: "x=-3+√7 or x=-3-√7",
            hint: "Remember the ± symbol when taking square roots!",
            voiceText: "Solve x plus three squared equals seven. Remember the plus minus symbol when taking square roots."
          }
        }
      ]
    },
    {
      title: "Completing the Square",
      type: "completing-square",
      equation: "x² + 6x",
      voiceText: "Completing the Square example. x squared plus six x.",
      steps: [
        {
          title: "Step 1: Understand the Goal",
          content: "We want to add a number to make x² + 6x a perfect square.",
          explanation: "A perfect square looks like: (x + a)² = x² + 2ax + a²",
          voiceText: "Step one. Understand the goal. We want to add a number to make x squared plus six x a perfect square. A perfect square looks like x plus a squared equals x squared plus two a x plus a squared."
        },
        {
          title: "Step 2: Compare Coefficients",
          content: "Compare x² + 6x + k with (x + a)² = x² + 2ax + a²",
          explanation: "Coefficient of x: 6 = 2a → a = 3",
          voiceText: "Step two. Compare coefficients. Compare x squared plus six x plus k with x plus a squared. The coefficient of x is six equals two a, so a equals three."
        },
        {
          title: "Step 3: Find the Constant",
          content: "The constant term needed is a²",
          explanation: "a = 3, so k = a² = 3² = 9",
          working: "k = (6/2)² = 3² = 9",
          voiceText: "Step three. Find the constant. The constant term needed is a squared. a equals three, so k equals three squared equals nine."
        },
        {
          title: "Step 4: Write Perfect Square",
          content: "Add 9 to complete the square:",
          explanation: "x² + 6x + 9 = (x + 3)²",
          working: "x² + 6x + 9 = (x + 3)²",
          voiceText: "Step four. Write perfect square. Add nine to complete the square. x squared plus six x plus nine equals x plus three squared."
        },
        {
          title: "Practice Problem",
          content: "What should be added to d² - 5d to make it a perfect square?",
          explanation: "Use the formula: (b/2)² where b = -5\n(-5/2)² = 25/4",
          voiceText: "Practice problem. What should be added to d squared minus five d to make it a perfect square? Use the formula b over two squared where b equals negative five. Negative five over two squared equals twenty-five fourths.",
          interactive: {
            question: "Complete the square for d² - 5d",
            answer: "25/4",
            hint: "Use the formula: take half of the coefficient of d, then square it!",
            voiceText: "Complete the square for d squared minus five d. Take half of the coefficient of d, then square it."
          }
        }
      ]
    },
    {
      title: "Quadratic Formula",
      type: "formula",
      equation: "3x² - 5x - 7 = 0",
      voiceText: "Quadratic Formula example. Three x squared minus five x minus seven equals zero.",
      steps: [
        {
          title: "Step 1: Identify Coefficients",
          content: "Compare with standard form: ax² + bx + c = 0",
          explanation: "a = 3, b = -5, c = -7",
          voiceText: "Step one. Identify coefficients. Compare with standard form a x squared plus b x plus c equals zero. a equals three, b equals negative five, c equals negative seven."
        },
        {
          title: "Step 2: Write the Formula",
          content: "Quadratic formula:",
          explanation: "x = [-b ± √(b² - 4ac)] / 2a",
          voiceText: "Step two. Write the quadratic formula. x equals negative b plus or minus square root of b squared minus four a c, all over two a."
        },
        {
          title: "Step 3: Substitute Values",
          content: "Plug in the values:",
          explanation: "x = [5 ± √((-5)² - 4×3×(-7))] / (2×3)\n= [5 ± √(25 + 84)] / 6\n= [5 ± √109] / 6",
          working: "x = [5 ± √(25 + 84)] / 6\n= [5 ± √109] / 6",
          voiceText: "Step three. Substitute values. x equals five plus or minus square root of twenty-five plus eighty-four, all over six. This equals five plus or minus square root of one hundred nine, over six."
        },
        {
          title: "Step 4: Calculate Roots",
          content: "Simplify the expression:",
          explanation: "√109 ≈ 10.44\nSo: x ≈ (5 + 10.44)/6 ≈ 2.57\nor x ≈ (5 - 10.44)/6 ≈ -0.91",
          working: "x ≈ 15.44/6 ≈ 2.57\nx ≈ -5.44/6 ≈ -0.91",
          voiceText: "Step four. Calculate roots. Square root of one hundred nine is approximately ten point four four. So x equals five plus ten point four four over six, approximately two point five seven. Or x equals five minus ten point four four over six, approximately negative zero point nine one."
        },
        {
          title: "Final Answer",
          content: "Rounded to 2 decimal places:",
          explanation: "x = 2.57 or x = -0.91",
          voiceText: "Final answer rounded to two decimal places. x equals two point five seven or x equals negative zero point nine one."
        }
      ]
    },
    {
      title: "Word Problems - Number Puzzle",
      type: "word-problem",
      problem: "Find two numbers whose difference is 5 and product is 266",
      voiceText: "Word problem. Find two numbers whose difference is five and product is two hundred sixty-six.",
      steps: [
        {
          title: "Step 1: Define Variables",
          content: "Let the smaller number be x",
          explanation: "Then larger number = x + 5 (since difference is 5)",
          voiceText: "Step one. Define variables. Let the smaller number be x. Then larger number equals x plus five since difference is five."
        },
        {
          title: "Step 2: Write Equation",
          content: "Their product is 266:",
          explanation: "x(x + 5) = 266",
          voiceText: "Step two. Write equation. Their product is two hundred sixty-six. x times x plus five equals two hundred sixty-six."
        },
        {
          title: "Step 3: Expand and Rearrange",
          content: "Expand and set to zero:",
          explanation: "x² + 5x = 266\nx² + 5x - 266 = 0",
          working: "x(x + 5) = 266\nx² + 5x - 266 = 0",
          voiceText: "Step three. Expand and rearrange. x squared plus five x equals two hundred sixty-six. x squared plus five x minus two hundred sixty-six equals zero."
        },
        {
          title: "Step 4: Factorize",
          content: "Find factors of -266 that add to 5:",
          explanation: "Numbers are 19 and -14\n(x - 14)(x + 19) = 0",
          working: "x² + 5x - 266 = (x - 14)(x + 19)",
          voiceText: "Step four. Factorize. Find factors of negative two hundred sixty-six that add to five. Numbers are nineteen and negative fourteen. So x minus fourteen times x plus nineteen equals zero."
        },
        {
          title: "Step 5: Solve",
          content: "Set each factor to zero:",
          explanation: "x - 14 = 0 → x = 14\nx + 19 = 0 → x = -19",
          voiceText: "Step five. Solve. Set each factor to zero. x minus fourteen equals zero gives x equals fourteen. x plus nineteen equals zero gives x equals negative nineteen."
        },
        {
          title: "Step 6: Find Number Pairs",
          content: "For each x, find the corresponding larger number:",
          explanation: "If x = 14, larger = 19 → (14, 19)\nIf x = -19, larger = -14 → (-19, -14)",
          voiceText: "Step six. Find number pairs. If x equals fourteen, larger equals nineteen, giving the pair fourteen and nineteen. If x equals negative nineteen, larger equals negative fourteen, giving the pair negative nineteen and negative fourteen."
        },
        {
          title: "Step 7: Verify",
          content: "Check the products:",
          explanation: "14 × 19 = 266 ✓\n-19 × -14 = 266 ✓",
          voiceText: "Step seven. Verify. Fourteen times nineteen equals two hundred sixty-six. Negative nineteen times negative fourteen also equals two hundred sixty-six. Both pairs work."
        }
      ]
    },
    {
      title: "Word Problems - Age Puzzle",
      type: "word-problem",
      problem: "A woman is 4 times older than her child. 5 years ago, product of their ages was 175. Find present ages.",
      voiceText: "Word problem. A woman is four times older than her child. Five years ago, product of their ages was one hundred seventy-five. Find present ages.",
      steps: [
        {
          title: "Step 1: Define Variables",
          content: "Let child's present age = x",
          explanation: "Then mother's present age = 4x",
          voiceText: "Step one. Define variables. Let child's present age be x. Then mother's present age equals four x."
        },
        {
          title: "Step 2: Ages 5 Years Ago",
          content: "Five years ago:",
          explanation: "Child's age = x - 5\nMother's age = 4x - 5",
          voiceText: "Step two. Ages five years ago. Child's age was x minus five. Mother's age was four x minus five."
        },
        {
          title: "Step 3: Write Equation",
          content: "Product of ages 5 years ago was 175:",
          explanation: "(x - 5)(4x - 5) = 175",
          voiceText: "Step three. Write equation. Product of ages five years ago was one hundred seventy-five. x minus five times four x minus five equals one hundred seventy-five."
        },
        {
          title: "Step 4: Expand and Simplify",
          content: "Expand and bring all terms to one side:",
          explanation: "4x² - 25x + 25 = 175\n4x² - 25x - 150 = 0",
          working: "(x-5)(4x-5) = 175\n4x² - 25x + 25 = 175\n4x² - 25x - 150 = 0",
          voiceText: "Step four. Expand and simplify. Expand to get four x squared minus twenty-five x plus twenty-five equals one hundred seventy-five. Subtract one hundred seventy-five from both sides to get four x squared minus twenty-five x minus one hundred fifty equals zero."
        },
        {
          title: "Step 5: Factorize",
          content: "Factor the quadratic:",
          explanation: "(4x + 15)(x - 10) = 0",
          working: "4x² - 25x - 150 = (4x + 15)(x - 10)",
          voiceText: "Step five. Factorize. The quadratic factors as four x plus fifteen times x minus ten equals zero."
        },
        {
          title: "Step 6: Solve",
          content: "Set each factor to zero:",
          explanation: "x - 10 = 0 → x = 10\n4x + 15 = 0 → x = -15/4",
          voiceText: "Step six. Solve. x minus ten equals zero gives x equals ten. Four x plus fifteen equals zero gives x equals negative fifteen fourths."
        },
        {
          title: "Step 7: Reject Invalid Solution",
          content: "Age cannot be negative:",
          explanation: "x = -15/4 is invalid\nSo x = 10",
          voiceText: "Step seven. Reject invalid solution. Age cannot be negative, so x equals negative fifteen fourths is invalid. Therefore x equals ten."
        },
        {
          title: "Step 8: Find Ages",
          content: "Present ages:",
          explanation: "Child: 10 years\nMother: 4 × 10 = 40 years",
          voiceText: "Step eight. Find ages. Child is ten years old. Mother is four times ten equals forty years old."
        }
      ]
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

  const nextStep = () => {
    stopSpeech()
    if (currentStep < examples[currentExample].steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      // Auto-read next step
      setTimeout(() => {
        const nextStepData = examples[currentExample].steps[currentStep + 1]
        if (nextStepData) {
          speakText(nextStepData.voiceText || `${nextStepData.title}. ${nextStepData.content} ${nextStepData.explanation || ''}`)
        }
      }, 200)
    }
  }

  const prevStep = () => {
    stopSpeech()
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      // Auto-read previous step
      setTimeout(() => {
        const prevStepData = examples[currentExample].steps[currentStep - 1]
        if (prevStepData) {
          speakText(prevStepData.voiceText || `${prevStepData.title}. ${prevStepData.content} ${prevStepData.explanation || ''}`)
        }
      }, 200)
    }
  }

  const checkAnswer = () => {
    const currentInteractive = examples[currentExample].steps[currentStep]?.interactive
    if (!currentInteractive) return
    
    const normalizedInput = userInput.trim().toLowerCase()
    const normalizedAnswer = currentInteractive.answer.toLowerCase()
    const isAnswerCorrect = normalizedInput === normalizedAnswer
    
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect) {
      speakText(`Correct! ${currentInteractive.answer} is right. Well done!`)
    } else {
      speakText(`Not quite. ${currentInteractive.hint}`)
    }
  }

  const handleExampleChange = (index) => {
    stopSpeech()
    setCurrentExample(index)
    setCurrentStep(0)
    setUserInput('')
    setShowHint(false)
    setIsCorrect(null)
    // Auto-read new example title
    setTimeout(() => {
      speakText(`${examples[index].title}. ${examples[index].voiceText || examples[index].equation || examples[index].problem}`)
    }, 200)
  }

  useEffect(() => {
    // Auto-read first example on load
    setTimeout(() => {
      speakText(`${examples[0].title}. ${examples[0].voiceText || examples[0].equation}`)
    }, 500)
    return () => stopSpeech()
  }, [])

  const currentExampleData = examples[currentExample]
  const currentStepData = currentExampleData.steps[currentStep]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link 
            to="/topics/algebra" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6366F1',
              textDecoration: 'none',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            ← Back to Algebra Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Algebra Examples & Practice
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Step-by-step interactive examples to master quadratic equations and word problems
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          
          {/* Sidebar - Example List */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: isMobile ? '16px' : '20px',
              border: '1px solid #E2E8F0',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>Examples</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleChange(index)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: isMobile ? '12px' : '14px',
                      borderRadius: '14px',
                      border: currentExample === index ? '2px solid #6366F1' : '1px solid #E2E8F0',
                      background: currentExample === index ? '#EEF2FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '10px',
                        background: currentExample === index ? '#6366F1' : '#E2E8F0',
                        color: currentExample === index ? 'white' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: currentExample === index ? '#6366F1' : '#0F172A' }}>
                          {example.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {example.steps.length} steps
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 3 }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '20px' : '28px',
              border: '1px solid #E2E8F0'
            }}>
              
              {/* Example Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                    {currentExampleData.title}
                  </h2>
                  <div style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontFamily: 'monospace',
                    color: '#6366F1',
                    fontWeight: '600'
                  }}>
                    {currentExampleData.equation || currentExampleData.problem}
                  </div>
                </div>
                
                <button 
                  onClick={() => speakText(currentStepData.voiceText || `${currentStepData.title}. ${currentStepData.content} ${currentStepData.explanation || ''}`)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: isPlaying ? '#EF4444' : '#10B981',
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

              {/* Progress */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                  <span>Step {currentStep + 1} of {currentExampleData.steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / currentExampleData.steps.length) * 100)}%</span>
                </div>
                <div style={{
                  width: '100%',
                  background: '#E2E8F0',
                  borderRadius: '9999px',
                  height: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((currentStep + 1) / currentExampleData.steps.length) * 100}%`,
                    background: 'linear-gradient(90deg, #10B981, #6366F1)',
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.5s'
                  }}></div>
                </div>
              </div>

              {/* Current Step Content */}
              <div>
                {/* Step Title and Content */}
                <div style={{
                  background: '#EEF2FF',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px',
                  borderLeft: '4px solid #6366F1'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                    {currentStepData.title}
                  </h3>
                  <p style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {currentStepData.content}
                  </p>
                </div>

                {/* Explanation */}
                {currentStepData.explanation && (
                  <div style={{
                    background: '#DCFCE7',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #10B981'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>Explanation:</h4>
                    <p style={{ color: '#14532D', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {currentStepData.explanation}
                    </p>
                  </div>
                )}

                {/* Working */}
                {currentStepData.working && (
                  <div style={{
                    background: '#F3E8FF',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #8B5CF6'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#5B21B6', marginBottom: '8px' }}>Working:</h4>
                    <pre style={{
                      color: '#4C1D95',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      whiteSpace: 'pre-wrap',
                      margin: 0
                    }}>
                      {currentStepData.working}
                    </pre>
                  </div>
                )}

                {/* Visualization Table */}
                {currentExample === 0 && currentStep === 3 && currentExampleData.visualization?.table && (
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #F59E0B'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>Visualization:</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#FDE68A' }}>
                            {currentExampleData.visualization.table.headers.map((header, idx) => (
                              <th key={idx} style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #F59E0B' }}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentExampleData.visualization.table.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} style={{ background: rowIdx % 2 === 0 ? 'white' : '#FEF3C7' }}>
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} style={{
                                  padding: '8px',
                                  borderBottom: '1px solid #FDE68A',
                                  fontWeight: cell === 0 ? 'bold' : 'normal',
                                  color: cell === 0 ? '#10B981' : '#334155'
                                }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p style={{ fontSize: '12px', color: '#92400E', marginTop: '12px' }}>
                      Notice: Only when x = -9 or x = 4 does the product become zero!
                    </p>
                  </div>
                )}

                {/* Interactive Question */}
                {currentStepData.interactive && (
                  <div style={{
                    background: '#FEF3C7',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #F59E0B'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
                      Your Turn! 💡
                    </h4>
                    <p style={{ color: '#92400E', marginBottom: '16px' }}>
                      {currentStepData.interactive.question}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your answer here..."
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #FDE68A',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#FDE68A'}
                      />
                      
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={checkAnswer}
                          style={{
                            padding: '8px 20px',
                            background: '#F59E0B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '13px'
                          }}
                        >
                          Check Answer
                        </button>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          style={{
                            padding: '8px 20px',
                            background: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #FDE68A',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '13px'
                          }}
                        >
                          {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                      </div>

                      {showHint && (
                        <div style={{
                          background: '#FEF3C7',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #FDE68A'
                        }}>
                          <p style={{ fontSize: '13px', color: '#92400E' }}>💡 {currentStepData.interactive.hint}</p>
                        </div>
                      )}

                      {isCorrect !== null && (
                        <div style={{
                          padding: '12px',
                          borderRadius: '10px',
                          background: isCorrect ? '#D1FAE5' : '#FEE2E2',
                          border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`
                        }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: isCorrect ? '#065F46' : '#991B1B' }}>
                            {isCorrect ? '✅ Correct! Well done!' : '❌ Not quite. Try again!'}
                          </p>
                          {!isCorrect && (
                            <p style={{ fontSize: '12px', marginTop: '4px', color: '#991B1B' }}>
                              Hint: {currentStepData.interactive.answer}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Motivational Messages */}
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  {currentStep === currentExampleData.steps.length - 1 ? (
                    <div style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      borderRadius: '16px',
                      padding: '16px',
                      color: 'white'
                    }}>
                      <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>🎉 Amazing! You completed this example!</p>
                      <p style={{ fontSize: '13px', opacity: 0.9 }}>Ready to try another one?</p>
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#64748B', fontStyle: 'italic' }}>
                      {currentStep === 0 ? "Ready to begin our mathematical journey? 🚀" :
                       currentStep < currentExampleData.steps.length - 2 ? "Great progress! Keep going! 💪" :
                       "Almost there! You're doing fantastic! 🌟"}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #E2E8F0',
                gap: '12px'
              }}>
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: currentStep === 0 ? '#F1F5F9' : 'white',
                    color: currentStep === 0 ? '#94A3B8' : '#64748B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>

                <button
                  onClick={nextStep}
                  disabled={currentStep === currentExampleData.steps.length - 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: currentStep === currentExampleData.steps.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #10B981, #059669)',
                    color: currentStep === currentExampleData.steps.length - 1 ? '#94A3B8' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: currentStep === currentExampleData.steps.length - 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Example Navigation Dots */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              {currentExampleData.steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentStep(index)
                    setUserInput('')
                    setShowHint(false)
                    setIsCorrect(null)
                    speakText(currentExampleData.steps[index].voiceText || `${currentExampleData.steps[index].title}`)
                  }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentStep ? '#6366F1' : index < currentStep ? '#10B981' : '#E2E8F0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}