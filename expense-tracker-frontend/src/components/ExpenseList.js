import React, { useEffect, useState } from "react";
import { getExpenses, updateExpense, deleteExpense } from "../services/api";
import AddExpense from "./AddExpense";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({ category: "", date: "", sort: "" });
  const navigate = useNavigate();

  const categories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    } else {
      // Construct query params including filters and sort
      const urlParams = new URLSearchParams();
      if (filters.category) urlParams.append("category", filters.category);
      if (filters.date) urlParams.append("date", filters.date);
      if (filters.sort) urlParams.append("ordering", filters.sort);
  
      getExpenses(urlParams.toString()).then((response) => setExpenses(response.data));
    }
  }, [navigate, filters]);

  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleEdit = (expense) => {
    setEditMode(expense.id);
    setEditData(expense);
  };

  const handleUpdate = async () => {
    try {
      await updateExpense(editMode, editData);
      setExpenses(expenses.map((exp) => (exp.id === editMode ? editData : exp)));
      setEditMode(null);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Handle input changes for filters
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGoToSummary = () => {
    navigate("/summary");  // Redirect to summary page
  };


  return (
    <div>
      <Navbar />
      <h1>Expense Tracker</h1>
      <AddExpense onAdd={handleAddExpense} />

      {/* Filter and Sort Controls */}
      <div>
        <div>
          <label>Sort By:</label>
          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="">Select Sorting Option</option>
            <option value="date">Date (Oldest to Newest)</option>
            <option value="-date">Date (Newest to Oldest)</option>
            <option value="amount">Amount (Low to High)</option>
            <option value="-amount">Amount (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Button to go to the Expense Summary page */}
      <button onClick={handleGoToSummary}>Go to Expense Summary</button>

      {/* Expense List */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {editMode === expense.id ? (
              <>
                {/* Category Dropdown for Editing */}
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                />
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                {expense.date}: <strong>{expense.category}</strong> - ${expense.amount}
                <button onClick={() => handleEdit(expense)}>Edit</button>
                <button onClick={() => handleDelete(expense.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
