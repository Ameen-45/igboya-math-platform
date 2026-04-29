import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Statistics() {
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
      icon: '📈',
      title: 'Introduction',
      description: 'Understand the foundations of statistics, probability, and data interpretation.',
      path: '/topics/statistics/introduction',
      color: '#F59E0B',
      duration: '20 min'
    },
    {
      icon: '📉',
      title: 'Examples',
      description: 'Explore step-by-step statistical problems and probability calculations.',
      path: '/topics/statistics/examples',
      color: '#D97706',
      duration: '25 min'
    },
    {
      icon: '🧪',
      title: 'Data Analyzer',
      description: 'Work with datasets and calculate mean, median, variance, and more.',
      path: '/topics/statistics/data-analyzer',
      color: '#B45309',
      duration: '30 min'
    },
    {
      icon: '📝',
      title: 'Quiz',
      description: 'Test your understanding of statistics and probability concepts.',
      path: '/topics/statistics/quiz',
      color: '#F59E0B',
      duration: '20 min'
    },
    {
      icon: '🔄',
      title: 'Practice',
      description: 'Practice real-world statistical scenarios and data problems.',
      path: '/topics/statistics/practice',
      color: '#10B981',
      duration: '25 min'
    }
  ];

  const progress = 20; // This would come from localStorage in a real app

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
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.03) 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, rgba(217, 119, 6, 0.03) 0%, transparent 50%)`,
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
          <span style={{ color: '#F59E0B', fontWeight: '500' }}>Statistics</span>
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
                background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                opacity: 0.2
              }}></div>
              <div style={{
                width: isMobile ? '70px' : '80px',
                height: isMobile ? '70px' : '80px',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 20px 40px -12px rgba(245, 158, 11, 0.3)'
              }}>
                <span style={{ fontSize: isMobile ? '32px' : '36px' }}>📊</span>
              </div>
            </div>
          </div>
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}>
            Statistics
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#64748B',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Analyze data, understand probability, and master statistical methods used in real-world decision making.
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
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
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
            Your Statistics Progress
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#64748B',
            marginBottom: '20px'
          }}>
            Complete all sections to master statistical thinking
          </p>

          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#64748B' }}>
              <span>Overall Progress</span>
              <span style={{ fontWeight: '600', color: '#F59E0B' }}>{progress}%</span>
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
                background: 'linear-gradient(90deg, #F59E0B, #D97706)',
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
                {progress === 100 ? '🎉 You mastered Statistics!' : `🎯 ${sections.length} sections to explore`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}