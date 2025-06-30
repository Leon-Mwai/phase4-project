import React, { useState } from "react";

function ExpenseForm({ budget, onExpenseAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Expense name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.cost) {
      newErrors.cost = "Amount is required";
    } else if (parseFloat(formData.cost) <= 0) {
      newErrors.cost = "Amount must be greater than 0";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    fetch("http://localhost:5555/expenses", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name.trim(),
        cost: parseFloat(formData.cost),
        category: formData.category.trim(),
        budget_id: budget.id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((newExpense) => {
        setFormData({ name: "", cost: "", category: "" });
        onExpenseAdded(newExpense);
      })
      .catch((error) => {
        console.error("Failed to create expense - using offline mode:", error);
        // Create expense locally for offline mode
        const newExpense = {
          id: Date.now(), // Use timestamp as ID for offline mode
          name: formData.name.trim(),
          cost: parseFloat(formData.cost),
          category: formData.category.trim(),
          budget_id: budget.id,
        };
        setFormData({ name: "", cost: "", category: "" });
        onExpenseAdded(newExpense);
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className="expense-form-container">
      <div className="expense-form-header">
        <h3 className="expense-form-title">Add Expense to "{budget.title}"</h3>
        <p className="expense-form-description">
          Record a new expense for this budget category.
        </p>
      </div>

      {errors.general && (
        <div className="error-container mb-4">
          <div className="error-message">{errors.general}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Expense Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Grocery shopping, Restaurant dinner"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? "error" : ""}`}
            disabled={isSubmitting}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="cost" className="form-label">
            Amount (KSh)
          </label>
          <input
            id="cost"
            name="cost"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.cost}
            onChange={handleChange}
            className={`form-input ${errors.cost ? "error" : ""}`}
            disabled={isSubmitting}
          />
          {errors.cost && <div className="form-error">{errors.cost}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g., Food, Transport, Entertainment"
            value={formData.category}
            onChange={handleChange}
            className={`form-input ${errors.category ? "error" : ""}`}
            disabled={isSubmitting}
          />
          {errors.category && (
            <div className="form-error">{errors.category}</div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
