import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Geometry() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hoveredSection, setHoveredSection] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      icon: '📖',
      title: 'Introduction',
      description: 'Learn the fundamentals of geometry including shapes, angles, and basic theorems.',
      path: '/topics/geometry/introduction',
      color: '#10B981',
      duration: '20 min'
    },
    {
      icon: '🔍',
      title: 'Examples',
      description: 'Explore step-by-step geometry problems and geometric proofs.',
      path: '/topics/geometry/examples',
      color: '#059669',
      duration: '25 min'
    },
    {
      icon: '🧩',
      title: 'Interactive Practice',
      description: 'Practice geometry problems with visual aids and guided solutions.',
      path: '/topics/geometry/practice',
      color: '#047857',
      duration: '30 min'
    },
    {
      icon: '📝',
      title: 'Quiz',
      description: 'Test your geometry knowledge with interactive quizzes.',
      path: '/topics/geometry/quiz',
      color: '#F59E0B',
      duration: '20 min'
    }
  ];

  const progress = 0; // This would come from localStorage in a real app

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '20px' : '32px',
      position: 'relative'
    }}>
      
      {/* Subtle Background Pattern */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, rgba(5, 150, 105, 0.03) 0%, transparent 50%)`,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#64748B', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Dashboard</Link>
          <span>›</span>
          <Link to="/topics" style={{ color: '#64748B', textDecoration: 'none' }}>Topics</Link>
          <span>›</span>
          <span style={{ color: '#10B981', fontWeight: '500' }}>Geometry</span>
        </div>

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
                background: 'linear-gradient(135deg, #10B981, #059669, #047857)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                opacity: 0.2
              }}></div>
              <div style={{
                width: isMobile ? '70px' : '80px',
                height: isMobile ? '70px' : '80px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 20px 40px -12px rgba(16, 185, 129, 0.3)'
              }}>
                <span style={{ fontSize: isMobile ? '32px' : '36px' }}>📐</span>
              </div>
            </div>
          </div>
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10B981, #059669, #047857)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}>
            Geometry
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#64748B',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Master shapes, angles, theorems, and geometric proofs.
          </p>
        </div>

        {/* Sections Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: isMobile ? '16px' : '24px',
          marginBottom: isMobile ? '32px' : '48px'
        }}>
          {sections.map((section, index) => (
            <Link
              key={index}
              to={section.path}
              style={{ textDecoration: 'none' }}
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: isMobile ? '20px' : '24px',
                border: hoveredSection === index ? `2px solid ${section.color}` : '1px solid #E2E8F0',
                boxShadow: hoveredSection === index ? `0 8px 24px -12px ${section.color}40` : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: isMobile ? '56px' : '64px',
                  height: isMobile ? '56px' : '64px',
                  background: `linear-gradient(135deg, ${section.color}15, ${section.color}25)`,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '28px' : '32px',
                  marginBottom: '16px'
                }}>
                  {section.icon}
                </div>

                <h3 style={{
                  fontSize: isMobile ? '18px' : '20px',
                  fontWeight: '600',
                  color: '#0F172A',
                  marginBottom: '8px'
                }}>
                  {section.title}
                </h3>

                <p style={{
                  fontSize: '13px',
                  color: '#64748B',
                  lineHeight: '1.5',
                  marginBottom: '16px',
                  flex: 1
                }}>
                  {section.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ⏱️ {section.duration}
                  </span>
                  <div style={{
                    background: `linear-gradient(135deg, ${section.color}, ${section.color}CC)`,
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '500',
                    transition: 'transform 0.2s ease'
                  }}>
                    Start Learning →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Progress Section */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: isMobile ? '24px' : '32px',
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}>
          <div style={{
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '24px' : '28px',
            margin: '0 auto 16px'
          }}>
            📊
          </div>
          <h3 style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            color: '#0F172A',
            marginBottom: '8px'
          }}>
            Your Geometry Progress
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#64748B',
            marginBottom: '20px'
          }}>
            Complete all sections to master geometry fundamentals
          </p>

          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#64748B' }}>
              <span>Overall Progress</span>
              <span style={{ fontWeight: '600', color: '#10B981' }}>{progress}%</span>
            </div>
            <div style={{
              width: '100%',
              background: '#E2E8F0',
              borderRadius: '9999px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #10B981, #059669)',
                height: '100%',
                borderRadius: '9999px',
                transition: 'width 0.5s ease-out'
              }}></div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <span style={{
                fontSize: '11px',
                color: '#94A3B8'
              }}>
                {progress === 100 ? '🎉 You mastered Geometry!' : `🎯 ${sections.length} sections to explore`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}