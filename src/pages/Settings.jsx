import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Settings({ user, onLogout }) {
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('english')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    setShowConfirmLogout(true)
  }

  const confirmLogout = () => {
    onLogout()
  }

  const cancelLogout = () => {
    setShowConfirmLogout(false)
  }

  // Get streak from localStorage
  const stats = JSON.parse(localStorage.getItem('mathGeniusStats')) || {}
  const streak = stats.streak || 0

  const settingsSections = [
    {
      title: 'Profile',
      icon: '👤',
      gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      items: [
        { 
          label: 'Profile Information', 
          description: 'Update your name and email', 
          icon: '📝',
          value: user?.name,
          action: () => {}
        },
        { 
          label: 'Learning Preferences', 
          description: 'Customize your learning experience', 
          icon: '🎯',
          value: 'Intermediate',
          action: () => {}
        }
      ]
    },
    {
      title: 'Preferences',
      icon: '⚙️',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      items: [
        { 
          label: 'Theme', 
          description: 'Light or Dark mode', 
          icon: '🎨',
          value: theme === 'light' ? 'Light Mode' : 'Dark Mode',
          action: () => setTheme(theme === 'light' ? 'dark' : 'light')
        },
        { 
          label: 'Language', 
          description: 'App language settings', 
          icon: '🌐',
          value: language === 'english' ? 'English' : 'Yoruba',
          action: () => setLanguage(language === 'english' ? 'yoruba' : 'english')
        }
      ]
    },
    {
      title: 'Notifications',
      icon: '🔔',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      items: [
        { 
          label: 'Push Notifications', 
          description: 'Get daily reminders and updates', 
          icon: '📱',
          value: notificationsEnabled ? 'On' : 'Off',
          action: () => setNotificationsEnabled(!notificationsEnabled)
        },
        { 
          label: 'Email Updates', 
          description: 'Receive learning tips and progress reports', 
          icon: '📧',
          value: emailNotifications ? 'On' : 'Off',
          action: () => setEmailNotifications(!emailNotifications)
        }
      ]
    },
    {
      title: 'Support',
      icon: '🆘',
      gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
      items: [
        { 
          label: 'Help & FAQ', 
          description: 'Get help with the app', 
          icon: '❓',
          value: 'Learn More',
          action: () => {}
        },
        { 
          label: 'Contact Support', 
          description: 'Reach out to our team', 
          icon: '📧',
          value: 'support@igboya.com',
          action: () => {}
        },
        { 
          label: 'About IGBOYA', 
          description: 'App version and info', 
          icon: 'ℹ️',
          value: 'v1.0.0',
          action: () => {}
        }
      ]
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '20px' : '32px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Subtle Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '32px' : '40px'
        }}>
          <div style={{
            display: 'inline-block',
            marginBottom: isMobile ? '16px' : '20px'
          }}>
            <div style={{
              position: 'relative',
              display: 'inline-block'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-20px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                opacity: 0.2
              }}></div>
              <div style={{
                width: isMobile ? '70px' : '80px',
                height: isMobile ? '70px' : '80px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.3)'
              }}>
                <span style={{ fontSize: isMobile ? '32px' : '36px' }}>⚙️</span>
              </div>
            </div>
          </div>
          <h1 style={{
            fontSize: isMobile ? '32px' : '40px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            Settings
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#64748B'
          }}>
            Manage your account preferences and learning experience
          </p>
        </div>

        {/* User Profile Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: isMobile ? '20px' : '24px',
          marginBottom: isMobile ? '20px' : '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: isMobile ? '16px' : '20px'
          }}>
            <div style={{
              width: isMobile ? '70px' : '80px',
              height: isMobile ? '70px' : '80px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '32px' : '36px',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
              <h2 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '700',
                color: '#0F172A',
                marginBottom: '4px'
              }}>
                {user?.name || user?.email?.split('@')[0] || 'Student'}
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#64748B',
                marginBottom: '12px'
              }}>
                {user?.email || 'student@example.com'}
              </p>
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
                <span style={{
                  fontSize: '11px',
                  background: '#EEF2FF',
                  color: '#6366F1',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontWeight: '500'
                }}>
                  🔥 {streak} day streak
                </span>
                <span style={{
                  fontSize: '11px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontWeight: '500'
                }}>
                  ⭐ Math Learner
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '16px' : '20px',
          marginBottom: isMobile ? '20px' : '24px'
        }}>
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{
              background: 'white',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              transition: 'box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              
              {/* Section Header */}
              <div style={{
                padding: isMobile ? '16px 20px' : '20px 24px',
                borderBottom: '1px solid #E2E8F0',
                background: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: section.gradient,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: '600',
                      color: '#0F172A'
                    }}>
                      {section.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Section Items */}
              <div>
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: isMobile ? '16px 20px' : '18px 24px',
                      borderBottom: itemIndex !== section.items.length - 1 ? '1px solid #F1F5F9' : 'none',
                      transition: 'all 0.2s ease',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#F1F5F9',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <h3 style={{
                          fontSize: isMobile ? '14px' : '15px',
                          fontWeight: '600',
                          color: '#0F172A',
                          marginBottom: '2px'
                        }}>
                          {item.label}
                        </h3>
                        <p style={{
                          fontSize: '12px',
                          color: '#64748B'
                        }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#6366F1',
                        fontWeight: '500'
                      }}>
                        {item.value}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          marginBottom: isMobile ? '16px' : '20px'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: isMobile ? '16px' : '18px',
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#EF4444',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '16px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Confirm Logout Modal */}
        {showConfirmLogout && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: isMobile ? '24px' : '32px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚪</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                Logout?
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                Are you sure you want to logout? You can always come back to continue learning.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={cancelLogout}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#F1F5F9',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#64748B',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#E2E8F0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#F1F5F9'}>
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#EF4444',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#EF4444'}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* App Version */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '12px',
            color: '#94A3B8'
          }}>
            IGBOYA Math Platform v1.0.0
          </p>
        </div>
      </div>
    </div>
  )
}