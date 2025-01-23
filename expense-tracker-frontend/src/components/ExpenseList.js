import React, { useEffect, useState } from 'react';
import { getExpenses } from '../services/api';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses().then((response) => setExpenses(response.data));
  }, []);

  return (
    <div>
      <h1>Expense Tracker</h1>
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
