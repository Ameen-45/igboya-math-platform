import { Link } from 'react-router-dom'

export default function Statistics() {
  const sections = [
    {
      icon: '📈',
      title: 'Introduction',
      description: 'Understand the foundations of statistics, probability, and data interpretation.',
      path: '/topics/statistics/introduction'
    },
    {
      icon: '📉',
      title: 'Examples',
      description: 'Explore step-by-step statistical problems and probability calculations.',
      path: '/topics/statistics/examples'
    },
    {
      icon: '🧪',
      title: 'Data Analyzer',
      description: 'Work with datasets and calculate mean, median, variance, and more.',
      path: '/topics/statistics/data-analyzer'
    },
    {
      icon: '📝',
      title: 'Quiz',
      description: 'Test your understanding of statistics and probability concepts.',
      path: '/topics/statistics/quiz'
    },
    {
      icon: '🔄',
      title: 'Practice',
      description: 'Practice real-world statistical scenarios and data problems.',
      path: '/topics/statistics/practice'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl text-white text-3xl shadow-lg mb-6">
          📊
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          Statistics
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Analyze data, understand probability, and master statistical methods used in real-world decision making.
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-10">
        <Link to="/dashboard" className="hover:text-orange-600 transition">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <Link to="/topics" className="hover:text-orange-600 transition">
          Topics
        </Link>
        <span className="mx-2">›</span>
        <span className="text-orange-600 font-medium">
          Statistics
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

            <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
              {section.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {section.description}
            </p>

            <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-2 px-4 rounded-xl text-center font-medium group-hover:scale-105 transition-transform">
              Start Learning →
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Section */}
      <div className="mt-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl">
        <h3 className="text-2xl font-bold mb-3 text-center">
          Your Statistics Progress
        </h3>

        <p className="text-orange-100 text-center mb-6">
          Complete all sections to master statistical thinking.
        </p>

        <div className="w-full bg-white/30 rounded-full h-4 mb-3">
          <div className="bg-white h-4 rounded-full w-1/5 transition-all duration-700"></div>
        </div>

        <div className="text-center text-sm text-orange-200">
          20% Complete
        </div>
      </div>

    </div>
  )
}