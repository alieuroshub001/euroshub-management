function ClientDashboard({ user, activeModule }) {
  return (
    <div className="client-dashboard">
      <div className="dashboard-overview">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName}!</h1>
          <p>Client Dashboard - Track your projects and requests</p>
        </div>
        <div className="module-placeholder">
          Client Module: {activeModule} - Coming Soon
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard