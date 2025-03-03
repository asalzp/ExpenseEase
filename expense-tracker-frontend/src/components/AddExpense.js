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
        borderRadius: "5px",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
          <InputLabel
            sx={{
              color: "#B3B7C6", // Default label color
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
              marginBottom: "-.5rem",
              backgroundColor: "#676F8D !important", // Background color
              borderRadius: "2px",
              color: "white",
              "&:before": {
                borderBottom: "2px solid transparent", // Default hidden border
              },
              "&:hover:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color on hover
              },
              "&.Mui-focused:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color when focused
              },
              "& .MuiSelect-icon": { color: "white" }, // White dropdown arrow
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#424769", // Background color of dropdown menu
                  color: "white", // Text color
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
              "& .MuiFilledInput-root": {
                backgroundColor: "#676F8D !important", // Background color
                borderRadius: "2px",
                marginBottom: "-.5rem",
                color: "white",
                "&:before": {
                  borderBottom: "2px solid transparent", // Default border (hidden)
                },
                "&:hover:before": {
                  borderBottom: "2px solid #f9b17a !important", // Border color on hover
                },
                "&.Mui-focused:before": {
                  borderBottom: "2px solid #f9b17a !important", // Border color when clicked (focused)
                },
              },
              "& .MuiInputLabel-root": {
                color: "#B3B7C6", // Default label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#f9b17a", // Label color when focused (clicked)
              },
            }}
          />
          <TextField
            fullWidth
            type="date"
            name="date"
            label="Date"
            value={formData.date}
            onChange={handleChange}
            required
            color="white"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              max: today, sx: {
                "&::-webkit-calendar-picker-indicator": {
                  filter: "invert(1)", // Makes the calendar icon white
                },
              }
            }}
            variant="filled"
            sx={{
              marginBottom: ".5rem",
              "& .MuiFilledInput-root": {
                backgroundColor: "#676F8D !important", // Background color
                borderRadius: "2px",
                color: "white",
                "&:before": {
                  borderBottom: "2px solid transparent", // Default border (hidden)
                },
                "&:hover:before": {
                  borderBottom: "2px solid #f9b17a !important", // Border color on hover
                },
                "&.Mui-focused:before": {
                  borderBottom: "2px solid #f9b17a !important", // Border color when clicked (focused)
                },
              },
              "& .MuiInputLabel-root": {
                color: "#B3B7C6", // Default label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#f9b17a", // Label color when focused (clicked)
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
            marginBottom: "10px",
            "& .MuiFilledInput-root": {
              backgroundColor: "#676F8D !important", // Background color
              borderRadius: "2px",
              color: "white",
              "&:before": {
                borderBottom: "2px solid transparent", // Default border (hidden)
              },
              "&:hover:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color on hover
              },
              "&.Mui-focused:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color when clicked (focused)
              },
            },
            "& .MuiInputLabel-root": {
              color: "#B3B7C6", // Default label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#f9b17a", // Label color when focused (clicked)
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
            borderRadius: "2px",
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
