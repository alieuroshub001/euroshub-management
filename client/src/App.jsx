import { useState } from 'react'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [token, setToken] = useState(localStorage.getItem('token'))

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  if (!user || !token) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <Dashboard user={user} onLogout={handleLogout} />
  )
}

export default App
