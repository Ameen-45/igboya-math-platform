import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/topics', label: 'Topics', icon: '📚' },
    { path: '/community', label: 'Community', icon: '👥' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ]

  const handleLogout = () => {
    // Clear all user data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("mathGeniusStats");
    localStorage.removeItem("topicProgress");
    localStorage.removeItem("dailyTasks");
    localStorage.removeItem("recentActivity");
    
    // Call parent logout if exists
    if (onLogout) onLogout();
    
    // Navigate to auth page
    navigate("/auth");
    setIsMobileMenuOpen(false);
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = 'unset'
  }, [location])

  // Don't show navbar on splash and auth pages
  if (location.pathname === '/splash' || location.pathname === '/auth') {
    return null
  }

  return (
    <>
      {/* NAVBAR */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.98)',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid #F1F5F9',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: 'clamp(16px, 5vw, 24px)',
          paddingRight: 'clamp(16px, 5vw, 24px)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 'clamp(60px, 8vh, 72px)'
          }}>

            {/* LOGO */}
            <Link to="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{
                width: 'clamp(36px, 8vw, 40px)',
                height: 'clamp(36px, 8vw, 40px)',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                borderRadius: 'clamp(12px, 3vw, 14px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}>
                <span style={{
                  fontSize: 'clamp(20px, 5vw, 22px)',
                  fontWeight: 'bold',
                  color: 'white'
                }}>∫</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  fontWeight: '700',
                  color: '#0F172A',
                  margin: 0,
                  lineHeight: 1.2
                }}>IGBOYA</h1>
                <p style={{
                  fontSize: 'clamp(9px, 3vw, 10px)',
                  color: '#64748B',
                  margin: 0
                }}>Math Learning</p>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#F8FAFC',
              borderRadius: '16px',
              padding: '4px'
            }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '12px',
                      fontSize: 'clamp(13px, 3.5vw, 14px)',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isActive ? 'white' : 'transparent',
                      color: isActive ? '#6366F1' : '#64748B',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#F1F5F9'
                        e.currentTarget.style.color = '#334155'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#64748B'
                      }
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* USER MENU & MOBILE BUTTON */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Desktop User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '6px 16px 6px 12px',
                background: '#F8FAFC',
                borderRadius: '40px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: 'white'
                }}>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'S'}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>
                  {user?.name || user?.email?.split('@')[0] || 'Student'}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  Logout
                </button>
              </div>

              {/* MOBILE MENU BUTTON */}
              <button
                onClick={toggleMobileMenu}
                style={{
                  display: 'none',
                  padding: '8px',
                  borderRadius: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{
                    width: '20px',
                    height: '2px',
                    background: '#334155',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease',
                    transform: isMobileMenuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none'
                  }} />
                  <span style={{
                    width: '20px',
                    height: '2px',
                    background: '#334155',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease',
                    opacity: isMobileMenuOpen ? 0 : 1
                  }} />
                  <span style={{
                    width: '20px',
                    height: '2px',
                    background: '#334155',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease',
                    transform: isMobileMenuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none'
                  }} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Backdrop */}
          <div
            onClick={toggleMobileMenu}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Menu Panel */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 'min(80%, 320px)',
            background: 'white',
            boxShadow: '-8px 0 20px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    ∫
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>IGBOYA</h2>
                    <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>Math Learning</p>
                  </div>
                </div>
                <button
                  onClick={toggleMobileMenu}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                marginTop: '8px'
              }}>
                <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>Welcome back,</p>
                <p style={{ fontSize: '15px', fontWeight: '600', margin: '4px 0 0 0' }}>{user?.name || 'Student'} 👋</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      background: isActive ? '#EEF2FF' : 'transparent',
                      color: isActive ? '#6366F1' : '#475569'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = '#F8FAFC'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Logout Button */}
            <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#FEE2E2',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#EF4444',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#FECACA'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FEE2E2'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          
          @media (max-width: 768px) {
            button {
              display: flex !important;
            }
          }
        `}
      </style>
    </>
  )
}