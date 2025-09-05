function AdminDashboard({ user, activeModule }) {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-overview">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName}!</h1>
          <p>Admin Dashboard - Manage projects and teams</p>
        </div>
        <div className="module-placeholder">
          Admin Module: {activeModule} - Coming Soon
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard