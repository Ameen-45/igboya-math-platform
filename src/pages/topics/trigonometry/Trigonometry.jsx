import { Link } from 'react-router-dom'

export default function Trigonometry() {
  const sections = [
    {
      icon: 'θ',
      title: 'Introduction',
      description: 'Understand angles, triangles, and the fundamentals of trigonometric functions.',
      path: '/topics/trigonometry/introduction'
    },
    {
      icon: '△',
      title: 'Examples',
      description: 'Step-by-step solutions for trigonometric equations and identities.',
      path: '/topics/trigonometry/examples'
    },
    {
      icon: '📐',
      title: 'Triangle Solver',
      description: 'Solve triangles using sine, cosine, tangent, and the laws of trig.',
      path: '/topics/trigonometry/triangle-solver'
    },
    {
      icon: '📝',
      title: 'Quiz',
      description: 'Test your understanding of trigonometric ratios and identities.',
      path: '/topics/trigonometry/quiz'
    },
    {
      icon: '🔄',
      title: 'Practice',
      description: 'Practice trig problems with guided hints and detailed explanations.',
      path: '/topics/trigonometry/interactive-practice'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl text-white text-3xl shadow-lg mb-6">
          θ
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          Trigonometry
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Master angles, triangles, and periodic functions. Understand sine, cosine, and tangent relationships with confidence.
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-10">
        <Link to="/dashboard" className="hover:text-red-600 transition">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <Link to="/topics" className="hover:text-red-600 transition">
          Topics
        </Link>
        <span className="mx-2">›</span>
        <span className="text-red-600 font-medium">
          Trigonometry
        </span>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, index) => (
          <Link
            key={index}
            to={section.path}
            className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="text-4xl mb-4">
              {section.icon}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
              {section.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {section.description}
            </p>

            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 rounded-xl text-center font-medium group-hover:scale-105 transition-transform">
              Start Learning →
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Section */}
      <div className="mt-16 bg-gradient-to-r from-rose-500 to-red-600 rounded-3xl p-8 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-3 text-center">
          Your Trigonometry Progress
        </h3>

        <p className="text-red-100 text-center mb-6">
          Complete all sections to master trigonometric concepts.
        </p>

        <div className="w-full bg-white/30 rounded-full h-4 mb-3">
          <div className="bg-white h-4 rounded-full w-1/6 transition-all duration-700"></div>
        </div>

        <div className="text-center text-sm text-red-200">
          15% Complete
        </div>
      </div>

    </div>
  )
}