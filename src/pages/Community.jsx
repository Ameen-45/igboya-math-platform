import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Community() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    setIsLoaded(true)
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const whatsappLink = "https://chat.whatsapp.com/LPoXBwl6Y9ZDkyYPcHvKbx"

  const youtubeChannels = [
    {
      name: 'IGBOYA Math Official',
      description: 'Complete video lessons and tutorials',
      subscribers: '2.5K+ subscribers',
      videos: '120+ videos',
      link: 'https://youtube.com/@igboyamath',
      color: '#EF4444'
    },
    {
      name: 'Math Concepts Explained',
      description: 'Deep dive into complex topics',
      subscribers: '1.8K+ subscribers',
      videos: '85+ videos',
      link: 'https://youtube.com/@mathconcepts',
      color: '#DC2626'
    },
    {
      name: 'Problem Solving Hub',
      description: 'Step-by-step solutions to problems',
      subscribers: '950+ subscribers',
      videos: '64+ videos',
      link: 'https://youtube.com/@problemsolving',
      color: '#B91C1C'
    }
  ]

  const communityFeatures = [
    { title: "Instant Help", description: "Get quick answers from fellow learners", icon: "⚡", delay: 100, color: "#F59E0B" },
    { title: "Live Discussions", description: "Participate in real-time problem solving", icon: "💬", delay: 200, color: "#10B981" },
    { title: "Resource Sharing", description: "Share and discover helpful materials", icon: "📁", delay: 300, color: "#6366F1" },
    { title: "Study Groups", description: "Form groups for collaborative learning", icon: "👥", delay: 400, color: "#8B5CF6" }
  ]

  const upcomingEvents = [
    { name: "Algebra Masterclass", date: "Every Monday", time: "6:00 PM", attendees: 45 },
    { name: "Calculus Study Group", date: "Every Wednesday", time: "7:00 PM", attendees: 32 },
    { name: "Problem Solving Session", date: "Every Friday", time: "5:00 PM", attendees: 28 }
  ]

  const stats = [
    { label: "Active Members", value: "1,250+", icon: "👥", color: "#6366F1" },
    { label: "Messages Sent", value: "15.2K+", icon: "💬", color: "#10B981" },
    { label: "Problems Solved", value: "3.8K+", icon: "✅", color: "#F59E0B" },
    { label: "Resources Shared", value: "450+", icon: "📚", color: "#8B5CF6" }
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: isMobile ? '32px' : '48px'
        }}>
          <div style={{
            display: 'inline-block',
            marginBottom: isMobile ? '16px' : '24px'
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
                <span style={{ fontSize: isMobile ? '32px' : '36px' }}>👥</span>
              </div>
            </div>
          </div>
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}>
            Community Hub
          </h1>
          <p style={{
            fontSize: isMobile ? '15px' : '18px',
            color: '#64748B',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Connect, learn, and grow together with fellow mathematics enthusiasts
          </p>
        </div>

        {/* Community Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '12px' : '20px',
          marginBottom: isMobile ? '32px' : '48px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '16px',
              padding: isMobile ? '16px' : '20px',
              textAlign: 'center',
              border: '1px solid #E2E8F0',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}>
              <div style={{ fontSize: isMobile ? '28px' : '32px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* WhatsApp Group Card */}
        <div style={{
          marginBottom: isMobile ? '32px' : '48px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={() => setHoveredCard('whatsapp')}
          onMouseLeave={() => setHoveredCard(null)}>
            <div style={{
              padding: isMobile ? '24px' : '32px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '20px' : '24px'
              }}>
                <div style={{
                  width: isMobile ? '60px' : '70px',
                  height: isMobile ? '60px' : '70px',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '28px' : '32px',
                  flexShrink: 0
                }}>
                  💬
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: isMobile ? '22px' : '28px',
                    fontWeight: '700',
                    color: '#0F172A',
                    marginBottom: '8px'
                  }}>
                    WhatsApp Study Group
                  </h2>
                  <p style={{
                    color: '#64748B',
                    fontSize: isMobile ? '13px' : '15px',
                    marginBottom: '12px',
                    lineHeight: '1.5'
                  }}>
                    Get instant help with math problems, participate in discussions, share resources, 
                    and connect with fellow learners in real-time.
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#ECFDF5',
                      padding: '6px 12px',
                      borderRadius: '9999px'
                    }}>
                      <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></span>
                      <span style={{ fontSize: '12px', color: '#065F46', fontWeight: '500' }}>250+ Active Members</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#FEF3C7',
                      padding: '6px 12px',
                      borderRadius: '9999px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#92400E', fontWeight: '500' }}>⏱️ 24/7 Support</span>
                    </div>
                  </div>
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: 'white',
                      padding: isMobile ? '12px 24px' : '14px 32px',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: isMobile ? '14px' : '15px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px -8px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    💬 Join WhatsApp Group →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Features & YouTube Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '20px' : '24px',
          marginBottom: isMobile ? '32px' : '48px'
        }}>
          
          {/* Community Features */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: isMobile ? '20px' : '24px',
            border: '1px solid #E2E8F0'
          }}>
            <h3 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '20px'
            }}>
              🌟 Why Join Our Community?
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {communityFeatures.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}25)`,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px'
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#0F172A', marginBottom: '4px', fontSize: '14px' }}>{feature.title}</h4>
                    <p style={{ fontSize: '12px', color: '#64748B' }}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: isMobile ? '20px' : '24px',
            border: '1px solid #E2E8F0'
          }}>
            <h3 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '20px'
            }}>
              📅 Upcoming Events
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {upcomingEvents.map((event, index) => (
                <div key={index} style={{
                  padding: '14px',
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ fontWeight: '600', color: '#0F172A', fontSize: '14px' }}>{event.name}</h4>
                    <span style={{ fontSize: '11px', color: '#6366F1', background: '#EEF2FF', padding: '4px 8px', borderRadius: '8px' }}>
                      👥 {event.attendees} attending
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748B' }}>
                    <span>📅 {event.date}</span>
                    <span>⏰ {event.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button style={{
              width: '100%',
              marginTop: '16px',
              padding: '10px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              color: '#6366F1',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#EEF2FF';
              e.currentTarget.style.borderColor = '#C7D2FE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}>
              View All Events →
            </button>
          </div>
        </div>

        {/* YouTube Channels */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: isMobile ? '20px' : '24px',
          border: '1px solid #E2E8F0',
          marginBottom: isMobile ? '24px' : '32px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              color: '#0F172A',
              marginBottom: '4px'
            }}>
              📺 YouTube Channels
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Watch video lessons and tutorials from our expert instructors
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {youtubeChannels.map((channel, index) => (
              <a 
                key={index} 
                href={channel.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  padding: '16px',
                  background: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.3s ease',
                  display: 'block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = '#FECACA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `linear-gradient(135deg, ${channel.color}, ${channel.color}CC)`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    📺
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#0F172A', fontSize: '14px', marginBottom: '2px' }}>{channel.name}</h4>
                    <p style={{ fontSize: '11px', color: '#EF4444' }}>{channel.subscribers}</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>{channel.description}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                    🎬 {channel.videos}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          borderRadius: '24px',
          padding: isMobile ? '28px 20px' : '40px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            Ready to Join Our Community?
          </h3>
          <p style={{
            fontSize: isMobile ? '13px' : '15px',
            opacity: 0.9,
            marginBottom: '24px',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Connect with thousands of learners and start your mathematics journey today
          </p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'white',
              color: '#6366F1',
              padding: isMobile ? '12px 28px' : '14px 36px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: isMobile ? '14px' : '15px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            💬 Join WhatsApp Group Now →
          </a>
        </div>
      </div>
    </div>
  )
}