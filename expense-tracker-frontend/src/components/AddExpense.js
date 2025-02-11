import React, { useState } from "react";
import { addExpense } from "../services/api";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const AddExpense = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });

  const categories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"];

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
  
  const today = new Date().toISOString().split("T")[0]

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select name="category" value={formData.category} onChange={handleChange} required>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Amount & Date Fields */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            type="number"
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }} // Prevents future dates
          />
        </Box>

        {/* Description */}
        <TextField
          fullWidth
          multiline
          rows={2}
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Expense
        </Button>
      </form>
    </Paper>
  );
};

export default AddExpense;
