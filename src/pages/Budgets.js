import React, { useState, useEffect } from "react";
import "../styles/Budgets.css";
import "../styles/Expenses.css";
import ExpenseForm from "../components/ExpenseForm";

function Budgets({ user }) {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ title: "", amount: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(null);

  useEffect(() => {
    setIsLoading(true);
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
      })
      .finally(() => setIsLoading(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Budget title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    fetch("http://localhost:5555/budgets", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        user_id: user.id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((newBudget) => {
        setBudgets([...budgets, newBudget]);
        setFormData({ title: "", amount: "" });
      })
      .catch((error) => {
        console.error("Failed to create budget:", error);
        setErrors({ general: "Failed to create budget. Please try again." });
      })
      .finally(() => setIsSubmitting(false));
  }

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    fetch(`http://localhost:5555/budgets/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        setBudgets(budgets.filter((b) => b.id !== id));
      })
      .catch((error) => {
        console.error("Failed to delete budget:", error);
        alert("Failed to delete budget. Please try again.");
      });
  }

  function handleExpenseAdded(newExpense) {
    // Update the budget to include the new expense
    setBudgets(
      budgets.map((budget) => {
        if (budget.id === newExpense.budget_id) {
          return {
            ...budget,
            expenses: [...(budget.expenses || []), newExpense],
          };
        }
        return budget;
      }),
    );
    setShowExpenseForm(null);
  }

  function handleShowExpenseForm(budget) {
    setShowExpenseForm(budget);
  }

  function handleCancelExpenseForm() {
    setShowExpenseForm(null);
  }

  function getBudgetProgress(budget) {
    const totalSpent =
      budget.expenses?.reduce((sum, e) => sum + e.cost, 0) || 0;
    const percentUsed = Math.min((totalSpent / budget.amount) * 100, 100);
    const remaining = Math.max(budget.amount - totalSpent, 0);

    let progressClass = "progress-safe";
    let statusClass = "healthy";

    if (percentUsed > 90) {
      progressClass = "progress-danger";
      statusClass = "over-budget";
    } else if (percentUsed > 70) {
      progressClass = "progress-warning";
      statusClass = "warning";
    }

    return {
      totalSpent,
      percentUsed,
      remaining,
      progressClass,
      statusClass,
    };
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your budgets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="budgets-page">
      <div className="page-container">
        <div className="budgets-header">
          <div className="budgets-header-content">
            <h1 className="budgets-title">Budget Management</h1>
            <p className="budgets-subtitle">
              Create and manage your budgets to stay on track with your
              financial goals.
            </p>
          </div>
        </div>

        <div className="budget-form-container">
          <div className="budget-form-header">
            <h2 className="budget-form-title">Create New Budget</h2>
            <p className="budget-form-description">
              Set up a new budget category to track your expenses effectively.
            </p>
          </div>

          {errors.general && (
            <div className="error-container mb-4">
              <div className="error-message">{errors.general}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="budget-form">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Budget Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Groceries, Entertainment"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? "error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Budget Amount (KSh)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={`form-input ${errors.amount ? "error" : ""}`}
                disabled={isSubmitting}
              />
              {errors.amount && (
                <div className="form-error">{errors.amount}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Budget"}
            </button>
          </form>
        </div>

        {budgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💰</div>
            <h3 className="empty-state-title">No Budgets Yet</h3>
            <p className="empty-state-description">
              Create your first budget above to start tracking your expenses and
              managing your finances effectively.
            </p>
          </div>
        ) : (
          <div className="budgets-grid">
            {budgets.map((budget) => {
              const progress = getBudgetProgress(budget);

              return (
                <div key={budget.id} className="budget-card">
                  <div
                    className={`budget-status ${progress.statusClass}`}
                  ></div>

                  <div className="budget-card-header">
                    <h3 className="budget-card-title">{budget.title}</h3>
                  </div>

                  <div className="budget-amounts">
                    <div className="budget-amount-row">
                      <span className="budget-amount-label">Total Budget</span>
                      <span className="budget-amount-value budget-amount-total">
                        KSh {budget.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="budget-amount-row">
                      <span className="budget-amount-label">Spent</span>
                      <span className="budget-amount-value budget-amount-spent">
                        KSh {progress.totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div className="budget-amount-row">
                      <span className="budget-amount-label">Remaining</span>
                      <span className="budget-amount-value budget-amount-remaining">
                        KSh {progress.remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="progress-container">
                    <div className="progress-header">
                      <span className="budget-amount-label">Progress</span>
                      <span className="progress-percentage">
                        {progress.percentUsed.toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${progress.progressClass}`}
                        style={{ width: `${progress.percentUsed}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="budget-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDelete(budget.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleShowExpenseForm(budget)}
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showExpenseForm && (
          <ExpenseForm
            budget={showExpenseForm}
            onExpenseAdded={handleExpenseAdded}
            onCancel={handleCancelExpenseForm}
          />
        )}
      </div>
    </div>
  );
}

export default Budgets;
