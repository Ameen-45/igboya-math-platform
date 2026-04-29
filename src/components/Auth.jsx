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
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=6366F1&color=fff`
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
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(16px, 5vw, 24px)',
      position: 'relative',
      overflow: 'hidden'
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

      {/* Main Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '480px',
        width: '100%',
        background: 'white',
        borderRadius: 'clamp(24px, 6vw, 32px)',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
        padding: 'clamp(28px, 8vw, 44px)',
        border: '1px solid #E2E8F0'
      }}>
        
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 6vw, 36px)' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: 'clamp(56px, 15vw, 72px)',
              height: 'clamp(56px, 15vw, 72px)',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              borderRadius: 'clamp(16px, 4vw, 20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 8px 20px -8px rgba(99, 102, 241, 0.3)'
            }}>
              <span style={{ 
                fontSize: 'clamp(28px, 7vw, 36px)', 
                fontWeight: 'bold', 
                color: 'white' 
              }}>∫</span>
            </div>
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 6vw, 32px)',
            fontWeight: '700',
            marginTop: '20px',
            marginBottom: '8px',
            color: '#0F172A',
            letterSpacing: '-0.02em'
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: '#64748B', fontSize: 'clamp(13px, 3.5vw, 14px)' }}>
            {isLogin ? 'Sign in to continue your learning journey' : 'Start your math adventure today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 'clamp(13px, 3.5vw, 14px)', 
                fontWeight: '500', 
                color: '#334155', 
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
                  padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 16px)',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3.5vw, 15px)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366F1';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.backgroundColor = '#F8FAFC';
                }}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 'clamp(13px, 3.5vw, 14px)', 
              fontWeight: '500', 
              color: '#334155', 
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
                padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 16px)',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: 'clamp(14px, 3.5vw, 15px)',
                outline: 'none',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                backgroundColor: '#F8FAFC',
                color: '#0F172A'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366F1';
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2E8F0';
                e.target.style.backgroundColor = '#F8FAFC';
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 'clamp(13px, 3.5vw, 14px)', 
              fontWeight: '500', 
              color: '#334155', 
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
                  padding: 'clamp(12px, 3vw, 14px) clamp(14px, 4vw, 16px)',
                  paddingRight: '48px',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3.5vw, 15px)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366F1';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.backgroundColor = '#F8FAFC';
                }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  opacity: 0.5,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
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
              fontSize: 'clamp(13px, 3.5vw, 14px)' 
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    cursor: 'pointer',
                    accentColor: '#6366F1'
                  }} 
                />
                <span style={{ color: '#64748B' }}>Remember me</span>
              </label>
              <a href="#" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: '500' }}>
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 'clamp(14px, 3.5vw, 16px)',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: 'clamp(14px, 4vw, 15px)',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '8px',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px -8px rgba(99, 102, 241, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(99, 102, 241, 0.2)';
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
            background: '#E2E8F0'
          }}></div>
          <span style={{
            position: 'relative',
            background: 'white',
            padding: '0 16px',
            color: '#94A3B8',
            fontSize: 'clamp(12px, 3.5vw, 13px)'
          }}>
            or
          </span>
        </div>

        {/* Toggle between Login and Signup */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748B', fontSize: 'clamp(13px, 3.5vw, 14px)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366F1',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: 'clamp(13px, 3.5vw, 14px)',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8B5CF6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6366F1'}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Demo Hint */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#FEF3C7',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #FDE68A'
        }}>
          <p style={{ fontSize: 'clamp(11px, 3vw, 12px)', color: '#92400E', margin: 0 }}>
            💡 Demo: Use any email and password to login
          </p>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>
        {`
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