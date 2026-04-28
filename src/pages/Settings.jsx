import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Settings({ user, onLogout }) {
  const [theme, setTheme] = useState('light')

  const settingsSections = [
    {
      title: 'Account',
      icon: '👤',
      items: [
        { label: 'Profile Information', description: 'Update your name and email', icon: '📝', action: () => {} },
        { label: 'Learning Preferences', description: 'Customize your learning experience', icon: '🎯', action: () => {} },
        { label: 'Notification Settings', description: 'Manage app notifications', icon: '🔔', action: () => {} }
      ]
    },
    {
      title: 'App',
      icon: '⚙️',
      items: [
        { label: 'Theme', description: 'Light or Dark mode', icon: '🎨', action: () => setTheme(theme === 'light' ? 'dark' : 'light') },
        { label: 'Language', description: 'App language settings', icon: '🌐', action: () => {} },
        { label: 'Data Usage', description: 'Manage storage and data', icon: '💾', action: () => {} }
      ]
    },
    {
      title: 'Support',
      icon: '🆘',
      items: [
        { label: 'Help & FAQ', description: 'Get help with the app', icon: '❓', action: () => {} },
        { label: 'Contact Support', description: 'Reach out to our team', icon: '📧', action: () => {} },
        { label: 'About Igboya', description: 'App version and info', icon: 'ℹ️', action: () => {} }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pb-24 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100/20 via-transparent to-purple-100/20"></div>

      <div className="relative max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl text-white text-3xl mb-4 shadow-lg border border-white/20 animate-pulse">
            ⚙️
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Manage your account, app preferences, and learning settings
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/30 flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border border-white/20 animate-bounce">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-600 text-sm">{user?.email}</p>
            <div className="flex justify-center md:justify-start items-center space-x-2 mt-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full animate-pulse">
                Math Learner
              </span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full animate-pulse">
                3 day streak
              </span>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/30 hover:shadow-3xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-600 rounded-3xl flex items-center justify-center text-white text-lg">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full flex items-center space-x-4 p-3 rounded-2xl hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 text-left shadow-sm"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-blue-600 text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">{item.label}</h3>
                      <p className="text-gray-600 text-xs md:text-sm">{item.description}</p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-white/30 hover:shadow-3xl transition-shadow duration-300">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-3 p-4 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition-all font-medium shadow-lg transform hover:-translate-y-1 hover:scale-[1.02]"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm md:text-base">Igboya Math App v1.0.0</p>
        </div>
      </div>
    </div>
  )
}