import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Community() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => { setIsLoaded(true) }, [])

  const whatsappLink = "https://chat.whatsapp.com/LPoXBwl6Y9ZDkyYPcHvKbx?mode=hqrt3"

  const youtubeChannels = [
    {
      name: 'Igboya Math Official',
      description: 'Official YouTube channel with video lessons',
      subscribers: '1.2K subscribers',
      link: 'https://youtube.com/c/your-channel',
    },
    {
      name: 'Math Concepts Explained',
      description: 'Detailed explanations of complex topics',
      subscribers: '850+ subscribers',
      link: 'https://youtube.com/c/math-concepts',
    }
  ]

  const communityFeatures = [
    { title: "Instant Help", description: "Get quick answers from fellow learners", icon: "⚡", delay: 100 },
    { title: "Live Discussions", description: "Participate in real-time problem solving", icon: "💬", delay: 200 },
    { title: "Resource Sharing", description: "Share and discover helpful materials", icon: "📁", delay: 300 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-24 overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl text-white text-4xl shadow-xl border-4 border-white/30 animate-bounce-slow">
              👥
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold animate-ping opacity-75">NEW</div>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Math Community Hub
          </h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto animate-text-fade">
            Connect, learn, and grow together with fellow math enthusiasts.
          </p>
        </div>

        {/* WhatsApp Group */}
        <div className={`relative mb-12 transform transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          onMouseEnter={() => setHoveredCard('whatsapp')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-xl transition-all duration-500 ${hoveredCard === 'whatsapp' ? 'opacity-50 scale-105' : 'opacity-30'}`}></div>
          <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50 overflow-hidden group hover:shadow-3xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row items-center md:space-x-6">
              <div className="flex-shrink-0 relative mb-4 md:mb-0">
                <div className="absolute inset-0 bg-green-400 rounded-2xl blur-md animate-pulse"></div>
                <div className="relative w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center text-white text-3xl transform group-hover:scale-110 transition-transform duration-300">
                  💬
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">WhatsApp Study Group</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Get instant help with math problems, participate in discussions, share resources, and connect with fellow learners in real-time.
                </p>
                <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-4 py-2 mb-4 animate-float">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-700 font-medium">250+ Active Members Online</span>
                </div>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-auto">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-4 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-xl">💬</span>
                      <span className="text-white font-bold text-lg">Join WhatsApp Group</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Community Features */}
        <div className={`mb-12 transform transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-2xl font-bold text-gray-700 mb-8 text-center">Why Join Our Community?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityFeatures.map((feature, index) => (
              <div key={index} className="relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube Channels */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-12 border border-white/50 transform transition-all duration-700 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">YouTube Channels</h2>
          <p className="text-gray-600 text-sm mb-6">Watch video lessons and tutorials</p>
          <div className="space-y-4">
            {youtubeChannels.map((channel, index) => (
              <a key={index} href={channel.link} target="_blank" rel="noopener noreferrer"
                 className="group relative flex items-center space-x-4 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all duration-300 border border-red-200 hover:border-red-300 transform hover:-translate-y-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm">{channel.name}</h3>
                  <p className="text-gray-600 text-xs">{channel.description}</p>
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full mt-1">{channel.subscribers}</span>
                </div>
                <div className="text-red-500 transform group-hover:translate-x-2 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}