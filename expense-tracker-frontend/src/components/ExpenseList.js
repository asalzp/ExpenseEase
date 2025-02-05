import React, { useEffect, useState } from "react";
import { getExpenses, updateExpense, deleteExpense } from "../services/api";
import AddExpense from "./AddExpense";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    } else {
      getExpenses().then((response) => setExpenses(response.data));
    }
  }, [navigate]);

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
      setExpenses(expenses.map(exp => (exp.id === editMode ? editData : exp)));
      setEditMode(null);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Expense Tracker</h1>
      <AddExpense onAdd={handleAddExpense} />
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {editMode === expense.id ? (
              <>
                <input
                  type="text"
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                />
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
                {expense.date}: {expense.category} - ${expense.amount}
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
