import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  TrendingUp, 
  Settings,
  CheckSquare,
  UserCheck,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  Briefcase,
  PieChart,
  UserPlus
} from 'lucide-react'
import './Sidebar.css'

function Sidebar({ user, isOpen, activeModule, onModuleChange, onToggle }) {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]

    switch (user.role) {
      case 'superadmin':
        return [
          ...baseItems,
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'settings', label: 'System Settings', icon: Settings }
        ]
      
      case 'admin':
        return [
          ...baseItems,
          { id: 'projects', label: 'Projects', icon: FolderOpen },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare },
          { id: 'team', label: 'Team Management', icon: Users },
          { id: 'reports', label: 'Reports', icon: PieChart }
        ]
      
      case 'client':
        return [
          ...baseItems,
          { id: 'projects', label: 'My Projects', icon: FolderOpen },
          { id: 'requests', label: 'Requests', icon: FileText },
          { id: 'invoices', label: 'Invoices', icon: DollarSign }
        ]
      
      case 'hr':
        return [
          ...baseItems,
          { id: 'employees', label: 'Employees', icon: UserCheck },
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'payroll', label: 'Payroll', icon: DollarSign },
          { id: 'leaves', label: 'Leave Management', icon: Briefcase }
        ]
      
      case 'employee':
        return [
          ...baseItems,
          { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
          { id: 'projects', label: 'My Projects', icon: FolderOpen },
          { id: 'timesheet', label: 'Timesheet', icon: Clock },
          { id: 'leaves', label: 'Leave Requests', icon: Briefcase }
        ]
      
      default:
        return baseItems
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <h3>EurosHub</h3>
        </div>
      </div>

      <nav className="sidebar-nav">
        {getMenuItems().map(item => {
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${activeModule === item.id ? 'active' : ''}`}
              onClick={() => onModuleChange(item.id)}
            >
              <span className="nav-icon">
                <IconComponent size={20} />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div className="user-details">
            <div className="user-name">{user.firstName} {user.lastName}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar