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
  InputLabel,
  FormControl
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
    console.log("clicked")
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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 3 }}>
      <Container maxWidth="md">
        <Navbar />
        <Typography variant="h4" align="center" sx={{ color: "white", mt: 3, mb: 3 }}>
          Expense Tracker
        </Typography>
        
        {/* Add Expense Form */}
        <Paper sx={{ p: 3, mb: 3, backgroundColor: "#424769", color: "white", borderRadius: "12px", overflow: "visible" }}>
          <AddExpense onAdd={handleAddExpense} />

          {/* Filter & Sorting */}
          <Box sx={{ display: "flex", gap: 2, mt: 3, alignItems: "center" }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              sx={{
                color: "#B3B7C6", // Light gray label by default
                "&.Mui-focused": { color: "#f9b17a !important" }, // Mustard yellow when focused
              }}
            >
              Sort By
            </InputLabel>
            <Select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
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
                    backgroundColor: "#424769", // Dark background for dropdown menu
                    color: "white", // White text inside the dropdown
                  },
                },
              }}
            >
              {/* Default option */}
              <MenuItem
                value=""
                sx={{
                  color: "#f9b17a", // Mustard yellow text
                  fontWeight: "bold",
                }}
              >
              </MenuItem>

              {/* Sorting options */}
              {["date", "-date", "amount", "-amount"].map((sortType) => (
                <MenuItem
                  key={sortType}
                  value={sortType}
                  sx={{
                    color: "white", // Text color
                    backgroundColor: "#424769", // Background color
                    "&:hover": {
                      backgroundColor: "#5A617F", // Hover effect
                    },
                  }}
                >
                  {sortType === "date"
                    ? "Date (Oldest to Newest)"
                    : sortType === "-date"
                    ? "Date (Newest to Oldest)"
                    : sortType === "amount"
                    ? "Amount (Low to High)"
                    : "Amount (High to Low)"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


            <Button
              variant="contained"
              sx={{
                backgroundColor: "#f9b17a",
                color: "#2d3250",
                fontWeight: "bold",
                borderRadius: "8px",
                px: 3,
                boxShadow: "0 0 10px #f9b17a",
                "&:hover": { boxShadow: "0 0 20px #f9b17a" },
              }}
              onClick={handleGoToSummary}
            >
              Go to Summary
            </Button>
          </Box>
        </Paper>

        {/* Expense List Table */}
        <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#424769",
              color: "white",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#2d3250" }}>
                  {["Date", "Category", "Amount", "Actions"].map((header) => (
                    <TableCell key={header} sx={{ color: "white", fontWeight: "bold", py: 1.5 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    sx={{
                      backgroundColor: "#2d3250",
                      "&:hover": { backgroundColor: "#363b5a" },
                      transition: "0.2s ease-in-out",
                    }}
                  >
                    {editMode === expense.id ? (
                      // **Edit Mode - Show Inputs & Buttons in One Row**
                      <TableCell colSpan={4} sx={{ padding: "12px" }}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Date Input */}
                          <TextField
                            type="date"
                            value={editData.date || ""}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            sx={{
                              backgroundColor: "#676F8D",
                              borderRadius: "5px",
                              minWidth: "130px",
                              "& .MuiInputBase-input": { color: "white", height: "42px" },
                            }}
                          />

                          {/* Category Select */}
                          <Select
                            value={editData.category || ""}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            variant="filled"
                            color="white"
                            sx={{
                              backgroundColor: "#676F8D",
                              color: "white",
                              borderRadius: "5px",
                              minWidth: "130px",
                              display: "flex",
                              alignItems: "center", // Ensures text is vertically centered
                              "& .MuiSelect-select": {
                                display: "flex",
                                alignItems: "center", // Ensures the selected text is vertically aligned
                                padding: "10px",
                              },
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


                          {/* Amount Input */}
                          <TextField
                            type="number"
                            value={editData.amount || ""}
                            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                            sx={{
                              backgroundColor: "#676F8D",
                              borderRadius: "5px",
                              minWidth: "100px",
                              "& .MuiInputBase-input": { color: "white", height: "42px" },
                            }}
                          />

                          {/* Save & Cancel Buttons */}
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "#f9b17a",
                                color: "#2d3250",
                                fontWeight: "bold",
                                borderRadius: "6px",
                                px: 3,
                                height: "42px",
                                minWidth: "90px",
                                boxShadow: "0 0 10px #f9b17a",
                                "&:hover": {
                                  backgroundColor: "#f9b17a",
                                  boxShadow: "0 0 20px #f9b17a",
                                },
                              }}
                              onClick={handleUpdate}
                            >
                              Save
                            </Button>

                            <Button
                              variant="outlined"
                              sx={{
                                color: "#f9b17a",
                                borderColor: "#f9b17a",
                                fontWeight: "bold",
                                borderRadius: "6px",
                                px: 3,
                                height: "42px",
                                minWidth: "90px",
                                "&:hover": { borderColor: "#d8955d", color: "#d8955d" },
                              }}
                              onClick={() => setEditMode(null)}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      </TableCell>
                    ) : (
                      // **Default Mode - Show Static Data**
                      <>
                        <TableCell sx={{ color: "white" }}>{expense.date}</TableCell>
                        <TableCell sx={{ color: "white" }}>{expense.category}</TableCell>
                        <TableCell sx={{ color: "#f9b17a", fontWeight: "bold" }}>
                          ${Number(expense.amount).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            sx={{
                              color: "#f9b17a",
                              borderColor: "#f9b17a",
                              borderRadius: "6px",
                              fontWeight: "bold",
                              "&:hover": { borderColor: "#d8955d", color: "#d8955d" },
                            }}
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#ae7b55",
                              color: "white",
                              fontWeight: "bold",
                              borderRadius: "6px",
                              "&:hover": { backgroundColor: "#7b0000" },
                            }}
                            onClick={() => handleDelete(expense.id)}
                          >
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
    </Box>
  );
};

export default ExpenseList;
