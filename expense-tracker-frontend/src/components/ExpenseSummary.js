import React, { useEffect, useState } from "react";
import { getExpenseSummary } from "../services/api";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
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
    <Card elevation={3} sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Expense Summary
        </Typography>

        <Typography variant="h6" color="primary" align="center">
          Total Spent: ${summary.total_spent.toFixed(2)}
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
          Breakdown by Category:
        </Typography>

        <List>
          {summary.category_breakdown.map((item, index) => (
            <Box key={index}>
              <ListItem>
                <ListItemText primary={item.category} secondary={`$${item.total.toFixed(2)}`} />
              </ListItem>
              {index < summary.category_breakdown.length - 1 && <Divider />}
            </Box>
          ))}
        </List>

        {/* Button to navigate to spending trends */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="contained" color="primary" onClick={goToSpendingTrends}>
            View Spending Trends
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;
