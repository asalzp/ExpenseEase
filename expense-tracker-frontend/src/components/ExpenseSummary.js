import React, { useEffect, useState } from "react";
import { getExpenseSummary } from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const ExpenseSummary = () => {
  const [summary, setSummary] = useState({ total_spent: 0, category_breakdown: [] });
  const navigate = useNavigate(); // useNavigate hook to navigate to another page

  useEffect(() => {
    getExpenseSummary()
      .then((response) => setSummary(response.data))
      .catch((error) => console.error("Error fetching summary:", error));
  }, []);

  const goToSpendingTrends = () => {
    navigate("/spending-trends"); // Navigate to the spending trends page
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 400,
          mx: "auto",
          p: 3,
          backgroundColor: "#424769",
          color: "white",
          borderRadius: "12px",
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: "white", fontWeight: "bold" }}>
            Expense Summary
          </Typography>

          <Typography
            variant="h5"
            align="center"
            sx={{
              color: "#f9b17a",
              fontWeight: "bold",
              mb: 3, // Add space below
            }}
          >
            Total Spent: ${summary.total_spent.toFixed(2)}
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "white", textAlign: "center", mb: 2 }}>
            Breakdown by Category:
          </Typography>

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {summary.category_breakdown.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: "#2d3250",
                  borderRadius: "8px",
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "bold" }}>{item.category}</Typography>
                <Typography sx={{ color: "#f9b17a", fontWeight: "bold" }}>
                  ${item.total.toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>

          {/* Button to navigate to spending trends */}
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
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
                width: "100%",
              }}
              onClick={goToSpendingTrends}
            >
              View Spending Trends
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExpenseSummary;
