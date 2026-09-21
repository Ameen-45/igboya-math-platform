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
  const speakTimer = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ============================================================
     NORMALIZE ANSWER — accepts spaces, commas, "or", "and"
     ============================================================ */
  const normalizeAnswer = (str) => {
    if (!str) return ''
    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[×*]/g, '')
      .replace(/,/g, 'or')
      .replace(/and/g, 'or')
      .replace(/=/g, '=')
  }

  const answersMatch = (userAns, correctAns) => {
    const u = normalizeAnswer(userAns)
    const c = normalizeAnswer(correctAns)

    if (u === c) return true

    // Split on 'or' and compare sets
    const uParts = u.split('or').filter(Boolean).sort()
    const cParts = c.split('or').filter(Boolean).sort()

    if (uParts.length === cParts.length && uParts.every((p, i) => p === cParts[i])) {
      return true
    }

    return false
  }

  /* ============================================================
     EXAMPLES — All math verified
     ============================================================ */
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
          voiceText: "For x minus four equals zero. Add four to both sides. x equals four."
        },
        {
          title: "Solve Second Part",
          content: "For (x + 9) = 0",
          explanation: "Subtract 9 from both sides: x + 9 - 9 = 0 - 9 → x = -9",
          working: "x + 9 = 0\nx = -9",
          voiceText: "For x plus nine equals zero. Subtract nine from both sides. x equals negative nine."
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
          voiceText: "Step three. Apply Zero Product Rule. Two x plus fifteen equals zero or x minus one equals zero."
        },
        {
          title: "Step 4: Solve Each Equation",
          content: "Solve for x in each case:",
          explanation: "From 2x + 15 = 0:\n2x = -15 → x = -15/2 = -7.5\n\nFrom x - 1 = 0:\nx = 1",
          working: "2x + 15 = 0 → x = -15/2\nx - 1 = 0 → x = 1",
          voiceText: "Step four. Solve each equation. From two x plus fifteen equals zero, x equals negative seven point five. From x minus one equals zero, x equals one."
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
          voiceText: "Step one. We have a squared quantity equal to a number."
        },
        {
          title: "Step 2: Take Square Root",
          content: "Take square root of both sides. Remember both positive and negative roots!",
          explanation: "√(x + 3)² = ±√7\nx + 3 = ±√7",
          working: "(x + 3)² = 7\nx + 3 = ±√7",
          voiceText: "Step two. Take square root of both sides. Remember both positive and negative roots. So x plus three equals plus or minus square root of seven."
        },
        {
          title: "Step 3: Isolate x",
          content: "Solve for x by subtracting 3 from both sides.",
          explanation: "x = -3 ± √7",
          working: "x + 3 = ±√7\nx = -3 ± √7",
          voiceText: "Step three. Isolate x. Subtract three from both sides. x equals negative three plus or minus square root of seven."
        },
        {
          title: "Final Answer",
          content: "The exact solutions are:",
          explanation: "x = -3 + √7 or x = -3 - √7",
          voiceText: "Final answer. x equals negative three plus square root of seven or x equals negative three minus square root of seven.",
          interactive: {
            question: "Solve: (x+3)² = 7",
            answer: "x=-3+√7 or x=-3-√7",
            hint: "Remember the ± symbol when taking square roots!",
            voiceText: "Solve x plus three squared equals seven."
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
          voiceText: "Step one. We want to add a number to make x squared plus six x a perfect square."
        },
        {
          title: "Step 2: Compare Coefficients",
          content: "Compare x² + 6x + k with (x + a)² = x² + 2ax + a²",
          explanation: "Coefficient of x: 6 = 2a → a = 3",
          voiceText: "Step two. Compare coefficients. Six equals two a, so a equals three."
        },
        {
          title: "Step 3: Find the Constant",
          content: "The constant term needed is a²",
          explanation: "a = 3, so k = a² = 3² = 9",
          working: "k = (6/2)² = 3² = 9",
          voiceText: "Step three. The constant is a squared. a equals three, so k equals nine."
        },
        {
          title: "Step 4: Write Perfect Square",
          content: "Add 9 to complete the square:",
          explanation: "x² + 6x + 9 = (x + 3)²",
          working: "x² + 6x + 9 = (x + 3)²",
          voiceText: "Step four. Add nine. x squared plus six x plus nine equals x plus three squared."
        },
        {
          title: "Practice Problem",
          content: "What should be added to d² - 5d to make it a perfect square?",
          explanation: "Use the formula: (b/2)² where b = -5\n(-5/2)² = 25/4",
          voiceText: "Practice problem. What should be added to d squared minus five d?",
          interactive: {
            question: "Complete the square for d² - 5d",
            answer: "25/4",
            hint: "Take half of the coefficient of d, then square it!",
            voiceText: "Complete the square for d squared minus five d."
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
          voiceText: "Step one. Compare with standard form. a equals three, b equals negative five, c equals negative seven."
        },
        {
          title: "Step 2: Write the Formula",
          content: "Quadratic formula:",
          explanation: "x = [-b ± √(b² - 4ac)] / 2a",
          voiceText: "Step two. The quadratic formula is x equals negative b plus or minus square root of b squared minus four a c, over two a."
        },
        {
          title: "Step 3: Substitute Values",
          content: "Plug in the values:",
          explanation: "x = [5 ± √((-5)² - 4×3×(-7))] / (2×3)\n= [5 ± √(25 + 84)] / 6\n= [5 ± √109] / 6",
          working: "x = [5 ± √(25 + 84)] / 6\n= [5 ± √109] / 6",
          voiceText: "Step three. Substitute values."
        },
        {
          title: "Step 4: Calculate Roots",
          content: "Simplify the expression:",
          explanation: "√109 ≈ 10.44\nSo: x ≈ (5 + 10.44)/6 ≈ 2.57\nor x ≈ (5 - 10.44)/6 ≈ -0.91",
          working: "x ≈ 15.44/6 ≈ 2.57\nx ≈ -5.44/6 ≈ -0.91",
          voiceText: "Step four. Square root of one hundred nine is approximately ten point four four."
        },
        {
          title: "Final Answer",
          content: "Rounded to 2 decimal places:",
          explanation: "x = 2.57 or x = -0.91",
          voiceText: "Final answer. x equals two point five seven or x equals negative zero point nine one."
        }
      ]
    },
    {
      title: "Word Problem: Sum and Product",
      type: "word-problem",
      problem: "The sum of two numbers is 20. Their product is 96. Find the two numbers.",
      voiceText: "Word problem. The sum of two numbers is twenty. Their product is ninety-six. Find the two numbers.",
      steps: [
        {
          title: "Step 1: Define the Variables",
          content: "Let the smaller number be x.",
          explanation: "Since the sum is 20, the larger number is (20 - x).",
          voiceText: "Step one. Let the smaller number be x. Since the sum is twenty, the larger number is twenty minus x."
        },
        {
          title: "Step 2: Write the Equation",
          content: "Their product is 96:",
          explanation: "x(20 - x) = 96",
          voiceText: "Step two. Their product is ninety-six. x times twenty minus x equals ninety-six."
        },
        {
          title: "Step 3: Expand and Rearrange",
          content: "Expand and set to zero:",
          explanation: "20x - x² = 96\nx² - 20x + 96 = 0",
          working: "x(20 - x) = 96\n20x - x² = 96\nx² - 20x + 96 = 0",
          voiceText: "Step three. Expand and rearrange. x squared minus twenty x plus ninety-six equals zero."
        },
        {
          title: "Step 4: Factorize",
          content: "Find factors of 96 that add to -20:",
          explanation: "The numbers are -8 and -12\n(x - 8)(x - 12) = 0",
          working: "x² - 20x + 96 = (x - 8)(x - 12)",
          voiceText: "Step four. Factorize. x minus eight times x minus twelve equals zero."
        },
        {
          title: "Step 5: Solve",
          content: "Set each factor to zero:",
          explanation: "x - 8 = 0 → x = 8\nx - 12 = 0 → x = 12",
          voiceText: "Step five. x equals eight or x equals twelve."
        },
        {
          title: "Step 6: Find the Two Numbers",
          content: "The two numbers are:",
          explanation: "When x = 8, the other is 12\nWhen x = 12, the other is 8\nSo the numbers are 8 and 12.",
          voiceText: "The two numbers are eight and twelve."
        },
        {
          title: "Step 7: Verify",
          content: "Check the answer:",
          explanation: "8 + 12 = 20 ✓\n8 × 12 = 96 ✓",
          voiceText: "Verify. Eight plus twelve equals twenty. Eight times twelve equals ninety-six. Correct."
        }
      ]
    },
    {
      title: "Word Problem: Age Puzzle",
      type: "word-problem",
      problem: "A father is 3 times as old as his son. In 10 years, the sum of their ages will be 60. Find their present ages.",
      voiceText: "Word problem. A father is three times as old as his son. In ten years, the sum of their ages will be sixty. Find their present ages.",
      steps: [
        {
          title: "Step 1: Define the Variables",
          content: "Let the son's present age be x.",
          explanation: "Then the father's present age = 3x (three times as old)",
          voiceText: "Step one. Let the son's present age be x. The father is three x."
        },
        {
          title: "Step 2: Ages in 10 Years",
          content: "In 10 years:",
          explanation: "Son's age = x + 10\nFather's age = 3x + 10",
          voiceText: "Step two. In ten years, son is x plus ten, father is three x plus ten."
        },
        {
          title: "Step 3: Write the Equation",
          content: "The sum of their ages will be 60:",
          explanation: "(x + 10) + (3x + 10) = 60",
          voiceText: "Step three. The sum is sixty. x plus ten plus three x plus ten equals sixty."
        },
        {
          title: "Step 4: Simplify and Solve",
          content: "Combine like terms:",
          explanation: "4x + 20 = 60\n4x = 40\nx = 10",
          working: "4x + 20 = 60\n4x = 40\nx = 10",
          voiceText: "Step four. Four x plus twenty equals sixty. Four x equals forty. x equals ten."
        },
        {
          title: "Step 5: Find the Ages",
          content: "Present ages:",
          explanation: "Son = x = 10 years\nFather = 3x = 30 years",
          voiceText: "Step five. Son is ten years old. Father is thirty years old."
        },
        {
          title: "Step 6: Verify",
          content: "Check the answer:",
          explanation: "In 10 years:\nSon = 20, Father = 40\n20 + 40 = 60 ✓",
          voiceText: "Verify. In ten years, twenty plus forty equals sixty. Correct."
        }
      ]
    },
    {
      title: "Word Problem: Rectangle",
      type: "word-problem",
      problem: "The length of a rectangle is 4 cm more than its width. The area is 96 cm². Find the dimensions.",
      voiceText: "Word problem. The length of a rectangle is four centimeters more than its width. The area is ninety-six square centimeters. Find the dimensions.",
      steps: [
        {
          title: "Step 1: Define the Variables",
          content: "Let the width be x cm.",
          explanation: "Then the length = (x + 4) cm",
          voiceText: "Step one. Let the width be x. The length is x plus four."
        },
        {
          title: "Step 2: Write the Equation",
          content: "Area = length × width = 96:",
          explanation: "x(x + 4) = 96",
          voiceText: "Step two. x times x plus four equals ninety-six."
        },
        {
          title: "Step 3: Expand and Rearrange",
          content: "Expand and set to zero:",
          explanation: "x² + 4x = 96\nx² + 4x - 96 = 0",
          working: "x(x + 4) = 96\nx² + 4x - 96 = 0",
          voiceText: "Step three. x squared plus four x minus ninety-six equals zero."
        },
        {
          title: "Step 4: Factorize",
          content: "Find factors of -96 that add to 4:",
          explanation: "The numbers are 12 and -8\n(x + 12)(x - 8) = 0",
          working: "x² + 4x - 96 = (x + 12)(x - 8)",
          voiceText: "Step four. Factorize as x plus twelve times x minus eight equals zero."
        },
        {
          title: "Step 5: Solve",
          content: "Set each factor to zero:",
          explanation: "x + 12 = 0 → x = -12 (invalid, width can't be negative)\nx - 8 = 0 → x = 8",
          voiceText: "Step five. x equals eight. The negative twelve is invalid."
        },
        {
          title: "Step 6: Find the Dimensions",
          content: "The dimensions are:",
          explanation: "Width = 8 cm\nLength = x + 4 = 12 cm",
          voiceText: "Width is eight centimeters. Length is twelve centimeters."
        },
        {
          title: "Step 7: Verify",
          content: "Check the answer:",
          explanation: "Area = 8 × 12 = 96 cm² ✓",
          voiceText: "Verify. Eight times twelve equals ninety-six. Correct."
        }
      ]
    }
  ]

  /* ============================================================
     SPEECH
     ============================================================ */
  const stopSpeech = useCallback(() => {
    if (speakTimer.current) {
      clearTimeout(speakTimer.current)
      speakTimer.current = null
    }
    if (speechSynth.current) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }, [])

  const speakText = useCallback((text, delay = 0) => {
    if (!text) return
    stopSpeech()
    if (!("speechSynthesis" in window)) return

    const doSpeak = () => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.85
      utterance.pitch = 1.05
      utterance.volume = 1
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      speechSynth.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    if (delay > 0) {
      speakTimer.current = setTimeout(doSpeak, delay)
    } else {
      doSpeak()
    }
  }, [stopSpeech])

  /* ============================================================
     STEP NAVIGATION
     ============================================================ */
  const nextStep = () => {
    if (currentStep < examples[currentExample].steps.length - 1) {
      const nextIdx = currentStep + 1
      setCurrentStep(nextIdx)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      const nextStepData = examples[currentExample].steps[nextIdx]
      if (nextStepData) {
        speakText(nextStepData.voiceText || `${nextStepData.title}. ${nextStepData.content} ${nextStepData.explanation || ''}`)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1
      setCurrentStep(prevIdx)
      setUserInput('')
      setShowHint(false)
      setIsCorrect(null)
      const prevStepData = examples[currentExample].steps[prevIdx]
      if (prevStepData) {
        speakText(prevStepData.voiceText || `${prevStepData.title}. ${prevStepData.content} ${prevStepData.explanation || ''}`)
      }
    }
  }

  const checkAnswer = () => {
    const currentInteractive = examples[currentExample].steps[currentStep]?.interactive
    if (!currentInteractive) return

    const isAnswerCorrect = answersMatch(userInput, currentInteractive.answer)
    setIsCorrect(isAnswerCorrect)

    if (isAnswerCorrect) {
      speakText(`Correct! ${currentInteractive.answer} is right. Well done!`)
    } else {
      speakText(`Not quite. ${currentInteractive.hint}`)
    }
  }

  const handleExampleChange = (index) => {
    setCurrentExample(index)
    setCurrentStep(0)
    setUserInput('')
    setShowHint(false)
    setIsCorrect(null)
    const example = examples[index]
    speakText(`${example.title}. ${example.voiceText || example.equation || example.problem}`)
  }

  useEffect(() => {
    speakText(`${examples[0].title}. ${examples[0].voiceText || examples[0].equation}`, 500)
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
          <Link to="/topics/algebra" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#6366F1', textDecoration: 'none', marginBottom: '16px', fontSize: '14px'
          }}>
            ← Back to Algebra Topics
          </Link>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px', fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Algebra Examples & Practice
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Step-by-step interactive examples with verified solutions
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>

          {/* Sidebar */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white', borderRadius: '20px',
              padding: isMobile ? '16px' : '20px',
              border: '1px solid #E2E8F0', position: 'sticky', top: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>
                Examples ({examples.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {examples.map((example, index) => (
                  <button key={index} onClick={() => handleExampleChange(index)}
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: isMobile ? '12px' : '14px',
                      borderRadius: '14px',
                      border: currentExample === index ? '2px solid #6366F1' : '1px solid #E2E8F0',
                      background: currentExample === index ? '#EEF2FF' : 'white',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '10px',
                        background: currentExample === index ? '#6366F1' : '#E2E8F0',
                        color: currentExample === index ? 'white' : '#64748B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                      <div>
                        <div style={{
                          fontSize: isMobile ? '13px' : '14px', fontWeight: '500',
                          color: currentExample === index ? '#6366F1' : '#0F172A'
                        }}>
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
              background: 'white', borderRadius: '24px',
              padding: isMobile ? '20px' : '28px', border: '1px solid #E2E8F0'
            }}>

              {/* Example Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '24px',
                flexWrap: 'wrap', gap: '16px'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h2 style={{
                    fontSize: isMobile ? '20px' : '24px', fontWeight: '700',
                    color: '#0F172A', marginBottom: '8px'
                  }}>
                    {currentExampleData.title}
                  </h2>
                  <div style={{
                    fontSize: isMobile ? '16px' : '18px', fontFamily: 'monospace',
                    color: '#6366F1', fontWeight: '600'
                  }}>
                    {currentExampleData.equation || currentExampleData.problem}
                  </div>
                </div>

                <button
                  onClick={() => speakText(currentStepData.voiceText || `${currentStepData.title}. ${currentStepData.content} ${currentStepData.explanation || ''}`)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px',
                    background: isPlaying ? '#EF4444' : '#10B981',
                    color: 'white', border: 'none', borderRadius: '12px',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '500'
                  }}>
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
                  width: '100%', background: '#E2E8F0',
                  borderRadius: '9999px', height: '6px', overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((currentStep + 1) / currentExampleData.steps.length) * 100}%`,
                    background: 'linear-gradient(90deg, #10B981, #6366F1)',
                    height: '100%', borderRadius: '9999px', transition: 'width 0.5s'
                  }}></div>
                </div>
              </div>

              {/* Current Step */}
              <div>
                <div style={{
                  background: '#EEF2FF', borderRadius: '16px',
                  padding: '20px', marginBottom: '20px',
                  borderLeft: '4px solid #6366F1'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                    {currentStepData.title}
                  </h3>
                  <p style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {currentStepData.content}
                  </p>
                </div>

                {currentStepData.explanation && (
                  <div style={{
                    background: '#DCFCE7', borderRadius: '16px',
                    padding: '16px', marginBottom: '20px',
                    borderLeft: '4px solid #10B981'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
                      Explanation:
                    </h4>
                    <p style={{ color: '#14532D', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                      {currentStepData.explanation}
                    </p>
                  </div>
                )}

                {currentStepData.working && (
                  <div style={{
                    background: '#F3E8FF', borderRadius: '16px',
                    padding: '16px', marginBottom: '20px',
                    borderLeft: '4px solid #8B5CF6'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#5B21B6', marginBottom: '8px' }}>
                      Working:
                    </h4>
                    <pre style={{
                      color: '#4C1D95', fontFamily: 'monospace',
                      fontSize: '13px', whiteSpace: 'pre-wrap', margin: 0
                    }}>
                      {currentStepData.working}
                    </pre>
                  </div>
                )}

                {currentExample === 0 && currentStep === 3 && currentExampleData.visualization?.table && (
                  <div style={{
                    background: '#FEF3C7', borderRadius: '16px',
                    padding: '16px', marginBottom: '20px',
                    borderLeft: '4px solid #F59E0B'
                  }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
                      Visualization:
                    </h4>
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
                                  padding: '8px', borderBottom: '1px solid #FDE68A',
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
                      Only when x = -9 or x = 4 does the product become zero!
                    </p>
                  </div>
                )}

                {currentStepData.interactive && (
                  <div style={{
                    background: '#FEF3C7', borderRadius: '16px',
                    padding: '20px', marginBottom: '20px',
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
                        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                        placeholder="Type your answer here..."
                        style={{
                          width: '100%', padding: '12px 16px',
                          border: '1px solid #FDE68A', borderRadius: '12px',
                          fontSize: '14px', outline: 'none'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#FDE68A'}
                      />

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button onClick={checkAnswer}
                          style={{
                            padding: '8px 20px', background: '#F59E0B',
                            color: 'white', border: 'none', borderRadius: '10px',
                            cursor: 'pointer', fontWeight: '500', fontSize: '13px'
                          }}>
                          Check Answer
                        </button>
                        <button onClick={() => setShowHint(!showHint)}
                          style={{
                            padding: '8px 20px', background: '#FEF3C7',
                            color: '#92400E', border: '1px solid #FDE68A',
                            borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '13px'
                          }}>
                          {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                      </div>

                      {showHint && (
                        <div style={{
                          background: '#FEF3C7', padding: '12px',
                          borderRadius: '10px', border: '1px solid #FDE68A'
                        }}>
                          <p style={{ fontSize: '13px', color: '#92400E' }}>
                            💡 {currentStepData.interactive.hint}
                          </p>
                        </div>
                      )}

                      {isCorrect !== null && (
                        <div style={{
                          padding: '12px', borderRadius: '10px',
                          background: isCorrect ? '#D1FAE5' : '#FEE2E2',
                          border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`
                        }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: isCorrect ? '#065F46' : '#991B1B' }}>
                            {isCorrect ? '✅ Correct! Well done!' : '❌ Not quite. Try again!'}
                          </p>
                          {!isCorrect && (
                            <p style={{ fontSize: '12px', marginTop: '4px', color: '#991B1B' }}>
                              Hint: {currentStepData.interactive.hint}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ textAlign: 'center', padding: '16px' }}>
                  {currentStep === currentExampleData.steps.length - 1 ? (
                    <div style={{
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      borderRadius: '16px', padding: '16px', color: 'white'
                    }}>
                      <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                        🎉 Amazing! You completed this example!
                      </p>
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

              {/* Navigation */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '24px', paddingTop: '20px',
                borderTop: '1px solid #E2E8F0', gap: '12px'
              }}>
                <button onClick={prevStep} disabled={currentStep === 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px',
                    background: currentStep === 0 ? '#F1F5F9' : 'white',
                    color: currentStep === 0 ? '#94A3B8' : '#64748B',
                    border: '1px solid #E2E8F0', borderRadius: '12px',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer', fontWeight: '500'
                  }}>
                  <span>←</span><span>Previous</span>
                </button>

                <button onClick={nextStep} disabled={currentStep === currentExampleData.steps.length - 1}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px',
                    background: currentStep === currentExampleData.steps.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #10B981, #059669)',
                    color: currentStep === currentExampleData.steps.length - 1 ? '#94A3B8' : 'white',
                    border: 'none', borderRadius: '12px',
                    cursor: currentStep === currentExampleData.steps.length - 1 ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}>
                  <span>Next</span><span>→</span>
                </button>
              </div>
            </div>

            {/* Step Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              {currentExampleData.steps.map((_, index) => (
                <button key={index}
                  onClick={() => {
                    setCurrentStep(index)
                    setUserInput('')
                    setShowHint(false)
                    setIsCorrect(null)
                    speakText(currentExampleData.steps[index].voiceText || `${currentExampleData.steps[index].title}`)
                  }}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: index === currentStep ? '#6366F1' : index < currentStep ? '#10B981' : '#E2E8F0',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                  }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}