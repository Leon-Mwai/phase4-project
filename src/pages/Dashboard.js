import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ExpenseList from "../components/ExpenseList";
import "../styles/Expenses.css";

function Dashboard({ user, setUser }) {
  const [budgets, setBudgets] = useState([]);
  const [showExpenseReport, setShowExpenseReport] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("http://localhost:5555/budgets", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setBudgets(data))
        .catch((error) => {
          console.error("Failed to fetch budgets:", error);
          setBudgets([]);
        });
    }
  }, [user]);

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

  // Calculate real stats from budgets data
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => {
    const budgetSpent = budget.expenses?.reduce((s, e) => s + e.cost, 0) || 0;
    return sum + budgetSpent;
  }, 0);
  const totalSaved = totalBudget - totalSpent;
  const activeBudgets = budgets.length;

  const statsData = [
    {
      title: "Total Budget",
      value: `KSh ${totalBudget.toLocaleString()}`,
      change: `${activeBudgets} active budgets`,
      positive: true,
      icon: "💰",
      color: "--primary-600",
    },
    {
      title: "Money Spent",
      value: `KSh ${totalSpent.toLocaleString()}`,
      change: `${((totalSpent / totalBudget) * 100 || 0).toFixed(1)}% of budget`,
      positive: totalSpent <= totalBudget,
      icon: "💸",
      color: "--error-600",
    },
    {
      title: "Money Remaining",
      value: `KSh ${totalSaved.toLocaleString()}`,
      change: totalSaved >= 0 ? "Within budget" : "Over budget",
      positive: totalSaved >= 0,
      icon: "💎",
      color: "--success-600",
    },
    {
      title: "Active Budgets",
      value: activeBudgets.toString(),
      change:
        activeBudgets === 0 ? "Create your first budget" : "Budget categories",
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
            {statsData.map((stat, index) => (
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
              {budgets.length > 0 ? (
                <Link to="/budgets" className="btn btn-primary">
                  Add Expense
                </Link>
              ) : (
                <Link to="/budgets" className="btn btn-secondary">
                  Create Budget First
                </Link>
              )}
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
              <button
                className="btn btn-primary"
                onClick={() => setShowExpenseReport(!showExpenseReport)}
              >
                {showExpenseReport ? "Hide Reports" : "View Reports"}
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

        {showExpenseReport && (
          <section>
            <ExpenseList user={user} budgets={budgets} />
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
