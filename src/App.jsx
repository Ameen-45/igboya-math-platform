import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./router/routes"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage
    const loadUser = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
    
    loadUser()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user")
      if (updatedUser) {
        setUser(JSON.parse(updatedUser))
      } else {
        setUser(null)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    setUser(null)
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #E2E8F0',
            borderTopColor: '#6366F1',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ color: '#64748B' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <AppRoutes user={user} />
    </BrowserRouter>
  )
}

// Add spin animation style
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)

export default App
