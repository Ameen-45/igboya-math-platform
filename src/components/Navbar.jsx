import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/topics', label: 'Topics', icon: '📚' },
    { path: '/community', label: 'Community', icon: '👥' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                ∫
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-bold text-gray-800">IGBOYA</h1>
                <p className="text-xs text-gray-500 -mt-1">Math Learning</p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center bg-gray-100/60 backdrop-blur-md rounded-2xl p-1 relative">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md transition-all duration-300" />
                    )}

                    <span className="relative z-10">{item.icon}</span>
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`h-0.5 w-5 bg-gray-700 transition ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`} />
                <span className={`h-0.5 w-5 bg-gray-700 transition ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`h-0.5 w-5 bg-gray-700 transition ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* BACKDROP */}
        <div
          onClick={toggleMobileMenu}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* PANEL */}
        <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl flex flex-col">

          {/* HEADER */}
          <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">IGBOYA</h2>
                <p className="text-sm text-white/80">Hello, {user?.name || "Student"}</p>
              </div>

              <button onClick={toggleMobileMenu}>
                ✕
              </button>
            </div>
          </div>

          {/* NAV ITEMS */}
          <div className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* LOGOUT */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}