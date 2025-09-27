import { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate authentication (in real app, this would call your backend)
    setTimeout(() => {
      if (credentials.username === 'jobseeker' && credentials.password === 'jobseeker123') {
        onLogin({ username: credentials.username, role: 'Job Seeker' })
      } else if (credentials.username === 'recruiter' && credentials.password === 'recruiter123') {
        onLogin({ username: credentials.username, role: 'Recruiter' })
      } else {
        setError('Invalid credentials. Try jobseeker/jobseeker123 or recruiter/recruiter123')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="cyber-grid"></div>
        <div className="floating-elements">
          <div className="element element-1">💼</div>
          <div className="element element-2">📝</div>
          <div className="element element-3">🎯</div>
          <div className="element element-4">📈</div>
        </div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">💼</div>
            <h1>Job Application Tracker</h1>
            <p>Organize Your Job Search</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <p><strong>Job Seeker:</strong> jobseeker / jobseeker123</p>
            <p><strong>Recruiter:</strong> recruiter / recruiter123</p>
          </div>
          <div className="security-notice">
            <p>🔐 Secure connection encrypted</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
