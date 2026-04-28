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
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 25%, #2D1B4E 50%, #1E1B4B 75%, #0F172A 100%)',
    }}>
      
      {/* Animated Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatOrb 15s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '70%',
        height: '70%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatOrb 12s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'floatOrb 18s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>

      {/* Grid Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }}></div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '20px',
        maxWidth: '1200px',
        width: '100%',
        textAlign: 'center'
      }}>
        
        {/* Logo Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'clamp(20px, 8vw, 40px)'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              opacity: 0.5,
              animation: 'pulseGlow 2s ease-in-out infinite'
            }}></div>
            <div style={{
              position: 'relative',
              width: 'clamp(80px, 20vw, 120px)',
              height: 'clamp(80px, 20vw, 120px)',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
              borderRadius: 'clamp(20px, 5vw, 30px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 30px 60px -20px rgba(139, 92, 246, 0.5)',
              animation: 'floatLogo 3s ease-in-out infinite'
            }}>
              <div style={{
                fontSize: 'clamp(40px, 10vw, 60px)',
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                ∫
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 'clamp(16px, 4vw, 24px)' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 10vw, 72px)',
            fontWeight: 'bold',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            IGBOYA
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 4vw, 18px)',
            color: '#A78BFA',
            letterSpacing: '0.05em',
            fontWeight: '300'
          }}>
            Math Learning Platform
          </p>
        </div>

        {/* Subtitle */}
        <div style={{ marginBottom: 'clamp(24px, 6vw, 40px)' }}>
          <p style={{
            fontSize: 'clamp(18px, 5vw, 24px)',
            fontWeight: '300',
            color: 'white',
            marginBottom: '8px'
          }}>
            Learn Mathematics
          </p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <p style={{
              fontSize: 'clamp(24px, 7vw, 48px)',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #F472B6, #C084FC, #60A5FA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Interactively
            </p>
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '10%',
              right: '10%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #C084FC, #EC4899, #C084FC, transparent)',
              borderRadius: '3px'
            }}></div>
          </div>
        </div>

        {/* Feature Tags */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: 'clamp(32px, 8vw, 48px)'
        }}>
          {[
            { icon: '📚', text: 'Interactive Lessons' },
            { icon: '🎯', text: 'Smart Practice' },
            { icon: '📊', text: 'Track Progress' },
            { icon: '🏆', text: 'Earn Badges' }
          ].map((feature, index) => (
            <div key={index} style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '9999px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: 'clamp(12px, 3vw, 14px)',
              color: '#E2E8F0',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <span style={{ fontSize: '16px' }}>{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Loading Section */}
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '12px',
              color: '#94A3B8'
            }}>
              <span>Loading Experience</span>
              <span style={{ fontFamily: 'monospace' }}>{progress}%</span>
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)',
                borderRadius: '9999px',
                transition: 'width 0.1s ease-out',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 1.5s infinite'
                }}></div>
              </div>
            </div>
          </div>

          {/* Loading Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {[0, 1, 2, 3].map((dot) => (
              <div key={dot} style={{
                width: '8px',
                height: '8px',
                background: `linear-gradient(135deg, #8B5CF6, #EC4899)`,
                borderRadius: '50%',
                animation: 'bounce 1.4s ease-in-out infinite',
                animationDelay: `${dot * 0.15}s`
              }}></div>
            ))}
          </div>

          {/* Dynamic Message */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '13px',
              color: '#94A3B8',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              {progress < 30 && '✨ Preparing your learning journey...'}
              {progress >= 30 && progress < 60 && '🎨 Crafting interactive lessons...'}
              {progress >= 60 && progress < 90 && '🚀 Getting everything ready...'}
              {progress >= 90 && '🌟 Almost there! Loading amazing content...'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '16px'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#475569',
            letterSpacing: '0.5px'
          }}>
            © 2024 IGBOYA Math Platform • Master Math at Your Own Pace
          </p>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes floatOrb {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -30px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          
          @keyframes floatLogo {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(5deg);
            }
          }
          
          @keyframes pulseGlow {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1);
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}