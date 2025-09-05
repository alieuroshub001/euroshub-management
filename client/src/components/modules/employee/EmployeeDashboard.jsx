function EmployeeDashboard({ user, activeModule }) {
  return (
    <div className="employee-dashboard">
      <div className="dashboard-overview">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName}!</h1>
          <p>Employee Dashboard - Manage your tasks and timesheet</p>
        </div>
        <div className="module-placeholder">
          Employee Module: {activeModule} - Coming Soon
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard