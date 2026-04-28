import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function TriangleSolver() {
  const [solverType, setSolverType] = useState('right-triangle')
  const [inputs, setInputs] = useState({})
  const [results, setResults] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSteps, setShowSteps] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const speechSynth = useRef(null)
  
  const solverTypes = {
    'right-triangle': {
      name: 'Right Triangle Solver',
      description: 'Solve right triangles using SOH-CAH-TOA',
      icon: '📐',
      inputs: [
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 90 },
        { name: 'angleB', label: 'Angle B (degrees)', type: 'number', min: 0, max: 90 },
        { name: 'sideA', label: 'Side A (opposite A)', type: 'number', min: 0 },
        { name: 'sideB', label: 'Side B (opposite B)', type: 'number', min: 0 },
        { name: 'sideC', label: 'Side C (hypotenuse)', type: 'number', min: 0 }
      ],
      calculate: (inputs) => calculateRightTriangle(inputs),
      steps: (inputs, results) => generateRightTriangleSteps(inputs, results)
    },
    'sine-rule': {
      name: 'Sine Rule Solver',
      description: 'Solve any triangle using a/sinA = b/sinB = c/sinC',
      icon: '⚖️',
      inputs: [
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 180 },
        { name: 'angleB', label: 'Angle B (degrees)', type: 'number', min: 0, max: 180 },
        { name: 'angleC', label: 'Angle C (degrees)', type: 'number', min: 0, max: 180 },
        { name: 'sideA', label: 'Side A (opposite A)', type: 'number', min: 0 },
        { name: 'sideB', label: 'Side B (opposite B)', type: 'number', min: 0 },
        { name: 'sideC', label: 'Side C (opposite C)', type: 'number', min: 0 }
      ],
      calculate: (inputs) => calculateSineRule(inputs),
      steps: (inputs, results) => generateSineRuleSteps(inputs, results)
    },
    'cosine-rule': {
      name: 'Cosine Rule Solver',
      description: 'Find sides or angles using cosine rule',
      icon: '📏',
      inputs: [
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 180 },
        { name: 'sideA', label: 'Side A (opposite A)', type: 'number', min: 0 },
        { name: 'sideB', label: 'Side B', type: 'number', min: 0 },
        { name: 'sideC', label: 'Side C', type: 'number', min: 0 }
      ],
      calculate: (inputs) => calculateCosineRule(inputs),
      steps: (inputs, results) => generateCosineRuleSteps(inputs, results)
    },
    'area-solver': {
      name: 'Area Calculator',
      description: 'Calculate triangle area using different formulas',
      icon: '📊',
      inputs: [
        { name: 'sideA', label: 'Side A', type: 'number', min: 0 },
        { name: 'sideB', label: 'Side B', type: 'number', min: 0 },
        { name: 'sideC', label: 'Side C', type: 'number', min: 0 },
        { name: 'angleA', label: 'Angle A (degrees)', type: 'number', min: 0, max: 180 },
        { name: 'base', label: 'Base', type: 'number', min: 0 },
        { name: 'height', label: 'Height', type: 'number', min: 0 }
      ],
      calculate: (inputs) => calculateArea(inputs),
      steps: (inputs, results) => generateAreaSteps(inputs, results)
    }
  }

  // Right Triangle Calculations
  const calculateRightTriangle = (inputs) => {
    const { angleA, angleB, sideA, sideB, sideC } = inputs
    const results = { ...inputs }
    
    // Calculate missing angles
    if (angleA && !angleB) results.angleB = 90 - angleA
    if (angleB && !angleA) results.angleA = 90 - angleB
    if (!angleA && !angleB) {
      results.angleA = 45
      results.angleB = 45
    }

    const A = (results.angleA * Math.PI) / 180
    const B = (results.angleB * Math.PI) / 180

    // Calculate missing sides
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

    // Calculate missing angles
    const knownAngles = [angleA, angleB, angleC].filter(a => a).length
    if (knownAngles === 2) {
      if (angleA && angleB && !angleC) results.angleC = 180 - angleA - angleB
      if (angleA && angleC && !angleB) results.angleB = 180 - angleA - angleC
      if (angleB && angleC && !angleA) results.angleA = 180 - angleB - angleC
    }

    const A = (results.angleA * Math.PI) / 180
    const B = (results.angleB * Math.PI) / 180
    const C = (results.angleC * Math.PI) / 180

    // Calculate missing sides using sine rule
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

    // Calculate area using formula: 0.5 * a * b * sin(C)
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
      // Find side A using cosine rule
      const A = (angleA * Math.PI) / 180
      results.sideA = Math.sqrt(sideB * sideB + sideC * sideC - 2 * sideB * sideC * Math.cos(A))
    } else if (sideA && sideB && sideC) {
      // Find angle A using cosine rule
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
      // Heron's formula
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
      explanation: `Angle A = ${angleA || results.angleA}°, Angle B = ${angleB || results.angleB}°\nAngle C = 90° (right angle)`
    })

    if (!angleA || !angleB) {
      steps.push({
        title: "Step 2: Calculate Missing Angle",
        content: "Use the fact that angles sum to 180°.",
        explanation: `Missing angle = 90° - ${angleA || angleB}° = ${results.angleA || results.angleB}°`
      })
    }

    if (sideC) {
      steps.push({
        title: "Step 3: Use Trigonometric Ratios",
        content: "Apply SOH-CAH-TOA to find missing sides.",
        explanation: `sin(${results.angleA}°) = Opposite/Hypotenuse\ncos(${results.angleA}°) = Adjacent/Hypotenuse`
      })
    }

    steps.push({
      title: "Step 4: Calculate Results",
      content: "Compute all missing values.",
      explanation: `Side A = ${results.sideA?.toFixed(2)}\nSide B = ${results.sideB?.toFixed(2)}\nSide C = ${results.sideC?.toFixed(2)}`
    })

    return steps
  }

  const generateSineRuleSteps = (inputs, results) => {
    const steps = []
    
    steps.push({
      title: "Step 1: Sine Rule Formula",
      content: "Apply the sine rule: a/sinA = b/sinB = c/sinC",
      explanation: "This ratio is constant for all sides and their opposite angles."
    })

    if (results.angleA && results.angleB && !results.angleC) {
      steps.push({
        title: "Step 2: Find Missing Angle",
        content: "Use angle sum property: A + B + C = 180°",
        explanation: `Angle C = 180° - ${results.angleA}° - ${results.angleB}° = ${results.angleC}°`
      })
    }

    steps.push({
      title: "Step 3: Calculate Common Ratio",
      content: "Find the common ratio using known side and angle.",
      explanation: `Ratio = ${results.sideA || results.sideB || results.sideC} / sin(${results.angleA || results.angleB || results.angleC}°)`
    })

    steps.push({
      title: "Step 4: Find Missing Sides",
      content: "Use the ratio to find other sides.",
      explanation: `Missing side = Ratio × sin(opposite angle)`
    })

    return steps
  }

  const generateCosineRuleSteps = (inputs, results) => {
    const steps = []
    
    steps.push({
      title: "Step 1: Cosine Rule Formula",
      content: "Apply the appropriate cosine rule formula.",
      explanation: "For sides: a² = b² + c² - 2bc·cosA\nFor angles: cosA = (b² + c² - a²) / 2bc"
    })

    if (inputs.sideB && inputs.sideC && inputs.angleA) {
      steps.push({
        title: "Step 2: Calculate Side A",
        content: "Use cosine rule to find the missing side.",
        explanation: `a² = ${inputs.sideB}² + ${inputs.sideC}² - 2×${inputs.sideB}×${inputs.sideC}×cos(${inputs.angleA}°)`
      })
    } else {
      steps.push({
        title: "Step 2: Calculate Angle A",
        content: "Use cosine rule to find the missing angle.",
        explanation: `cosA = (${inputs.sideB}² + ${inputs.sideC}² - ${inputs.sideA}²) / (2×${inputs.sideB}×${inputs.sideC})`
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
        explanation: `Area = 0.5 × ${inputs.base} × ${inputs.height} = ${results.area}`
      })
    } else if (inputs.sideA && inputs.sideB && inputs.angleA) {
      steps.push({
        title: "Step 1: Trigonometric Area Formula",
        content: "Use: Area = ½ × a × b × sin(C)",
        explanation: `Area = 0.5 × ${inputs.sideA} × ${inputs.sideB} × sin(${inputs.angleA}°) = ${results.area}`
      })
    } else {
      steps.push({
        title: "Step 1: Heron's Formula",
        content: "Use Heron's formula for three sides.",
        explanation: `s = (${inputs.sideA} + ${inputs.sideB} + ${inputs.sideC}) / 2\nArea = √[s(s-a)(s-b)(s-c)]`
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
      alert('Please enter at least 3 values to solve the triangle')
      return
    }

    const solver = solverTypes[solverType]
    const calculatedResults = solver.calculate(filledInputs)
    setResults(calculatedResults)
    setShowSteps(true)
    setCurrentStep(0)
  }

  const resetSolver = () => {
    setInputs({})
    setResults(null)
    setShowSteps(false)
    setCurrentStep(0)
  }

  const stopSpeech = () => {
    if (speechSynth.current) {
      speechSynth.current.cancel()
    }
    setIsPlaying(false)
  }

  const speakText = (text) => {
    stopSpeech()
    
    if ('speechSynthesis' in window) {
      speechSynth.current = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.9
      
      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      
      speechSynth.current.speak(utterance)
    }
  }

  useEffect(() => {
    return () => stopSpeech()
  }, [])

  const currentSolver = solverTypes[solverType]
  const steps = results ? currentSolver.steps(inputs, results) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-8 sm:pb-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 pt-6">
          <Link 
            to="/topics/trigonometry" 
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4 text-sm sm:text-base"
          >
            ← Back to Trigonometry Topics
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-800 mb-3 sm:mb-4">
            Triangle Solver
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Solve triangles using trigonometric ratios and laws. Enter known values and let the solver find the rest!
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Solver Types */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Solver Types</h3>
              <div className="space-y-2">
                {Object.entries(solverTypes).map(([key, solver]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSolverType(key)
                      resetSolver()
                    }}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all ${
                      solverType === key
                        ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{solver.icon}</div>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{solver.name}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {solver.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Enter at least 3 values</li>
                  <li>• Include at least one side length</li>
                  <li>• Angles should be in degrees</li>
                  <li>• View step-by-step solutions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/50">
              
              {/* Solver Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-4">
                <div>
                  <h2 className="text-xl sm:text-3xl font-serif font-bold text-gray-800 mb-2">
                    {currentSolver.name}
                  </h2>
                  <p className="text-gray-600">
                    {currentSolver.description}
                  </p>
                </div>
                <div className="text-3xl">
                  {currentSolver.icon}
                </div>
              </div>

              {/* Input Form */}
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {currentSolver.inputs.map((input) => (
                  <div key={input.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      min={input.min}
                      max={input.max}
                      value={inputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                      placeholder={`Enter ${input.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap">
                <button
                  onClick={solveTriangle}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all font-semibold shadow-lg flex-1 min-w-[140px] text-center"
                >
                  Solve Triangle
                </button>
                <button
                  onClick={resetSolver}
                  className="bg-gray-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-600 transition-all font-semibold flex-1 min-w-[140px] text-center"
                >
                  Reset
                </button>
              </div>

              {/* Results */}
              {results && (
                <div className="bg-green-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-green-500">
                  <h3 className="font-bold text-green-800 text-lg sm:text-xl mb-4">
                    Solution Results
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(results).map(([key, value]) => (
                      value !== undefined && value !== '' && (
                        <div key={key} className="bg-white p-3 rounded-lg border border-green-200">
                          <div className="text-sm text-green-600 font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </div>
                          <div className="text-lg font-bold text-green-700">
                            {typeof value === 'number' ? value.toFixed(2) : value}
                            {key.includes('angle') ? '°' : key.includes('area') ? ' units²' : key.includes('side') ? ' units' : ''}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Solution */}
              {showSteps && steps.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg sm:text-xl">
                      Step-by-Step Solution
                    </h3>
                    <button 
                      onClick={() => speakText(steps[currentStep]?.content + ". " + steps[currentStep]?.explanation)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                        isPlaying 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      <span>{isPlaying ? '⏹️' : '🔊'}</span>
                      <span className="font-medium hidden sm:inline">
                        {isPlaying ? 'Stop' : 'Listen'}
                      </span>
                    </button>
                  </div>

                  {/* Current Step */}
                  <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-800 text-lg sm:text-xl mb-3">
                      {steps[currentStep].title}
                    </h4>
                    <p className="text-blue-700 leading-relaxed text-base sm:text-lg whitespace-pre-line mb-4">
                      {steps[currentStep].content}
                    </p>
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Explanation:</h5>
                      <p className="text-blue-700 leading-relaxed whitespace-pre-line text-base">
                        {steps[currentStep].explanation}
                      </p>
                    </div>
                  </div>

                  {/* Step Navigation */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                      disabled={currentStep === 0}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                        currentStep === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      <span>←</span>
                      <span className="font-medium">Previous</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>

                    <button
                      onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                      disabled={currentStep === steps.length - 1}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                        currentStep === steps.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      <span className="font-medium">Next</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Step Dots */}
                  <div className="flex justify-center space-x-2">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                          index === currentStep 
                            ? 'bg-purple-500 scale-125' 
                            : index < currentStep
                            ? 'bg-green-500'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Visualization Placeholder */}
              {results && (
                <div className="bg-orange-50 rounded-2xl p-4 sm:p-6 mt-6 border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-4 text-sm sm:text-base">Triangle Visualization:</h4>
                  <div className="flex justify-center">
                    <div className="w-64 h-48 bg-white border-2 border-orange-300 rounded-lg relative">
                      {/* Triangle Drawing Area */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-36 border-orange-500 relative">
                          {/* This would be replaced with actual triangle drawing based on results */}
                          <div className="w-full h-full border-2 border-orange-500 rounded"></div>
                          <div className="absolute -top-2 -left-2 text-orange-600 font-bold">A</div>
                          <div className="absolute -bottom-2 -left-2 text-orange-600 font-bold">B</div>
                          <div className="absolute -bottom-2 -right-2 text-orange-600 font-bold">C</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-orange-700 mt-3 text-sm text-center">
                    Triangle visualization based on calculated values
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}