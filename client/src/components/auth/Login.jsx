import { useState, useCallback } from 'react'
import axios from 'axios'
import { Boxes } from '../ui/background-boxes'

const API_URL = 'http://localhost:5000/api'

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData)
      
      onLoginSuccess(response.data.user, response.data.token)
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: '#0f172a',
        zIndex: 0,
        maskImage: 'radial-gradient(transparent, white)',
        pointerEvents: 'none'
      }} />
      <Boxes />
      
      {/* Login Content */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          minHeight: '80vh'
        }}>
          
          {/* Quote Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '2rem',
            gap: '2rem'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '-1rem',
                left: '-1rem',
                fontSize: '4rem',
                color: 'rgba(6, 182, 212, 0.2)',
                fontFamily: 'serif'
              }}>"</div>
              <blockquote style={{
                fontSize: '1.8rem',
                fontWeight: '300',
                color: 'white',
                lineHeight: '1.6',
                fontStyle: 'italic',
                paddingLeft: '2rem'
              }}>
                Success is not final, failure is not fatal: it is the courage to continue that counts.
              </blockquote>
              <div style={{
                position: 'absolute',
                bottom: '-1rem',
                right: '-1rem',
                fontSize: '4rem',
                color: 'rgba(6, 182, 212, 0.2)',
                fontFamily: 'serif',
                transform: 'rotate(180deg)'
              }}>"</div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingLeft: '2rem'
            }}>
              <div style={{
                width: '3rem',
                height: '2px',
                background: '#06b6d4'
              }}></div>
              <cite style={{
                color: '#06b6d4',
                fontWeight: '500',
                fontSize: '1.1rem'
              }}>Winston Churchill</cite>
            </div>
            <p style={{
              color: '#d1d5db',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              paddingLeft: '2rem'
            }}>
              Drive innovation and excellence with <span style={{color: '#06b6d4', fontWeight: '600'}}>EurosHub</span>. 
              Every challenge is an opportunity to grow and achieve greatness.
            </p>
          </div>

          {/* Login Form */}
          <div style={{
            maxWidth: '400px',
            width: '100%',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                margin: '1.5rem 0',
                textAlign: 'center',
                fontSize: '1.8rem',
                fontWeight: '800',
                color: 'white'
              }}>
                Welcome to <span style={{color: '#06b6d4'}}>EurosHub</span>
              </h2>
              <p style={{
                marginTop: '0.5rem',
                textAlign: 'center',
                fontSize: '0.9rem',
                color: '#d1d5db'
              }}>
                Sign in to access your EurosHub Dashboard
              </p>
            </div>
            
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                backdropFilter: 'blur(4px)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div>
                <label htmlFor="username" style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#e5e7eb',
                  marginBottom: '0.5rem'
                }}>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  style={{
                    appearance: 'none',
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid #475569',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={useCallback((e) => {
                    e.target.style.borderColor = '#06b6d4';
                    e.target.style.boxShadow = '0 0 0 2px rgba(6, 182, 212, 0.2)';
                  }, [])}
                  onBlur={useCallback((e) => {
                    e.target.style.borderColor = '#475569';
                    e.target.style.boxShadow = 'none';
                  }, [])}
                />
              </div>
              
              <div>
                <label htmlFor="password" style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#e5e7eb',
                  marginBottom: '0.5rem'
                }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  style={{
                    appearance: 'none',
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid #475569',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={useCallback((e) => {
                    e.target.style.borderColor = '#06b6d4';
                    e.target.style.boxShadow = '0 0 0 2px rgba(6, 182, 212, 0.2)';
                  }, [])}
                  onBlur={useCallback((e) => {
                    e.target.style.borderColor = '#475569';
                    e.target.style.boxShadow = 'none';
                  }, [])}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '0.5rem',
                    color: 'white',
                    background: loading ? 'rgba(6, 182, 212, 0.5)' : 'linear-gradient(to right, #0891b2, #1e40af)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    backdropFilter: 'blur(4px)',
                    outline: 'none'
                  }}
                  onMouseEnter={useCallback((e) => {
                    if (!loading) {
                      e.target.style.background = 'linear-gradient(to right, #0e7490, #1d4ed8)';
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = '0 20px 25px -5px rgba(6, 182, 212, 0.3)';
                    }
                  }, [loading])}
                  onMouseLeave={useCallback((e) => {
                    if (!loading) {
                      e.target.style.background = 'linear-gradient(to right, #0891b2, #1e40af)';
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }
                  }, [loading])}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <svg style={{
                        animation: 'spin 1s linear infinite',
                        marginLeft: '-0.25rem',
                        marginRight: '0.75rem',
                        height: '1.25rem',
                        width: '1.25rem',
                        color: 'white'
                      }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
            
            <div style={{
              fontSize: '0.9rem',
              textAlign: 'center',
              marginTop: '1.5rem',
              color: '#9ca3af'
            }}>
              © 2025 EurosHub Management System
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .login-container > div:first-of-type > div {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
            .login-container > div:first-of-type > div > div:first-child {
              padding: 1rem !important;
              gap: 1.5rem !important;
            }
            .login-container > div:first-of-type > div > div:first-child blockquote {
              font-size: 1.2rem !important;
              padding-left: 1rem !important;
            }
            .login-container > div:first-of-type > div > div:first-child > div:nth-child(2),
            .login-container > div:first-of-type > div > div:first-child > p {
              padding-left: 1rem !important;
            }
          }
        `
      }} />
    </div>
  )
}

export default Login