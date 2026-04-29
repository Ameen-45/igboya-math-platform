import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function TriangleSolver() {
  const [solverType, setSolverType] = useState('right-triangle')
  const [inputs, setInputs] = useState({})
  const [results, setResults] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSteps, setShowSteps] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const speechSynth = useRef(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const solverTypes = {
    'right-triangle': {
      name: 'Right Triangle Solver',
      description: 'Solve right triangles using SOH-CAH-TOA',
      icon: '📐',
      color: '#6366F1',
      gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      inputs: [
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 90, placeholder: 'e.g., 30' },
        { name: 'angleB', label: 'Angle B (degrees)', type: 'number', min: 0, max: 90, placeholder: 'e.g., 60' },
        { name: 'sideA', label: 'Side A (opposite A)', type: 'number', min: 0, placeholder: 'e.g., 5' },
        { name: 'sideB', label: 'Side B (opposite B)', type: 'number', min: 0, placeholder: 'e.g., 8.66' },
        { name: 'sideC', label: 'Side C (hypotenuse)', type: 'number', min: 0, placeholder: 'e.g., 10' }
      ],
      calculate: (inputs) => calculateRightTriangle(inputs),
      steps: (inputs, results) => generateRightTriangleSteps(inputs, results),
      voiceText: 'Right Triangle Solver. Use SOH-CAH-TOA to solve right triangles.'
    },
    'sine-rule': {
      name: 'Sine Rule Solver',
      description: 'Solve any triangle using a/sinA = b/sinB = c/sinC',
      icon: '⚖️',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      inputs: [
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 180, placeholder: 'e.g., 40' },
        { name: 'angleB', label: 'Angle B (degrees)', type: 'number', min: 0, max: 180, placeholder: 'e.g., 60' },
        { name: 'angleC', label: 'Angle C (degrees)', type: 'number', min: 0, max: 180, placeholder: 'e.g., 80' },
        { name: 'sideA', label: 'Side A (opposite A)', type: 'number', min: 0, placeholder: 'e.g., 8' },
        { name: 'sideB', label: 'Side B (opposite B)', type: 'number', min: 0, placeholder: 'e.g., 10.78' },
        { name: 'sideC', label: 'Side C (opposite C)', type: 'number', min: 0, placeholder: 'e.g., 12' }
      ],
      calculate: (inputs) => calculateSineRule(inputs),
      steps: (inputs, results) => generateSineRuleSteps(inputs, results),
      voiceText: 'Sine Rule Solver. Use a over sin A equals b over sin B equals c over sin C.'
    },
    'cosine-rule': {
      name: 'Cosine Rule Solver',
      description: 'Find sides or angles using cosine rule',
      icon: '📏',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      inputs: [
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 180, placeholder: 'e.g., 50' },
        { name: 'sideA', label: 'Side A (opposite A)', type: 'number', min: 0, placeholder: 'e.g., 7' },
        { name: 'sideB', label: 'Side B', type: 'number', min: 0, placeholder: 'e.g., 7' },
        { name: 'sideC', label: 'Side C', type: 'number', min: 0, placeholder: 'e.g., 9' }
      ],
      calculate: (inputs) => calculateCosineRule(inputs),
      steps: (inputs, results) => generateCosineRuleSteps(inputs, results),
      voiceText: 'Cosine Rule Solver. Use a squared equals b squared plus c squared minus 2 b c cosine A.'
    },
    'area-solver': {
      name: 'Area Calculator',
      description: 'Calculate triangle area using different formulas',
      icon: '📊',
      color: '#EC4899',
      gradient: 'linear-gradient(135deg, #EC4899, #BE185D)',
      inputs: [
        { name: 'sideA', label: 'Side A', type: 'number', min: 0, placeholder: 'e.g., 8' },
        { name: 'sideB', label: 'Side B', type: 'number', min: 0, placeholder: 'e.g., 10' },
        { name: 'sideC', label: 'Side C', type: 'number', min: 0, placeholder: 'e.g., 12' },
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 180, placeholder: 'e.g., 60' },
        { name: 'base', label: 'Base', type: 'number', min: 0, placeholder: 'e.g., 10' },
        { name: 'height', label: 'Height', type: 'number', min: 0, placeholder: 'e.g., 8.66' }
      ],
      calculate: (inputs) => calculateArea(inputs),
      steps: (inputs, results) => generateAreaSteps(inputs, results),
      voiceText: 'Area Calculator. Calculate triangle area using various formulas.'
    }
  }

  // Right Triangle Calculations
  const calculateRightTriangle = (inputs) => {
    const { angleA, angleB, sideA, sideB, sideC } = inputs
    const results = { ...inputs }
    
    if (angleA && !angleB) results.angleB = 90 - angleA
    if (angleB && !angleA) results.angleA = 90 - angleB
    if (!angleA && !angleB) {
      results.angleA = 45
      results.angleB = 45
    }

    const A = (results.angleA * Math.PI) / 180
    const B = (results.angleB * Math.PI) / 180

    if (sideC) {
      if (!sideA) results.sideA = sideC * Math.sin(A)
      if (!sideB) results.sideB = sideC * Math.cos(A)
    } else if (sideA && sideB) {
      results.sideC = Math.sqrt(sideA * sideA + sideB * sideB)
    } else if (sideA && angleA) {
      results.sideC = sideA / Math.sin(A)
      results.sideB = sideA / Math.tan(A)
    } else if (sideB && angleA) {
      results.sideC = sideB / Math.cos(A)
      results.sideA = sideB * Math.tan(A)
    }

    results.area = 0.5 * results.sideA * results.sideB
    results.perimeter = results.sideA + results.sideB + results.sideC
    
    return results
  }

  // Sine Rule Calculations
  const calculateSineRule = (inputs) => {
    const results = { ...inputs }
    const { angleA, angleB, angleC, sideA, sideB, sideC } = inputs

    const knownAngles = [angleA, angleB, angleC].filter(a => a).length
    if (knownAngles === 2) {
      if (angleA && angleB && !angleC) results.angleC = 180 - angleA - angleB
      if (angleA && angleC && !angleB) results.angleB = 180 - angleA - angleC
      if (angleB && angleC && !angleA) results.angleA = 180 - angleB - angleC
    }

    const A = (results.angleA * Math.PI) / 180
    const B = (results.angleB * Math.PI) / 180
    const C = (results.angleC * Math.PI) / 180

    if (sideA) {
      const ratio = sideA / Math.sin(A)
      if (!sideB && results.angleB) results.sideB = ratio * Math.sin(B)
      if (!sideC && results.angleC) results.sideC = ratio * Math.sin(C)
    } else if (sideB && results.angleA) {
      const ratio = sideB / Math.sin(B)
      results.sideA = ratio * Math.sin(A)
      if (!sideC && results.angleC) results.sideC = ratio * Math.sin(C)
    } else if (sideC && results.angleA) {
      const ratio = sideC / Math.sin(C)
      results.sideA = ratio * Math.sin(A)
      if (!sideB && results.angleB) results.sideB = ratio * Math.sin(B)
    }

    if (results.sideA && results.sideB && results.angleC) {
      results.area = 0.5 * results.sideA * results.sideB * Math.sin(C)
    }
    
    results.perimeter = (results.sideA || 0) + (results.sideB || 0) + (results.sideC || 0)
    
    return results
  }

  // Cosine Rule Calculations
  const calculateCosineRule = (inputs) => {
    const results = { ...inputs }
    const { angleA, sideA, sideB, sideC } = inputs

    if (sideB && sideC && angleA) {
      const A = (angleA * Math.PI) / 180
      results.sideA = Math.sqrt(sideB * sideB + sideC * sideC - 2 * sideB * sideC * Math.cos(A))
    } else if (sideA && sideB && sideC) {
      const cosA = (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)
      results.angleA = (Math.acos(cosA) * 180) / Math.PI
    }

    if (results.sideA && results.sideB && results.sideC && results.angleA) {
      results.area = 0.5 * results.sideB * results.sideC * Math.sin((results.angleA * Math.PI) / 180)
      results.perimeter = results.sideA + results.sideB + results.sideC
    }
    
    return results
  }

  // Area Calculations
  const calculateArea = (inputs) => {
    const results = { ...inputs }
    const { sideA, sideB, sideC, angleA, base, height } = inputs

    if (base && height) {
      results.area = 0.5 * base * height
    } else if (sideA && sideB && angleA) {
      const A = (angleA * Math.PI) / 180
      results.area = 0.5 * sideA * sideB * Math.sin(A)
    } else if (sideA && sideB && sideC) {
      const s = (sideA + sideB + sideC) / 2
      results.area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC))
    }

    return results
  }

  // Step Generation Functions
  const generateRightTriangleSteps = (inputs, results) => {
    const steps = []
    const { angleA, angleB, sideA, sideB, sideC } = inputs

    steps.push({
      title: "Step 1: Verify Right Triangle",
      content: "Confirm we have a right triangle (one angle = 90°).",
      explanation: `Angle A = ${angleA || results.angleA?.toFixed(2)}°, Angle B = ${angleB || results.angleB?.toFixed(2)}°, Angle C = 90° (right angle)`,
      voiceText: `Step 1. Verify right triangle. Angle A is ${angleA || results.angleA?.toFixed(2)} degrees, Angle B is ${angleB || results.angleB?.toFixed(2)} degrees.`
    })

    if (!angleA || !angleB) {
      steps.push({
        title: "Step 2: Calculate Missing Angle",
        content: "Use the fact that angles sum to 180°.",
        explanation: `Missing angle = 90° - ${angleA || angleB}° = ${results.angleA || results.angleB}°`,
        voiceText: `Step 2. Calculate missing angle. Using angle sum property, the missing angle is ${results.angleA || results.angleB} degrees.`
      })
    }

    if (sideC) {
      steps.push({
        title: "Step 3: Use Trigonometric Ratios",
        content: "Apply SOH-CAH-TOA to find missing sides.",
        explanation: `sin(${results.angleA?.toFixed(2)}°) = Opposite/Hypotenuse\ncos(${results.angleA?.toFixed(2)}°) = Adjacent/Hypotenuse`,
        voiceText: `Step 3. Use trigonometric ratios. Sine of angle A equals opposite over hypotenuse. Cosine equals adjacent over hypotenuse.`
      })
    }

    steps.push({
      title: "Step 4: Calculate Results",
      content: "Compute all missing values.",
      explanation: `Side A = ${results.sideA?.toFixed(2)}\nSide B = ${results.sideB?.toFixed(2)}\nSide C = ${results.sideC?.toFixed(2)}`,
      voiceText: `Step 4. Calculate results. Side A is ${results.sideA?.toFixed(2)}. Side B is ${results.sideB?.toFixed(2)}. Side C is ${results.sideC?.toFixed(2)}.`
    })

    return steps
  }

  const generateSineRuleSteps = (inputs, results) => {
    const steps = []
    
    steps.push({
      title: "Step 1: Sine Rule Formula",
      content: "Apply the sine rule: a/sinA = b/sinB = c/sinC",
      explanation: "This ratio is constant for all sides and their opposite angles.",
      voiceText: "Step 1. Apply sine rule. a over sin A equals b over sin B equals c over sin C."
    })

    if (results.angleA && results.angleB && !results.angleC) {
      steps.push({
        title: "Step 2: Find Missing Angle",
        content: "Use angle sum property: A + B + C = 180°",
        explanation: `Angle C = 180° - ${results.angleA?.toFixed(2)}° - ${results.angleB?.toFixed(2)}° = ${results.angleC?.toFixed(2)}°`,
        voiceText: `Step 2. Find missing angle. Angle C equals 180 minus ${results.angleA?.toFixed(2)} minus ${results.angleB?.toFixed(2)} equals ${results.angleC?.toFixed(2)} degrees.`
      })
    }

    steps.push({
      title: "Step 3: Calculate Common Ratio",
      content: "Find the common ratio using known side and angle.",
      explanation: `Ratio = ${results.sideA || results.sideB || results.sideC} / sin(${results.angleA || results.angleB || results.angleC}°)`,
      voiceText: "Step 3. Calculate common ratio using known side and opposite angle."
    })

    steps.push({
      title: "Step 4: Find Missing Sides",
      content: "Use the ratio to find other sides.",
      explanation: `Missing side = Ratio × sin(opposite angle)`,
      voiceText: "Step 4. Find missing sides. Missing side equals ratio times sine of opposite angle."
    })

    return steps
  }

  const generateCosineRuleSteps = (inputs, results) => {
    const steps = []
    
    steps.push({
      title: "Step 1: Cosine Rule Formula",
      content: "Apply the appropriate cosine rule formula.",
      explanation: "For sides: a² = b² + c² - 2bc·cosA\nFor angles: cosA = (b² + c² - a²) / 2bc",
      voiceText: "Step 1. Apply cosine rule. For sides: a squared equals b squared plus c squared minus 2 b c cosine A."
    })

    if (inputs.sideB && inputs.sideC && inputs.angleA) {
      steps.push({
        title: "Step 2: Calculate Side A",
        content: "Use cosine rule to find the missing side.",
        explanation: `a² = ${inputs.sideB}² + ${inputs.sideC}² - 2×${inputs.sideB}×${inputs.sideC}×cos(${inputs.angleA}°)`,
        voiceText: `Step 2. Calculate side A. a squared equals ${inputs.sideB} squared plus ${inputs.sideC} squared minus 2 times ${inputs.sideB} times ${inputs.sideC} times cosine of ${inputs.angleA} degrees.`
      })
    } else {
      steps.push({
        title: "Step 2: Calculate Angle A",
        content: "Use cosine rule to find the missing angle.",
        explanation: `cosA = (${inputs.sideB}² + ${inputs.sideC}² - ${inputs.sideA}²) / (2×${inputs.sideB}×${inputs.sideC})`,
        voiceText: `Step 2. Calculate angle A. Cosine A equals ${inputs.sideB} squared plus ${inputs.sideC} squared minus ${inputs.sideA} squared over 2 times ${inputs.sideB} times ${inputs.sideC}.`
      })
    }

    return steps
  }

  const generateAreaSteps = (inputs, results) => {
    const steps = []
    
    if (inputs.base && inputs.height) {
      steps.push({
        title: "Step 1: Basic Area Formula",
        content: "Use the formula: Area = ½ × base × height",
        explanation: `Area = 0.5 × ${inputs.base} × ${inputs.height} = ${results.area?.toFixed(2)}`,
        voiceText: `Step 1. Use basic area formula. Area equals 0.5 times base ${inputs.base} times height ${inputs.height} equals ${results.area?.toFixed(2)}.`
      })
    } else if (inputs.sideA && inputs.sideB && inputs.angleA) {
      steps.push({
        title: "Step 1: Trigonometric Area Formula",
        content: "Use: Area = ½ × a × b × sin(C)",
        explanation: `Area = 0.5 × ${inputs.sideA} × ${inputs.sideB} × sin(${inputs.angleA}°) = ${results.area?.toFixed(2)}`,
        voiceText: `Step 1. Use trigonometric area formula. Area equals 0.5 times side A ${inputs.sideA} times side B ${inputs.sideB} times sine of angle A ${inputs.angleA} degrees. Area is ${results.area?.toFixed(2)}.`
      })
    } else {
      steps.push({
        title: "Step 1: Heron's Formula",
        content: "Use Heron's formula for three sides.",
        explanation: `s = (${inputs.sideA} + ${inputs.sideB} + ${inputs.sideC}) / 2 = ${(inputs.sideA + inputs.sideB + inputs.sideC) / 2}\nArea = √[s(s-a)(s-b)(s-c)] = ${results.area?.toFixed(2)}`,
        voiceText: `Step 1. Use Heron's formula. Calculate s as semi-perimeter. Then area equals square root of s times s minus a times s minus b times s minus c. Area is ${results.area?.toFixed(2)}.`
      })
    }

    return steps
  }

  const handleInputChange = (name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : ''
    }))
  }

  const solveTriangle = () => {
    const filledInputs = Object.fromEntries(
      Object.entries(inputs).filter(([_, value]) => value !== '' && value !== undefined)
    )
    
    if (Object.keys(filledInputs).length < 3) {
      speakText('Please enter at least 3 values to solve the triangle')
      alert('Please enter at least 3 values to solve the triangle')
      return
    }

    const solver = solverTypes[solverType]
    const calculatedResults = solver.calculate(filledInputs)
    setResults(calculatedResults)
    setShowSteps(true)
    setCurrentStep(0)
    
    speakText(`Solving ${solver.name}. ${solver.voiceText}`)
  }

  const resetSolver = () => {
    setInputs({})
    setResults(null)
    setShowSteps(false)
    setCurrentStep(0)
    speakText('Solver reset. Enter new values to begin.')
  }

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

  useEffect(() => {
    return () => stopSpeech()
  }, [stopSpeech])

  const currentSolver = solverTypes[solverType]
  const steps = results ? currentSolver.steps(inputs, results) : []

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/topics/trigonometry" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EF4444',
            textDecoration: 'none',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            ← Back to Trigonometry Topics
          </Link>
          <div style={{
            width: isMobile ? '70px' : '80px',
            height: isMobile ? '70px' : '80px',
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.3)'
          }}>
            <span style={{ fontSize: isMobile ? '32px' : '36px' }}>📐</span>
          </div>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Triangle Solver
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Solve triangles using trigonometric ratios and laws. Enter known values and let the solver find the rest!
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px' }}>
          
          {/* Sidebar - Solver Types */}
          <div style={{ flex: 1 }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: isMobile ? '16px' : '20px',
              border: '1px solid #E2E8F0',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>Solver Types</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(solverTypes).map(([key, solver]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSolverType(key)
                      resetSolver()
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: isMobile ? '12px' : '14px',
                      borderRadius: '14px',
                      border: solverType === key ? `2px solid ${solver.color}` : '1px solid #E2E8F0',
                      background: solverType === key ? `${solver.color}10` : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: solver.gradient,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        color: 'white'
                      }}>
                        {solver.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '500', color: solverType === key ? solver.color : '#0F172A' }}>
                          {solver.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                          {solver.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Tips */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: '#FEF3C7',
                borderRadius: '16px',
                border: '1px solid #FDE68A'
              }}>
                <h4 style={{ fontWeight: '600', color: '#92400E', marginBottom: '8px', fontSize: '13px' }}>💡 Tips</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#92400E', lineHeight: '1.6' }}>
                  <li>• Enter at least 3 values</li>
                  <li>• Include at least one side length</li>
                  <li>• Angles should be in degrees</li>
                  <li>• View step-by-step solutions</li>
                </ul>
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
              
              {/* Solver Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: currentSolver.color }}>
                    {currentSolver.name}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    {currentSolver.description}
                  </p>
                </div>
                <div style={{ fontSize: '32px' }}>{currentSolver.icon}</div>
              </div>

              {/* Input Form */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {currentSolver.inputs.map((input) => (
                  <div key={input.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      min={input.min}
                      max={input.max}
                      step="any"
                      value={inputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      placeholder={input.placeholder}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = currentSolver.color}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={solveTriangle}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: currentSolver.gradient,
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🔬 Solve Triangle
                </button>
                <button
                  onClick={resetSolver}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#64748B',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🗑️ Reset
                </button>
              </div>

              {/* Results */}
              {results && (
                <div style={{
                  background: '#ECFDF5',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid #D1FAE5'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#065F46', marginBottom: '16px' }}>
                    Solution Results
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                    gap: '12px'
                  }}>
                    {Object.entries(results).map(([key, value]) => (
                      value !== undefined && value !== '' && (
                        <div key={key} style={{
                          background: 'white',
                          padding: '12px',
                          borderRadius: '12px',
                          border: '1px solid #D1FAE5'
                        }}>
                          <div style={{ fontSize: '11px', fontWeight: '500', color: '#10B981', marginBottom: '4px' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#065F46' }}>
                            {typeof value === 'number' ? value.toFixed(2) : value}
                            {key.includes('angle') ? '°' : key.includes('area') ? ' units²' : key.includes('side') ? ' units' : ''}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                  <button
                    onClick={() => speakText(`Solution results. ${Object.entries(results).map(([k, v]) => `${k} is ${typeof v === 'number' ? v.toFixed(2) : v}`).join('. ')}`)}
                    style={{
                      marginTop: '16px',
                      padding: '6px 12px',
                      background: '#D1FAE5',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      color: '#065F46'
                    }}
                  >
                    🔊 Read Results
                  </button>
                </div>
              )}

              {/* Step-by-Step Solution */}
              {showSteps && steps.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                      Step-by-Step Solution
                    </h3>
                    <button 
                      onClick={() => speakText(steps[currentStep]?.voiceText || `${steps[currentStep]?.title}. ${steps[currentStep]?.content} ${steps[currentStep]?.explanation}`)}
                      style={{
                        padding: '6px 12px',
                        background: '#E0E7FF',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: '#4338CA'
                      }}
                    >
                      🔊 Listen
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>
                      <span>Step {currentStep + 1} of {steps.length}</span>
                      <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '9999px', height: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`,
                        background: 'linear-gradient(90deg, #8B5CF6, #6366F1)',
                        height: '100%',
                        borderRadius: '9999px',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>

                  {/* Current Step */}
                  <div style={{
                    background: '#EEF2FF',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    borderLeft: `4px solid ${currentSolver.color}`
                  }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                      {steps[currentStep].title}
                    </h4>
                    <p style={{ color: '#1E3A8A', lineHeight: '1.6', marginBottom: '16px', whiteSpace: 'pre-line' }}>
                      {steps[currentStep].content}
                    </p>
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid #C7D2FE'
                    }}>
                      <h5 style={{ fontWeight: '600', color: '#1E3A8A', marginBottom: '8px', fontSize: '12px' }}>Explanation:</h5>
                      <p style={{ color: '#1E3A8A', fontSize: '13px', lineHeight: '1.5' }}>
                        {steps[currentStep].explanation}
                      </p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <button
                      onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                      disabled={currentStep === 0}
                      style={{
                        padding: '10px 20px',
                        background: currentStep === 0 ? '#F1F5F9' : 'white',
                        color: currentStep === 0 ? '#94A3B8' : '#64748B',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '13px'
                      }}
                    >
                      ← Previous
                    </button>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {steps.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentStep(idx)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            background: idx === currentStep ? currentSolver.color : idx < currentStep ? '#10B981' : '#F1F5F9',
                            color: idx === currentStep || idx < currentStep ? 'white' : '#94A3B8',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                      disabled={currentStep === steps.length - 1}
                      style={{
                        padding: '10px 20px',
                        background: currentStep === steps.length - 1 ? '#F1F5F9' : 'linear-gradient(135deg, #10B981, #059669)',
                        color: currentStep === steps.length - 1 ? '#94A3B8' : 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        fontSize: '13px'
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}