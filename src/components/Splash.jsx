import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
    }}>
      
      {/* Subtle Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
                         radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`,
        pointerEvents: 'none'
      }}></div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(20px, 5vw, 40px)',
        maxWidth: '1200px',
        width: '100%',
        textAlign: 'center'
      }}>
        
        {/* Logo Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'clamp(24px, 8vw, 48px)'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7)',
              borderRadius: '50%',
              filter: 'blur(30px)',
              opacity: 0.15
            }}></div>
            <div style={{
              position: 'relative',
              width: 'clamp(80px, 20vw, 120px)',
              height: 'clamp(80px, 20vw, 120px)',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: 'clamp(20px, 5vw, 28px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px -12px rgba(99, 102, 241, 0.3)'
            }}>
              <div style={{
                fontSize: 'clamp(40px, 10vw, 56px)',
                fontWeight: 'bold',
                color: 'white'
              }}>
                ∫
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          <h1 style={{
            fontSize: 'clamp(42px, 10vw, 80px)',
            fontWeight: '700',
            marginBottom: '12px',
            color: '#0F172A',
            letterSpacing: '-0.02em'
          }}>
            IGBOYA
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 4vw, 18px)',
            color: '#64748B',
            letterSpacing: '0.08em',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}>
            Math Learning Platform
          </p>
        </div>

        {/* Subtitle */}
        <div style={{ marginBottom: 'clamp(32px, 8vw, 48px)' }}>
          <p style={{
            fontSize: 'clamp(18px, 5vw, 22px)',
            fontWeight: '400',
            color: '#334155',
            marginBottom: '12px'
          }}>
            Learn Mathematics
          </p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <p style={{
              fontSize: 'clamp(28px, 8vw, 52px)',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A855F7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Interactively
            </p>
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '15%',
              right: '15%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #8B5CF6, #6366F1, #8B5CF6, transparent)',
              borderRadius: '3px'
            }}></div>
          </div>
        </div>

        {/* Feature Tags - Modern Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: 'clamp(40px, 10vw, 60px)'
        }}>
          {[
            { icon: '📚', text: 'Interactive Lessons', color: '#6366F1' },
            { icon: '🎯', text: 'Smart Practice', color: '#8B5CF6' },
            { icon: '📊', text: 'Track Progress', color: '#A855F7' },
            { icon: '🏆', text: 'Earn Badges', color: '#6366F1' }
          ].map((feature, index) => (
            <div key={index} style={{
              padding: '10px 20px',
              background: 'white',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 'clamp(12px, 3.5vw, 14px)',
              color: '#1E293B',
              fontWeight: '500',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px -8px rgba(99, 102, 241, 0.2)';
              e.currentTarget.style.borderColor = '#6366F1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}>
              <span style={{ fontSize: '16px' }}>{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Loading Section - Clean Design */}
        <div style={{
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              fontSize: '13px',
              color: '#94A3B8',
              fontWeight: '500'
            }}>
              <span>Loading</span>
              <span style={{ fontFamily: 'monospace', color: '#6366F1' }}>{progress}%</span>
            </div>
            <div style={{
              height: '4px',
              background: '#E2E8F0',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #A855F7)',
                borderRadius: '9999px',
                transition: 'width 0.1s ease-out'
              }}></div>
            </div>
          </div>

          {/* Loading Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            {[0, 1, 2].map((dot) => (
              <div key={dot} style={{
                width: '6px',
                height: '6px',
                background: '#6366F1',
                borderRadius: '50%',
                opacity: 0.4,
                animation: 'fadePulse 1.4s ease-in-out infinite',
                animationDelay: `${dot * 0.2}s`
              }}></div>
            ))}
          </div>

          {/* Dynamic Message */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '12px',
              color: '#94A3B8',
              fontWeight: '400'
            }}>
              {progress < 30 && 'Preparing your learning journey...'}
              {progress >= 30 && progress < 60 && 'Crafting interactive lessons...'}
              {progress >= 60 && progress < 90 && 'Getting everything ready...'}
              {progress >= 90 && 'Almost there!'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '16px'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#CBD5E1',
            letterSpacing: '0.5px'
          }}>
            © 2024 IGBOYA • Master Mathematics
          </p>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes fadePulse {
            0%, 100% {
              opacity: 0.2;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </div>
  );
}