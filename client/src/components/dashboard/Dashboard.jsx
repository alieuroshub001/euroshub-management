import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import SuperAdminDashboard from '../modules/superadmin/SuperAdminDashboard'
import AdminDashboard from '../modules/admin/AdminDashboard'
import ClientDashboard from '../modules/client/ClientDashboard'
import HRDashboard from '../modules/hr/HRDashboard'
import EmployeeDashboard from '../modules/employee/EmployeeDashboard'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeModule, setActiveModule] = useState('dashboard')

  const renderDashboard = () => {
    switch (user.role) {
      case 'superadmin':
        return <SuperAdminDashboard user={user} activeModule={activeModule} />
      case 'admin':
        return <AdminDashboard user={user} activeModule={activeModule} />
      case 'client':
        return <ClientDashboard user={user} activeModule={activeModule} />
      case 'hr':
        return <HRDashboard user={user} activeModule={activeModule} />
      case 'employee':
        return <EmployeeDashboard user={user} activeModule={activeModule} />
      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar 
        user={user}
        isOpen={sidebarOpen}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header 
          user={user}
          onLogout={onLogout}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="dashboard-content">
          {renderDashboard()}
        </div>
      </div>
    </div>
  )
}

export default Dashboard