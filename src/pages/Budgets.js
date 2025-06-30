import React, { useState, useEffect } from "react";
import "../styles/Budgets.css";

function Budgets({ user }) {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ title: "", amount: "" });

  useEffect(() => {
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
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5555/budgets", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
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
        alert("Failed to create budget. Backend server may not be running.");
      });
  }

  function handleDelete(id) {
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
        alert("Failed to delete budget. Backend server may not be running.");
      });
  }

  return (
    <div className="budgets-container">
      <h2>Budgets</h2>

      <form onSubmit={handleSubmit} className="budget-form">
        <input
          name="title"
          placeholder="Budget Title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          name="amount"
          placeholder="Amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
        />
        <button type="submit">Add Budget</button>
      </form>

      {budgets.map((budget) => {
        const totalSpent =
          budget.transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
        const percentUsed = Math.min((totalSpent / budget.amount) * 100, 100);

        return (
          <div key={budget.id} className="budget-card">
            <h3>{budget.title}</h3>
            <p>Total Budget: Ksh {budget.amount}</p>
            <p>Spent: Ksh {totalSpent.toFixed(2)}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${percentUsed}%`,
                  backgroundColor:
                    percentUsed > 90
                      ? "#e74c3c"
                      : percentUsed > 70
                        ? "#f39c12"
                        : "#27ae60",
                }}
              ></div>
            </div>
            <p>{percentUsed.toFixed(1)}% used</p>
            <button onClick={() => handleDelete(budget.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default Budgets;
