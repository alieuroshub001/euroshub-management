import { useState, useEffect } from 'react'
import { Users, FolderOpen, CheckCircle, Activity, TrendingUp, Server, Calendar, AlertCircle } from 'lucide-react'
import UserManagement from './UserManagement'
import './SuperAdminDashboard.css'

function SuperAdminDashboard({ user, activeModule }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    completedTasks: 0,
    systemHealth: 'Online'
  })

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalUsers: 12,
      activeProjects: 8,
      completedTasks: 247,
      systemHealth: 'Online'
    })
  }, [])

  const renderContent = () => {
    switch (activeModule) {
      case 'users':
        return <UserManagement />
      case 'projects':
        return <div className="module-placeholder">
          <FolderOpen size={48} />
          <h3>Projects Module</h3>
          <p>Coming Soon</p>
        </div>
      case 'analytics':
        return <div className="module-placeholder">
          <TrendingUp size={48} />
          <h3>Analytics Module</h3>
          <p>Coming Soon</p>
        </div>
      case 'settings':
        return <div className="module-placeholder">
          <Server size={48} />
          <h3>System Settings</h3>
          <p>Coming Soon</p>
        </div>
      default:
        return (
          <div className="dashboard-overview">
            <div className="welcome-section">
              <div className="welcome-content">
                <div className="welcome-text">
                  <h1>Welcome back, {user.firstName}!</h1>
                  <p>SuperAdmin Dashboard - Complete system control and oversight</p>
                </div>
                <div className="welcome-icon">
                  <Activity className="activity-icon" size={32} />
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card users">
                <div className="stat-icon">
                  <Users size={28} />
                </div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p className="stat-number">{stats.totalUsers}</p>
                  <span className="stat-change">+2 this week</span>
                </div>
              </div>
              
              <div className="stat-card projects">
                <div className="stat-icon">
                  <FolderOpen size={28} />
                </div>
                <div className="stat-info">
                  <h3>Active Projects</h3>
                  <p className="stat-number">{stats.activeProjects}</p>
                  <span className="stat-change">+1 this month</span>
                </div>
              </div>
              
              <div className="stat-card tasks">
                <div className="stat-icon">
                  <CheckCircle size={28} />
                </div>
                <div className="stat-info">
                  <h3>Completed Tasks</h3>
                  <p className="stat-number">{stats.completedTasks}</p>
                  <span className="stat-change">+15 today</span>
                </div>
              </div>
              
              <div className="stat-card health">
                <div className="stat-icon">
                  <Server size={28} />
                </div>
                <div className="stat-info">
                  <h3>System Health</h3>
                  <p className="stat-status online">{stats.systemHealth}</p>
                  <span className="stat-change">All services running</span>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="recent-activity">
                <div className="card-header">
                  <h3><Calendar size={20} /> Recent System Activity</h3>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <Users size={16} />
                    </div>
                    <div className="activity-content">
                      <p>New user registered: <strong>John Doe</strong></p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <FolderOpen size={16} />
                    </div>
                    <div className="activity-content">
                      <p>Project created: <strong>Website Redesign</strong></p>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <CheckCircle size={16} />
                    </div>
                    <div className="activity-content">
                      <p>Task completed: <strong>Database Migration</strong></p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="system-status">
                <div className="card-header">
                  <h3><Server size={20} /> System Status</h3>
                </div>
                <div className="status-list">
                  <div className="status-item">
                    <div className="status-indicator online"></div>
                    <span>Database Server</span>
                    <span className="status-value">Online</span>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator online"></div>
                    <span>Email Service</span>
                    <span className="status-value">Online</span>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator online"></div>
                    <span>File Storage</span>
                    <span className="status-value">Online</span>
                  </div>
                  <div className="status-item">
                    <div className="status-indicator warning"></div>
                    <span>Backup Service</span>
                    <span className="status-value">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="superadmin-dashboard">
      {renderContent()}
    </div>
  )
}

export default SuperAdminDashboard