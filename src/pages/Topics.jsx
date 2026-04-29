import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Topics() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredTopic, setHoveredTopic] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const topics = [
    {
      icon: "🧮",
      title: "Algebra",
      description: "Equations, functions, graphs & variables",
      gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      path: "/topics/algebra",
      progress: 65,
      color: "#6366F1",
      lessons: 24,
      duration: "8 hours"
    },
    {
      icon: "📐",
      title: "Geometry",
      description: "Shapes, angles, theorems & proofs",
      gradient: "linear-gradient(135deg, #10B981, #059669)",
      path: "/topics/geometry",
      progress: 0,
      color: "#10B981",
      lessons: 18,
      duration: "6 hours"
    },
    {
      icon: "📊",
      title: "Statistics",
      description: "Data analysis, probability & distributions",
      gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
      path: "/topics/statistics",
      progress: 10,
      color: "#F59E0B",
      lessons: 20,
      duration: "7 hours"
    },
    {
      icon: "📈",
      title: "Calculus",
      description: "Limits, derivatives, integrals & functions",
      gradient: "linear-gradient(135deg, #EF4444, #DC2626)",
      path: "/topics/calculus",
      progress: 0,
      color: "#EF4444",
      lessons: 22,
      duration: "9 hours"
    },
    {
      icon: "θ",
      title: "Trigonometry",
      description: "Angles, triangles & periodic functions",
      gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
      path: "/topics/trigonometry",
      progress: 5,
      color: "#8B5CF6",
      lessons: 16,
      duration: "6 hours"
    }
  ];

  const revisionMaterials = [
    {
      title: "MPT – General Mathematics",
      description: "Comprehensive practice questions with solutions",
      file: `${import.meta.env.BASE_URL}revision/MPT.pdf`,
      size: "2.4 MB",
      icon: "📘"
    },
    {
      title: "Quick Reference Formula Sheet",
      description: "Essential formulas and theorems",
      file: `${import.meta.env.BASE_URL}revision/formulas.pdf`,
      size: "1.1 MB",
      icon: "📙"
    }
  ];

  const totalProgress = Math.floor(
    topics.reduce((sum, topic) => sum + topic.progress, 0) / topics.length
  );
  const completedLessons = topics.reduce((sum, topic) => sum + Math.floor(topic.progress / 100 * topic.lessons), 0);
  const totalLessons = topics.reduce((sum, topic) => sum + topic.lessons, 0);

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

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
          <div style={{ display: 'inline-block', marginBottom: isMobile ? '16px' : '20px' }}>
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
                <span style={{ fontSize: isMobile ? '32px' : '36px' }}>📚</span>
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
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            Learning Topics
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#64748B',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Choose a topic to begin your mathematical journey
          </p>
        </div>

        {/* Overall Progress */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: isMobile ? '16px' : '20px',
          marginBottom: isMobile ? '24px' : '32px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#0F172A' }}>📊 Overall Progress</span>
            <span style={{ fontSize: '13px', color: '#64748B' }}>{completedLessons}/{totalLessons} lessons completed</span>
          </div>
          <div style={{
            width: '100%',
            background: '#E2E8F0',
            borderRadius: '9999px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${totalProgress}%`,
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
              height: '100%',
              borderRadius: '9999px',
              transition: 'width 0.7s ease-out'
            }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>Total Progress</span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#6366F1' }}>{totalProgress}% Complete</span>
          </div>
        </div>

        {/* Topics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: isMobile ? '16px' : '24px',
          marginBottom: isMobile ? '32px' : '48px'
        }}>
          {topics.map((topic, index) => (
            <Link
              key={index}
              to={topic.path}
              style={{
                textDecoration: 'none',
                display: 'block'
              }}
              onMouseEnter={() => setHoveredTopic(index)}
              onMouseLeave={() => setHoveredTopic(null)}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: isMobile ? '20px' : '24px',
                border: hoveredTopic === index ? `2px solid ${topic.color}` : '1px solid #E2E8F0',
                boxShadow: hoveredTopic === index ? `0 8px 24px -12px ${topic.color}40` : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: isMobile ? '56px' : '64px',
                    height: isMobile ? '56px' : '64px',
                    background: `linear-gradient(135deg, ${topic.color}15, ${topic.color}25)`,
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '28px' : '32px'
                  }}>
                    {topic.icon}
                  </div>
                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: topic.color }}>{topic.progress}%</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Complete</span>
                  </div>
                </div>

                <h2 style={{
                  fontSize: isMobile ? '20px' : '22px',
                  fontWeight: '700',
                  color: '#0F172A',
                  marginBottom: '8px'
                }}>
                  {topic.title}
                </h2>
                <p style={{
                  fontSize: '13px',
                  color: '#64748B',
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  {topic.description}
                </p>

                {/* Topic Stats */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '16px',
                  padding: '12px 0',
                  borderTop: '1px solid #F1F5F9',
                  borderBottom: '1px solid #F1F5F9'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Lessons</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{topic.lessons}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Duration</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{topic.duration}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  background: '#E2E8F0',
                  borderRadius: '9999px',
                  height: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: `${topic.progress}%`,
                    background: topic.color,
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.5s'
                  }}></div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {Math.floor(topic.progress / 100 * topic.lessons)} of {topic.lessons} lessons
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: topic.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Start Learning
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Revision Center */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: isMobile ? '20px' : '28px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '24px' }}>
            <div style={{
              width: isMobile ? '50px' : '60px',
              height: isMobile ? '50px' : '60px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '24px' : '28px',
              margin: '0 auto 12px'
            }}>
              🔄
            </div>
            <h2 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '700',
              color: '#0F172A',
              marginBottom: '8px'
            }}>
              General Revision Center
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#64748B'
            }}>
              Download practice materials and prepare for exams
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {revisionMaterials.map((rev, i) => (
              <a
                key={i}
                href={rev.file}
                download
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  background: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F1F5F9';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}>
                  {rev.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#0F172A',
                    fontSize: isMobile ? '14px' : '15px',
                    marginBottom: '4px'
                  }}>
                    {rev.title}
                  </h3>
                  <p style={{
                    fontSize: '11px',
                    color: '#64748B',
                    marginBottom: '4px'
                  }}>
                    {rev.description}
                  </p>
                  <span style={{
                    fontSize: '10px',
                    color: '#94A3B8'
                  }}>
                    {rev.size} • PDF
                  </span>
                </div>
                <div style={{ color: '#6366F1' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}