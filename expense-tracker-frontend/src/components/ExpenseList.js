import React, { useEffect, useState } from "react";
import { getExpenses, updateExpense, deleteExpense } from "../services/api";
import AddExpense from "./AddExpense";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  Container,
  Typography,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGoToSummary = () => {
    navigate("/summary");
  };

  return (
    <Container maxWidth="md">
      <Navbar />
      <Typography variant="h4" align="center" sx={{ mt: 3, mb: 3 }}>
        Expense Tracker
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <AddExpense onAdd={handleAddExpense} />

        {/* Filter & Sorting */}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Select
            fullWidth
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">Sort By</MenuItem>
            <MenuItem value="date">Date (Oldest to Newest)</MenuItem>
            <MenuItem value="-date">Date (Newest to Oldest)</MenuItem>
            <MenuItem value="amount">Amount (Low to High)</MenuItem>
            <MenuItem value="-amount">Amount (High to Low)</MenuItem>
          </Select>

          <Button variant="contained" color="primary" onClick={handleGoToSummary}>
            Go to Summary
          </Button>
        </Box>
      </Paper>

      {/* Expense List Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                {editMode === expense.id ? (
                  <>
                    <TableCell>
                      <TextField
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="success" onClick={handleUpdate}>
                        Save
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => setEditMode(null)}>
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>${expense.amount}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(expense)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleDelete(expense.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ExpenseList;
