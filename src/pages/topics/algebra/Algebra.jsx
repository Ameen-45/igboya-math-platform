import { Link } from 'react-router-dom'

export default function Algebra() {
  const sections = [
    {
      icon: '📖',
      title: 'Introduction',
      description: 'Learn the fundamentals of algebra including variables, expressions, and equations.',
      path: '/topics/algebra/introduction'
    },
    {
      icon: '🔍',
      title: 'Examples',
      description: 'Explore step-by-step solved examples to strengthen your understanding.',
      path: '/topics/algebra/examples'
    },
    {
      icon: '🧩',
      title: 'Equation Solver',
      description: 'Solve equations interactively and practice different algebraic problems.',
      path: '/topics/algebra/solver'
    },
    {
      icon: '📝',
      title: 'Quiz',
      description: 'Test your knowledge with interactive quizzes and instant feedback.',
      path: '/topics/algebra/quiz'
    },
    {
      icon: '🔄',
      title: 'Practice',
      description: 'Hands-on practice problems with guided hints and solutions.',
      path: '/topics/algebra/practice'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl text-white text-3xl shadow-lg mb-6">
          🧮
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          Algebra
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Master equations, functions, and variables. Develop strong problem-solving skills and mathematical reasoning.
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-10">
        <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
        <span className="mx-2">›</span>
        <span className="hover:text-blue-600 cursor-pointer">Topics</span>
        <span className="mx-2">›</span>
        <span className="text-blue-600 font-medium">Algebra</span>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, index) => (
          <Link
            key={index}
            to={section.path}
            className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="text-4xl mb-4">{section.icon}</div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              {section.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {section.description}
            </p>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-xl text-center font-medium group-hover:scale-105 transition-transform">
              Start Learning →
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Section */}
      <div className="mt-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-3 text-center">
          Your Algebra Progress
        </h3>
        <p className="text-blue-100 text-center mb-6">
          Complete all sections to fully master algebra fundamentals.
        </p>

        <div className="w-full bg-white/30 rounded-full h-4 mb-3">
          <div className="bg-white h-4 rounded-full w-1/4 transition-all duration-700"></div>
        </div>

        <div className="text-center text-sm text-blue-200">
          25% Complete
        </div>
      </div>
    </div>
  )
}