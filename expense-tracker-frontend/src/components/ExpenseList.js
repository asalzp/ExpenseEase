import React, { useEffect, useState } from "react";
import { getExpenses } from "../services/api";
import AddExpense from "./AddExpense";
import { useNavigate } from "react-router-dom";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
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

  return (
    <div>
      <h1>Expense Tracker</h1>
      <AddExpense onAdd={handleAddExpense} />
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.date}: {expense.category} - ${expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
