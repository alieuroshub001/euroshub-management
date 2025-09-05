import { Menu, LogOut, Bell } from 'lucide-react'
import './Header.css'

function Header({ user, onLogout, onSidebarToggle }) {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onSidebarToggle}
        >
          <Menu size={20} />
        </button>
        <div className="header-brand">
          <h2>EurosHub Management</h2>
          <span className="brand-subtitle">Project Management System</span>
        </div>
      </div>


      <div className="header-right">
        <button className="notification-button">
          <Bell size={18} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="header-user-info">
          <div className="user-details">
            <span className="user-name">{user.firstName} {user.lastName}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <div className="user-avatar">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
        </div>
        
        <button 
          className="logout-button"
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header