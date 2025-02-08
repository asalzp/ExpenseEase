import React, { useEffect, useState } from 'react';
import { getExpenseSummary } from '../services/api';

const ExpenseSummary = () => {
  const [summary, setSummary] = useState({ total_spent: 0, category_breakdown: [] });

  useEffect(() => {
    getExpenseSummary()
      .then(response => setSummary(response.data))
      .catch(error => console.error("Error fetching summary:", error));
  }, []);

  return (
    <div>
      <h2>Expense Summary</h2>
      <p><strong>Total Spent:</strong> ${summary.total_spent.toFixed(2)}</p>
      <h3>Breakdown by Category:</h3>
      <ul>
        {summary.category_breakdown.map((item, index) => (
          <li key={index}>{item.category}: ${item.total.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseSummary;
