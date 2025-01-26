import React, { useEffect, useState } from 'react';
import { getExpenses } from '../services/api';
import AddExpense from './AddExpense';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses().then((response) => setExpenses(response.data));
  }, []);

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
