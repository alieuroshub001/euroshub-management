function HRDashboard({ user, activeModule }) {
  return (
    <div className="hr-dashboard">
      <div className="dashboard-overview">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName}!</h1>
          <p>HR Dashboard - Manage employees and attendance</p>
        </div>
        <div className="module-placeholder">
          HR Module: {activeModule} - Coming Soon
        </div>
      </div>
    </div>
  )
}

export default HRDashboard