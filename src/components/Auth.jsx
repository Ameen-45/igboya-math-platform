import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const user = {
        name: name || email.split('@')[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=8B5CF6&color=fff`
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', `demo-token-${Date.now()}`);
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 25%, #2D1B4E 50%, #1E1B4B 75%, #0F172A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(12px, 5vw, 24px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated Background Orbs */}
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
        width: '60%',
        height: '60%',
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

      {/* Grid Pattern Overlay */}
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

      {/* Main Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '480px',
        width: '100%',
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 'clamp(20px, 6vw, 32px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        padding: 'clamp(24px, 8vw, 40px)',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 6vw, 32px)' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
              borderRadius: '50%',
              filter: 'blur(20px)',
              opacity: 0.5,
              animation: 'pulseGlow 2s ease-in-out infinite'
            }}></div>
            <div style={{
              position: 'relative',
              width: 'clamp(60px, 15vw, 80px)',
              height: 'clamp(60px, 15vw, 80px)',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
              borderRadius: 'clamp(16px, 4vw, 24px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              animation: 'floatLogo 3s ease-in-out infinite'
            }}>
              <span style={{ 
                fontSize: 'clamp(28px, 7vw, 40px)', 
                fontWeight: 'bold', 
                color: 'white' 
              }}>∫</span>
            </div>
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: 'bold',
            marginTop: '20px',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 'clamp(12px, 3.5vw, 14px)' }}>
            {isLogin ? 'Sign in to continue your learning journey' : 'Start your math adventure today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 'clamp(12px, 3.5vw, 14px)', 
                fontWeight: '500', 
                color: '#CBD5E1', 
                marginBottom: '8px' 
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 'clamp(12px, 3.5vw, 14px)', 
              fontWeight: '500', 
              color: '#CBD5E1', 
              marginBottom: '8px' 
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(10px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                outline: 'none',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 'clamp(12px, 3.5vw, 14px)', 
              fontWeight: '500', 
              color: '#CBD5E1', 
              marginBottom: '8px' 
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 3vw, 14px) clamp(12px, 4vw, 16px)',
                  paddingRight: '48px',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  opacity: 0.7
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {isLogin && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              fontSize: 'clamp(12px, 3.5vw, 14px)' 
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span style={{ color: '#94A3B8' }}>Remember me</span>
              </label>
              <a href="#" style={{ color: '#A78BFA', textDecoration: 'none', fontWeight: '500' }}>
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3.5vw, 14px)',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #3B82F6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: 'clamp(14px, 4vw, 16px)',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(139, 92, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
              </div>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ margin: '24px 0', position: 'relative', textAlign: 'center' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(139, 92, 246, 0.3)'
          }}></div>
          <span style={{
            position: 'relative',
            background: 'rgba(30, 41, 59, 0.95)',
            padding: '0 16px',
            color: '#64748B',
            fontSize: 'clamp(12px, 3.5vw, 14px)'
          }}>
            or
          </span>
        </div>

        {/* Toggle between Login and Signup */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#94A3B8', fontSize: 'clamp(12px, 3.5vw, 14px)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#A78BFA',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: 'clamp(12px, 3.5vw, 14px)',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#C4B5FD'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#A78BFA'}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Demo Hint */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <p style={{ fontSize: 'clamp(11px, 3vw, 12px)', color: '#A78BFA', margin: 0 }}>
            💡 Demo: Use any email and password to login
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
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}