import { Link } from "react-router-dom";

export default function Topics() {
  const topics = [
    {
      icon: "🧮",
      title: "Algebra",
      description: "Equations, functions, graphs & variables",
      color: "from-blue-500/90 to-blue-700/90",
      path: "/topics/algebra",
      progress: 65,
    },
    {
      icon: "📐",
      title: "Geometry",
      description: "Shapes, angles & theorems",
      color: "from-purple-500/90 to-purple-700/90",
      path: "#",
      progress: 0,
      comingSoon: true,
    },
    {
      icon: "📊",
      title: "Statistics",
      description: "Data analysis, charts & probability",
      color: "from-orange-500/90 to-orange-700/90",
      path: "/topics/statistics",
      progress: 10,
    },
    {
      icon: "📉",
      title: "Calculus",
      description: "Limits, derivatives & integrals",
      color: "from-green-500/90 to-green-700/90",
      path: "#",
      progress: 0,
      comingSoon: true,
    },
    {
      icon: "θ",
      title: "Trigonometry",
      description: "Angles, triangles, and periodic functions",
      color: "from-red-500/90 to-red-700/90",
      path: "/topics/trigonometry",
      progress: 5,
    },
  ];

  const revisionMaterials = [
    {
      title: "MPT – General Mathematics",
      file: `${import.meta.env.BASE_URL}revision/MPT.pdf`,
    },
  ];

  return (
    <div className="min-h-screen bg-sky-200 pb-24">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="text-center mb-10 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl text-white text-4xl mb-4 shadow-xl border border-white/30">
            📚
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-wide drop-shadow">
            Explore Topics
          </h1>
          <p className="text-gray-700 text-lg md:text-xl drop-shadow">
            Select a subject to start learning
          </p>
        </div>

        {/* TOPICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
          {topics.map((topic, index) => (
            <Link
              key={index}
              to={topic.comingSoon ? "#" : topic.path}
              className={`relative rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-[1.04] active:scale-95 transition-all bg-gradient-to-br ${topic.color} backdrop-blur-md text-white border border-white/20 overflow-hidden`}
            >
              {/* Overlay for subtle hover effect */}
              <div className="absolute inset-0 bg-white/5 rounded-3xl pointer-events-none"></div>

              <div className="relative flex items-center justify-between mb-4">
                <div className="text-4xl">{topic.icon}</div>
                {topic.comingSoon ? (
                  <div className="text-xs bg-white/30 px-3 py-1 rounded-full">
                    0%
                  </div>
                ) : (
                  <div className="text-sm bg-white/30 px-3 py-1 rounded-full">
                    {topic.progress}%
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-2 relative">{topic.title}</h3>
              <p className="text-white/90 text-sm mb-3 relative">{topic.description}</p>

              {!topic.comingSoon && (
                <div className="flex items-center space-x-2 relative">
                  <div className="flex-1 bg-white/30 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${topic.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-white/80">
                    {topic.progress}% complete
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* GENERAL REVISION CENTER */}
        <div className="mt-14 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all animate-slideUp">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            🔄 General Revision Center
          </h2>

          <p className="text-gray-700 mb-4 md:text-lg">
            Download general mathematics question packs to practice and prepare for any exam.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {revisionMaterials.map((rev, i) => (
              <a
                key={i}
                href={rev.file}
                download
                className="block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 rounded-xl shadow hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all text-center font-semibold"
              >
                📥 {rev.title}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}