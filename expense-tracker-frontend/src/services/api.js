import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/expenses/';

export const getExpenses = () => axios.get(API_URL);
export const addExpense = (expense) => axios.post(API_URL, expense);
