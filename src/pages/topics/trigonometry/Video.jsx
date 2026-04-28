import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function TrigonometryVideoLessons() {
  const [selectedCategory, setSelectedCategory] = useState('english')
  const [selectedVideo, setSelectedVideo] = useState(0)
  const videoRef = useRef(null)

  const videoCategories = {
    english: {
      name: "English Version",
      description: "Clear explanations in English from expert instructors",
      icon: "🇬🇧",
      videos: [
        {
          id: 1,
          title: "Introduction to Trigonometric Ratios",
          description: "Learn the fundamental trigonometric ratios - sine, cosine, and tangent with clear examples and right triangle applications.",
          youtubeId: "Jsiy4TxgIME",
          duration: "16:45",
          instructor: "Dr. Sarah Johnson",
          level: "Beginner"
        },
        {
          id: 2,
          title: "Mastering the Unit Circle",
          description: "Understand the unit circle and how it relates to trigonometric functions. Learn to find exact values for all angles.",
          youtubeId: "cIVpemcoAlY",
          duration: "20:15",
          instructor: "Prof. Michael Chen",
          level: "Intermediate"
        }
      ]
    },
    yorubaEnglish: {
      name: "Yoruba & English Mixed",
      description: "Bilingual explanations combining Yoruba and English for better understanding",
      icon: "🌍",
      videos: [
        {
          id: 1,
          title: "Ìṣírò Trigonometry - Ìbẹ̀rẹ̀ Pẹ̀pẹ̀",
          description: "Kọ́ ọ́ nípa ìṣírò trigonometry - sine, cosine, àti tangent pẹ̀lú àpẹrẹ tó yẹ́rí yẹ́rí nínú àwọn onígun mẹ́tà.",
          youtubeId: "Y1YZWQ7j_cE",
          duration: "17:20",
          instructor: "Alaga Akowe Bola",
          level: "Beginner"
        }
      ]
    }
  }

  const currentCategory = videoCategories[selectedCategory]
  const currentVideo = currentCategory.videos[selectedVideo]

  const handleVideoSelect = (index) => {
    setSelectedVideo(index)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedVideo(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-8 sm:pb-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <Link 
            to="/topics/trigonometry" 
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4 text-sm"
          >
            ← Back to Trigonometry
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            🎥 Trigonometry Video Lessons
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master triangles, angles, and trigonometric functions with expert video explanations
          </p>
        </div>

        {/* Category Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-xl shadow-lg p-1 inline-flex">
            {Object.entries(videoCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  selectedCategory === key
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {key === 'english' ? 'English' : 'Bilingual'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* Main Video Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">

              {/* Video Player */}
              <div className="mb-4">
                <div className="bg-black rounded-xl overflow-hidden aspect-video mb-4">
                  <iframe
                    ref={videoRef}
                    src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=0&rel=0`}
                    title={currentVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Video Info */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    {currentVideo.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                      {currentVideo.level}
                    </span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                      {currentVideo.duration}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {currentVideo.instructor}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {currentVideo.description}
                  </p>
                </div>
              </div>

              {/* Video Navigation */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <button
                  onClick={() => handleVideoSelect(Math.max(0, selectedVideo - 1))}
                  disabled={selectedVideo === 0}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                    selectedVideo === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <span>←</span>
                  <span>Prev</span>
                </button>

                <div className="text-sm text-gray-600">
                  {selectedVideo + 1} / {currentCategory.videos.length}
                </div>

                <button
                  onClick={() => handleVideoSelect(Math.min(currentCategory.videos.length - 1, selectedVideo + 1))}
                  disabled={selectedVideo === currentCategory.videos.length - 1}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-sm ${
                    selectedVideo === currentCategory.videos.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Video List */}
            <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Video Lessons</h3>
                <span className="text-sm text-gray-500">
                  {currentCategory.videos.length} videos
                </span>
              </div>
              <div className="space-y-2">
                {currentCategory.videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => handleVideoSelect(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedVideo === index
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        selectedVideo === index
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm truncate">
                          {video.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span>{video.duration}</span>
                          <span>•</span>
                          <span>{video.level}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}