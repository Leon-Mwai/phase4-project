import { Link } from "react-router-dom";

function Dashboard({ user, setUser }) {
  if (!user) {
    return (
      <div className="error-container">
        <div className="error-icon">🔒</div>
        <h2 className="error-title">Access Denied</h2>
        <p className="error-message">
          You must be logged in to view this page.
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  const mockStats = [
    {
      title: "Total Budget",
      value: "KSh 45,000",
      change: "+12% from last month",
      positive: true,
      icon: "💰",
      color: "--primary-600",
    },
    {
      title: "Money Spent",
      value: "KSh 28,500",
      change: "-5% from last month",
      positive: true,
      icon: "💸",
      color: "--error-600",
    },
    {
      title: "Money Saved",
      value: "KSh 16,500",
      change: "+23% from last month",
      positive: true,
      icon: "💎",
      color: "--success-600",
    },
    {
      title: "Active Budgets",
      value: "4",
      change: "+1 this month",
      positive: true,
      icon: "📊",
      color: "--warning-600",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.username}! 👋</h1>
        <p className="page-subtitle">
          Here's an overview of your financial progress and current budget
          status.
        </p>
      </div>

      <div className="dashboard-layout">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Financial Overview
          </h2>
          <div className="dashboard-stats">
            {mockStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-card-title">{stat.title}</h3>
                  <div
                    className="stat-card-icon"
                    style={{
                      backgroundColor: `var(${stat.color.replace("600", "50")})`,
                      color: `var(${stat.color})`,
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="stat-card-value">{stat.value}</div>
                <div
                  className={`stat-card-change ${stat.positive ? "positive" : "negative"}`}
                >
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-card-header">
                <h3 className="stat-card-title">Manage Budgets</h3>
                <div
                  className="stat-card-icon"
                  style={{
                    backgroundColor: "var(--primary-50)",
                    color: "var(--primary-600)",
                  }}
                >
                  💸
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Create, edit, and monitor your budgets to stay on track with
                your financial goals.
              </p>
              <Link to="/budgets" className="btn btn-primary">
                View Budgets
              </Link>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3 className="stat-card-title">Add Expense</h3>
                <div
                  className="stat-card-icon"
                  style={{
                    backgroundColor: "var(--warning-50)",
                    color: "var(--warning-600)",
                  }}
                >
                  📝
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Record a new expense and categorize it to keep your budget
                tracking accurate.
              </p>
              <button className="btn btn-secondary" disabled>
                Coming Soon
              </button>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <h3 className="stat-card-title">View Reports</h3>
                <div
                  className="stat-card-icon"
                  style={{
                    backgroundColor: "var(--success-50)",
                    color: "var(--success-600)",
                  }}
                >
                  📈
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Analyze your spending patterns and get insights to improve your
                financial health.
              </p>
              <button className="btn btn-secondary" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Username</label>
                <div
                  className="form-input bg-gray-50"
                  style={{ cursor: "not-allowed" }}
                >
                  {user.username}
                </div>
              </div>
              <div>
                <label className="form-label">Email</label>
                <div
                  className="form-input bg-gray-50"
                  style={{ cursor: "not-allowed" }}
                >
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
