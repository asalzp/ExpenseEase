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

  const today = new Date().toISOString().split("T")[0];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: "#424769",
        color: "white",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel 
            sx={{ 
              color: "#B3B7C6", // Mustard yellow by default
              "&.Mui-focused": { color: "#f9b17a !important" }, // Mustard yellow when focused
            }}
          >
            Category
          </InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            variant="filled"
            color="white"
            sx={{
              backgroundColor: "#676F8D",
              color: "white",
              borderRadius: "5px",
              "& .MuiSelect-icon": { color: "white" }, // Ensures dropdown icon is white
              "&:hover": {
                backgroundColor: "#5A617F",
              },
              "&.Mui-focused": {
                backgroundColor: "#5A617F",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#424769", // Background color of dropdown menu
                  color: "white", // Text color of menu items
                },
              },
            }}
          >
            {categories.map((cat) => (
              <MenuItem
                key={cat}
                value={cat}
                sx={{
                  color: "white", // Text color
                  backgroundColor: "#424769", // Background color
                  "&:hover": {
                    backgroundColor: "#5A617F", // Hover effect
                  },
                }}
              >
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        {/* Amount & Date Fields */}
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            type="number"
            name="amount"
            label="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            variant="filled"
            color="white"
            sx={{
              backgroundColor: "#676F8D",
              borderRadius: "5px",
              "& .MuiInputBase-input": { color: "white" },
              "& .MuiInputLabel-root": { color: "#B3B7C6" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#f9b17a" },
              "& .MuiFilledInput-root": {
                backgroundColor: "#676F8D !important",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#5A617F !important",
                },
                "&.Mui-focused": {
                  backgroundColor: "#5A617F !important",
                  borderBottom: "2px solid #f9b17a !important",
                },
              },
            }}
          />
          <TextField
            fullWidth
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            color="white"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }}
            variant="filled"
            sx={{
              backgroundColor: "#676F8D",
              borderRadius: "5px",
              "& .MuiInputBase-input": { color: "white" },
              "& .MuiInputLabel-root": { color: "#B3B7C6" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#f9b17a" },
              "& .MuiFilledInput-root": {
                backgroundColor: "#676F8D !important",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#5A617F !important",
                },
                "&.Mui-focused": {
                  backgroundColor: "#5A617F !important",
                  borderBottom: "2px solid #f9b17a !important",
                },
              },
            }}
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
          variant="filled"
          color="white"
          sx={{
            mb: 2,
            backgroundColor: "#676F8D",
            borderRadius: "5px",
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputLabel-root": { color: "#B3B7C6" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#f9b17a" },
            "& .MuiFilledInput-root": {
              backgroundColor: "#676F8D !important",
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "#5A617F !important",
              },
              "&.Mui-focused": {
                backgroundColor: "#5A617F !important",
                borderBottom: "2px solid #f9b17a !important",
              },
            },
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          sx={{
            backgroundColor: "#f9b17a",
            color: "#2d3250",
            boxShadow: "0 0 10px #f9b17a",
            "&:hover": {
              backgroundColor: "#f9b17a",
              boxShadow: "0 0 20px #f9b17a",
            },
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Add Expense
        </Button>
      </form>
    </Paper>
  );
};

export default AddExpense;
