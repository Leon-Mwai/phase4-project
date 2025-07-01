import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Take Control of Your Finances with BrokeBuddy 💰
        </h1>
        <p className="page-subtitle">
          The smart way to manage your budget, track expenses, and achieve your
          financial goals. Join thousands who've already transformed their
          financial future.
        </p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Smart Budgeting</h3>
            <div
              className="stat-card-icon"
              style={{
                backgroundColor: "var(--primary-50)",
                color: "var(--primary-600)",
              }}
            >
              💡
            </div>
          </div>
          <p className="text-gray-600">
            Create intelligent budgets that adapt to your spending patterns and
            help you save more effectively.
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Expense Tracking</h3>
            <div
              className="stat-card-icon"
              style={{
                backgroundColor: "var(--success-50)",
                color: "var(--success-600)",
              }}
            >
              📊
            </div>
          </div>
          <p className="text-gray-600">
            Monitor your spending in real-time with detailed analytics and
            insights into your financial habits.
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Goal Achievement</h3>
            <div
              className="stat-card-icon"
              style={{
                backgroundColor: "var(--warning-50)",
                color: "var(--warning-600)",
              }}
            >
              🎯
            </div>
          </div>
          <p className="text-gray-600">
            Set financial goals and track your progress with visual indicators
            and milestone celebrations.
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          No credit card required • Free forever • Start in 2 minutes
        </p>
      </div>

      <div className="mt-16">
        <div className="card">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Choose BrokeBuddy?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600">
                  Your financial data is encrypted and protected with bank-level
                  security.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Easy to Use
                </h3>
                <p className="text-gray-600">
                  Intuitive interface designed for everyone, from beginners to
                  experts.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Real-time Updates
                </h3>
                <p className="text-gray-600">
                  Get instant insights and notifications about your spending
                  patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
