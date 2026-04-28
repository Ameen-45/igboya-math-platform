import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function EquationSolver() {
  const [equation, setEquation] = useState('')
  const [solution, setSolution] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSolving, setIsSolving] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [showEquationTypes, setShowEquationTypes] = useState(false)

  const equationTypes = [
    {
      name: "Linear Equations",
      examples: ["2x + 5 = 13", "3(x - 2) = 12", "x/2 + 3 = 7"],
      pattern: /[x]=/,
      solver: solveLinearEquation
    },
    {
      name: "Quadratic Equations",
      examples: ["x^2 - 5x + 6 = 0", "2x^2 + 3x - 2 = 0", "x^2 = 16"],
      pattern: /x\^2|x²/,
      solver: solveQuadraticEquation
    },
    {
      name: "Systems of Equations",
      examples: ["2x + y = 7; x - y = 1", "x + y = 5; 2x - y = 4"],
      pattern: /[;]/,
      solver: solveSystemOfEquations
    }
  ]

  // Proper equation parser
  function parseEquation(eq) {
    // Clean the equation
    let cleanEq = eq.replace(/\s/g, '').replace(/²/g, '^2')
    
    // Handle missing = sign
    if (!cleanEq.includes('=')) {
      return null
    }

    const [left, right] = cleanEq.split('=')
    return { left, right }
  }

  // Parse linear terms
  function parseLinearTerms(expression) {
    let xCoefficient = 0
    let constant = 0
    
    // Handle simple cases first
    if (expression === 'x') return { xCoefficient: 1, constant: 0 }
    if (expression === '-x') return { xCoefficient: -1, constant: 0 }
    
    // Match terms like 2x, -3x, x, etc.
    const terms = expression.split(/(?=[+-])/).filter(term => term !== '')
    
    terms.forEach(term => {
      if (term.includes('x')) {
        let coef = term.replace('x', '')
        if (coef === '' || coef === '+') {
          xCoefficient += 1
        } else if (coef === '-') {
          xCoefficient -= 1
        } else {
          xCoefficient += parseFloat(coef)
        }
      } else {
        constant += parseFloat(term)
      }
    })
    
    return { xCoefficient, constant }
  }

  function solveLinearEquation(eq) {
    const steps = []
    const parsed = parseEquation(eq)
    if (!parsed) return null

    steps.push({
      title: "Original Equation",
      content: eq,
      explanation: "We start with the given linear equation."
    })

    // Move all terms to left side
    const leftTerms = parseLinearTerms(parsed.left)
    const rightTerms = parseLinearTerms(parsed.right)

    const totalXCoefficient = leftTerms.xCoefficient - rightTerms.xCoefficient
    const totalConstant = leftTerms.constant - rightTerms.constant

    steps.push({
      title: "Move All Terms to Left Side",
      content: `${totalXCoefficient === 1 ? '' : totalXCoefficient}x ${totalConstant >= 0 ? '+ ' + totalConstant : totalConstant} = 0`,
      explanation: `Bring all terms to one side to set the equation to zero.`
    })

    // Solve for x
    if (totalXCoefficient !== 0) {
      const solution = -totalConstant / totalXCoefficient
      
      steps.push({
        title: "Isolate x",
        content: `${totalXCoefficient}x = ${-totalConstant}`,
        explanation: `Move the constant term to the right side.`
      })

      steps.push({
        title: "Solve for x",
        content: `x = ${-totalConstant} / ${totalXCoefficient}`,
        explanation: `Divide both sides by the coefficient of x.`
      })

      steps.push({
        title: "Final Solution",
        content: `x = ${solution}`,
        explanation: `The solution to the equation is x = ${solution}.`
      })

      return {
        solution: `x = ${solution}`,
        steps,
        type: "linear",
        exactSolution: solution
      }
    } else {
      if (totalConstant === 0) {
        return {
          solution: "Infinite solutions (all real numbers)",
          steps: [...steps, {
            title: "Special Case",
            content: "0 = 0",
            explanation: "The equation is always true, so there are infinite solutions."
          }],
          type: "linear"
        }
      } else {
        return {
          solution: "No solution",
          steps: [...steps, {
            title: "Special Case",
            content: `${totalConstant} = 0`,
            explanation: "This is a contradiction, so there is no solution."
          }],
          type: "linear"
        }
      }
    }
  }

  function solveQuadraticEquation(eq) {
    const steps = []
    const parsed = parseEquation(eq)
    if (!parsed) return null

    steps.push({
      title: "Original Equation",
      content: eq,
      explanation: "We start with the given quadratic equation."
    })

    // Parse quadratic equation (simplified approach)
    let a = 0, b = 0, c = 0
    
    // Extract x^2 coefficient
    const x2Match = parsed.left.match(/([+-]?\d*)x\^2/)
    if (x2Match) {
      a = x2Match[1] === '' ? 1 : x2Match[1] === '-' ? -1 : parseFloat(x2Match[1])
    }

    // Extract x coefficient
    const xMatch = parsed.left.match(/([+-]?\d*)x(?!\^)/)
    if (xMatch) {
      b = xMatch[1] === '' ? 1 : xMatch[1] === '-' ? -1 : parseFloat(xMatch[1])
    }

    // Extract constant (everything that's not x or x^2)
    const constantMatch = parsed.left.match(/([+-]?\d+)(?!.*x)/)
    if (constantMatch) {
      c = parseFloat(constantMatch[1])
    }

    // Adjust for right side (move everything to left)
    if (parsed.right !== '0') {
      const rightConstant = parseFloat(parsed.right) || 0
      c -= rightConstant
    }

    steps.push({
      title: "Standard Form",
      content: `${a}x² ${b >= 0 ? '+ ' + b : b}x ${c >= 0 ? '+ ' + c : c} = 0`,
      explanation: "Write the equation in standard form ax² + bx + c = 0."
    })

    steps.push({
      title: "Identify Coefficients",
      content: `a = ${a}, b = ${b}, c = ${c}`,
      explanation: "Identify the coefficients for the quadratic formula."
    })

    // Calculate discriminant
    const discriminant = b * b - 4 * a * c
    
    steps.push({
      title: "Calculate Discriminant",
      content: `D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${discriminant}`,
      explanation: "The discriminant tells us about the nature of the roots."
    })

    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a)
      
      steps.push({
        title: "Apply Quadratic Formula",
        content: `x = [-b ± √D] / 2a = [${-b} ± √${discriminant}] / ${2*a}`,
        explanation: "Using the quadratic formula: x = [-b ± √(b²-4ac)] / 2a"
      })

      steps.push({
        title: "Calculate Roots",
        content: `x₁ = ${root1.toFixed(4)}, x₂ = ${root2.toFixed(4)}`,
        explanation: "Two distinct real roots."
      })

      return {
        solution: `x = ${root1.toFixed(4)} or x = ${root2.toFixed(4)}`,
        steps,
        type: "quadratic",
        exactSolution: [root1, root2]
      }
    } else if (discriminant === 0) {
      const root = -b / (2 * a)
      steps.push({
        title: "Repeated Root",
        content: `x = ${root}`,
        explanation: "The discriminant is zero, so we have one repeated real root."
      })

      return {
        solution: `x = ${root}`,
        steps,
        type: "quadratic",
        exactSolution: [root]
      }
    } else {
      const realPart = -b / (2 * a)
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a)
      
      steps.push({
        title: "Complex Roots",
        content: `x = ${realPart.toFixed(4)} ± ${imaginaryPart.toFixed(4)}i`,
        explanation: "The discriminant is negative, so we have complex roots."
      })

      return {
        solution: `x = ${realPart.toFixed(4)} ± ${imaginaryPart.toFixed(4)}i`,
        steps,
        type: "quadratic"
      }
    }
  }

  function solveSystemOfEquations(eq) {
    const steps = []
    const equations = eq.split(';').map(e => e.trim())
    
    if (equations.length !== 2) {
      return null
    }

    steps.push({
      title: "System of Equations",
      content: equations.join('\n'),
      explanation: "We have a system of two linear equations to solve."
    })

    // Parse both equations
    const eq1 = parseEquation(equations[0])
    const eq2 = parseEquation(equations[1])
    
    if (!eq1 || !eq2) return null

    // Simple 2x2 system (for demonstration with x and y)
    let a1 = 0, b1 = 0, c1 = 0
    let a2 = 0, b2 = 0, c2 = 0

    // Parse first equation: a1x + b1y = c1
    const left1 = eq1.left
    if (left1.includes('x')) {
      const xMatch = left1.match(/([+-]?\d*)x/)
      a1 = xMatch ? (xMatch[1] === '' ? 1 : xMatch[1] === '-' ? -1 : parseFloat(xMatch[1])) : 0
    }
    if (left1.includes('y')) {
      const yMatch = left1.match(/([+-]?\d*)y/)
      b1 = yMatch ? (yMatch[1] === '' ? 1 : yMatch[1] === '-' ? -1 : parseFloat(yMatch[1])) : 0
    }
    c1 = parseFloat(eq1.right)

    // Parse second equation: a2x + b2y = c2
    const left2 = eq2.left
    if (left2.includes('x')) {
      const xMatch = left2.match(/([+-]?\d*)x/)
      a2 = xMatch ? (xMatch[1] === '' ? 1 : xMatch[1] === '-' ? -1 : parseFloat(xMatch[1])) : 0
    }
    if (left2.includes('y')) {
      const yMatch = left2.match(/([+-]?\d*)y/)
      b2 = yMatch ? (yMatch[1] === '' ? 1 : yMatch[1] === '-' ? -1 : parseFloat(yMatch[1])) : 0
    }
    c2 = parseFloat(eq2.right)

    steps.push({
      title: "Extract Coefficients",
      content: `${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
      explanation: "Identify coefficients for each variable in both equations."
    })

    // Solve using elimination
    const determinant = a1 * b2 - a2 * b1
    
    if (determinant !== 0) {
      const x = (c1 * b2 - c2 * b1) / determinant
      const y = (a1 * c2 - a2 * c1) / determinant

      steps.push({
        title: "Calculate Determinant",
        content: `D = a₁b₂ - a₂b₁ = (${a1})(${b2}) - (${a2})(${b1}) = ${determinant}`,
        explanation: "The determinant helps us check if the system has a unique solution."
      })

      steps.push({
        title: "Solve for x",
        content: `x = (c₁b₂ - c₂b₁)/D = (${c1}×${b2} - ${c2}×${b1})/${determinant} = ${x.toFixed(4)}`,
        explanation: "Using Cramer's rule to solve for x."
      })

      steps.push({
        title: "Solve for y",
        content: `y = (a₁c₂ - a₂c₁)/D = (${a1}×${c2} - ${a2}×${c1})/${determinant} = ${y.toFixed(4)}`,
        explanation: "Using Cramer's rule to solve for y."
      })

      return {
        solution: `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`,
        steps,
        type: "system",
        exactSolution: { x, y }
      }
    } else {
      return {
        solution: "No unique solution (dependent or inconsistent system)",
        steps: [...steps, {
          title: "Special Case",
          content: "Determinant = 0",
          explanation: "The system has either no solution or infinitely many solutions."
        }],
        type: "system"
      }
    }
  }

  const solveEquation = async () => {
    if (!equation.trim()) {
      setError('Please enter an equation')
      return
    }

    setIsSolving(true)
    setError('')
    setSolution(null)
    setCurrentStep(0)

    try {
      // Basic validation
      if (!equation.includes('=')) {
        setError('Equation must contain an equals sign (=)')
        return
      }

      if (equation.includes('/0')) {
        setError('Division by zero is not allowed')
        return
      }

      // Determine equation type and use appropriate solver
      let solver = null
      for (const type of equationTypes) {
        if (type.pattern.test(equation)) {
          solver = type.solver
          break
        }
      }

      if (!solver) {
        // Default to linear if no specific pattern matched
        solver = solveLinearEquation
      }

      const result = solver(equation)
      if (result) {
        setSolution(result)
        setHistory(prev => [{
          equation,
          solution: result.solution,
          timestamp: new Date().toLocaleTimeString(),
          type: result.type
        }, ...prev.slice(0, 4)])
      } else {
        setError('Could not solve this equation. Please check the format and try a simpler equation.')
      }
    } catch (err) {
      console.error('Solving error:', err)
      setError('Error solving equation. Please check the format and try again.')
    } finally {
      setIsSolving(false)
    }
  }

  const handleExampleClick = (example) => {
    setEquation(example)
    setShowEquationTypes(false)
  }

  const nextStep = () => {
    if (solution && currentStep < solution.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const clearEquation = () => {
    setEquation('')
    setSolution(null)
    setError('')
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-8 sm:pb-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 pt-6">
          <Link 
            to="/topics/algebra" 
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4 text-sm sm:text-base"
          >
            ← Back to Algebra Topics
          </Link>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-800 mb-3 sm:mb-4">
            🧩 Equation Solver
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Practice solving different types of equations with our interactive step-by-step solver
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
              
              {/* Equation Input */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter Your Equation:
                  </label>
                  <button
                    onClick={clearEquation}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="e.g., 2x + 5 = 13, x^2 - 5x + 6 = 0, 2x + y = 7; x - y = 1"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                    onKeyPress={(e) => e.key === 'Enter' && solveEquation()}
                  />
                  <button
                    onClick={solveEquation}
                    disabled={isSolving}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-w-20"
                  >
                    {isSolving ? '...' : 'Solve'}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Solution Display */}
              {solution && (
                <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-green-800">Solution</h3>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm capitalize">
                      {solution.type}
                    </span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-2xl font-mono bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text font-bold">
                      {solution.solution}
                    </div>
                  </div>

                  {/* Step Navigation */}
                  {solution.steps.length > 1 && (
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          currentStep === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        <span>←</span>
                        <span className="font-medium">Previous</span>
                      </button>

                      <div className="text-sm text-gray-600">
                        Step {currentStep + 1} of {solution.steps.length}
                      </div>

                      <button
                        onClick={nextStep}
                        disabled={currentStep === solution.steps.length - 1}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          currentStep === solution.steps.length - 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        <span className="font-medium">Next</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}

                  {/* Current Step */}
                  {solution.steps[currentStep] && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                        <h4 className="font-bold text-green-800 text-lg mb-2">
                          {solution.steps[currentStep].title}
                        </h4>
                        <div className="font-mono text-gray-700 bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                          {solution.steps[currentStep].content}
                        </div>
                        <p className="text-green-700 leading-relaxed">
                          {solution.steps[currentStep].explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress Dots */}
                  {solution.steps.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-6">
                      {solution.steps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentStep 
                              ? 'bg-green-500 scale-125' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Equation Types - Collapsible */}
              <div className="mb-8">
                <button
                  onClick={() => setShowEquationTypes(!showEquationTypes)}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 text-lg">📚 Supported Equation Types & Examples</h3>
                  <span className={`transform transition-transform ${showEquationTypes ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {showEquationTypes && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    {equationTypes.map((type, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">{type.name}</h4>
                        <div className="space-y-1">
                          {type.examples.map((example, exIndex) => (
                            <button
                              key={exIndex}
                              onClick={() => handleExampleClick(example)}
                              className="block w-full text-left text-sm text-purple-600 hover:text-purple-700 hover:underline py-1"
                            >
                              {example}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* History */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Recent Solutions</h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">Your solved equations will appear here</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs capitalize">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm font-mono text-gray-700 mb-1 truncate">
                        {item.equation}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 text-lg">💡 Solving Tips</h3>
              <div className="space-y-3 text-sm text-blue-700">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Always include an equals sign (=)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use x^2 for quadratic equations</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>For systems, separate equations with semicolon (;)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Use parentheses for complex expressions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Start with simple examples to test</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            🎯 Practice Problems
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { problem: "3x - 7 = 14", difficulty: "Easy" },
              { problem: "x^2 - 5x + 6 = 0", difficulty: "Medium" },
              { problem: "2(x + 3) = 16", difficulty: "Easy" },
              { problem: "2x + y = 7; x - y = 1", difficulty: "Hard" }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                <div className="font-mono text-gray-700 mb-2 text-sm">{item.problem}</div>
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  item.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                  item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {item.difficulty}
                </span>
                <button
                  onClick={() => handleExampleClick(item.problem)}
                  className="block w-full mt-3 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                >
                  Try This
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}