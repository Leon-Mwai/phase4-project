import React, { useState, useEffect } from "react";

function ExpenseList({ user, budgets = [] }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState("all");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5555/expenses", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setExpenses(data))
      .catch((error) => {
        console.error("Failed to fetch expenses:", error);
        setExpenses([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function handleDeleteExpense(expenseId) {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    fetch(`http://localhost:5555/expenses/${expenseId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        setExpenses(expenses.filter((e) => e.id !== expenseId));
      })
      .catch((error) => {
        console.error("Failed to delete expense:", error);
        alert("Failed to delete expense. Please try again.");
      });
  }

  // Filter expenses based on selected budget
  const filteredExpenses = expenses.filter((expense) => {
    if (selectedBudget === "all") return true;
    return expense.budget_id === parseInt(selectedBudget);
  });

  // Group expenses by budget for summary
  const expenseSummary = budgets.map((budget) => {
    const budgetExpenses = expenses.filter((e) => e.budget_id === budget.id);
    const totalSpent = budgetExpenses.reduce((sum, e) => sum + e.cost, 0);
    return {
      ...budget,
      expenseCount: budgetExpenses.length,
      totalSpent,
      remaining: budget.amount - totalSpent,
    };
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <div className="expense-summary">
        <h3 className="section-title">Expense Summary</h3>
        <div className="summary-stats">
          <div className="summary-stat">
            <div className="summary-stat-value">
              KSh {totalExpenses.toLocaleString()}
            </div>
            <div className="summary-stat-label">Total Spent</div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat-value">{expenses.length}</div>
            <div className="summary-stat-label">
              {expenses.length === 1 ? "Transaction" : "Transactions"}
            </div>
          </div>
          <div className="summary-stat">
            <div className="summary-stat-value">{budgets.length}</div>
            <div className="summary-stat-label">
              Active {budgets.length === 1 ? "Budget" : "Budgets"}
            </div>
          </div>
        </div>

        {expenseSummary.length > 0 && (
          <div className="budget-summary-grid">
            {expenseSummary.map((budget) => (
              <div key={budget.id} className="budget-summary-card">
                <h4 className="budget-summary-title">{budget.title}</h4>
                <div className="budget-summary-amounts">
                  <div className="budget-summary-row">
                    <span>Budget:</span>
                    <span>KSh {budget.amount.toLocaleString()}</span>
                  </div>
                  <div className="budget-summary-row">
                    <span>Spent:</span>
                    <span>KSh {budget.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="budget-summary-row">
                    <span>Remaining:</span>
                    <span
                      className={
                        budget.remaining < 0 ? "text-error" : "text-success"
                      }
                    >
                      KSh {budget.remaining.toLocaleString()}
                    </span>
                  </div>
                  <div className="budget-summary-row">
                    <span>Transactions:</span>
                    <span>{budget.expenseCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="expense-list">
        <div className="expense-list-header">
          <h3 className="section-title">Transaction History</h3>
          <div className="expense-filter">
            <label htmlFor="budget-filter" className="form-label">
              Filter by Budget:
            </label>
            <select
              id="budget-filter"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="form-input"
            >
              <option value="all">All Budgets</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <h3 className="empty-state-title">No Expenses Yet</h3>
            <p className="empty-state-description">
              {selectedBudget === "all"
                ? "Start adding expenses to track your spending across all budgets."
                : "No expenses found for the selected budget."}
            </p>
          </div>
        ) : (
          <div className="expense-grid">
            {filteredExpenses.map((expense) => {
              const budget = budgets.find((b) => b.id === expense.budget_id);
              return (
                <div key={expense.id} className="expense-card">
                  <div className="expense-card-header">
                    <h4 className="expense-name">{expense.name}</h4>
                    <div className="expense-amount">
                      KSh {expense.cost.toLocaleString()}
                    </div>
                  </div>
                  <div className="expense-details">
                    <div className="expense-detail">
                      <span className="expense-detail-label">Category:</span>
                      <span className="expense-category">
                        {expense.category}
                      </span>
                    </div>
                    <div className="expense-detail">
                      <span className="expense-detail-label">Budget:</span>
                      <span className="expense-budget">
                        {budget ? budget.title : "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="expense-actions">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
