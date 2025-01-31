import React, { useState } from "react";
import { addExpense } from "../services/api";

const AddExpense = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = 1; // TODO: Replace with actual user ID from authentication

    const expenseData = {
      ...formData,
      user: userId, // Attach user ID
    };

    try {
      const response = await addExpense(expenseData);
      onAdd(response.data);
      setFormData({ category: "", amount: "", date: "", description: "" }); // Reset form
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      ></textarea>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpense;
