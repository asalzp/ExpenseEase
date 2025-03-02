import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { getSpendingTrends, getCategoryBreakdown } from '../services/api';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import randomColor from 'randomcolor';
import dayjs from 'dayjs';

// Register components for Line and Pie charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SpendingTrendsChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [timePeriod, setTimePeriod] = useState('month'); // Default to 'month'

  useEffect(() => {
    getSpendingTrends(timePeriod)
      .then(response => {
        const data = response.data.trends;

        if (data && Array.isArray(data)) {
          setChartData({
            labels: data.map(item => dayjs(item.period).format(timePeriod === 'month' ? 'MMM DD' : 'DD MMM')),
            datasets: [
              {
                label: `Total Spending (${timePeriod})`,
                data: data.map(item => item.total),
                borderColor: "#f9b17a",
                backgroundColor: "rgba(249, 177, 122, 0.2)",
                fill: true,
                tension: 0.3, // Smooth line
              }
            ]
          });
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch(error => console.error("Error fetching trends:", error));

    getCategoryBreakdown(timePeriod)
      .then(response => {
        const data = response?.data?.category_breakdown || [];
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("Empty or invalid category breakdown data.");
          return;
        }

        const colors = randomColor({ count: data.length, luminosity: "bright" });
        setPieData({
          labels: data.map(item => item.category),
          datasets: [
            {
              label: `Spending by Category (${timePeriod})`,
              data: data.map(item => item.total),
              backgroundColor: colors,
            }
          ]
        });
      })
      .catch(error => console.error("Error fetching category breakdown:", error));

  }, [timePeriod]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      {/* Time Period Selector */}
      <FormControl sx={{ mb: 4, width: '200px' }}>
      <InputLabel
        sx={{
          color: "#B3B7C6", // Default label color (light gray)
          "&.Mui-focused": { color: "#f9b17a" }, // Changes label color when focused (mustard yellow)
        }}
      >
        Time Period
      </InputLabel>
          <Select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          variant="filled"
          color="white"
          sx={{
            backgroundColor: "#676F8D",
            color: "white",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center", // Ensures text is vertically centered
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center", // Centers text inside the select box
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
          <MenuItem
            value="month"
            sx={{
              color: "white", // Text color
              backgroundColor: "#424769", // Background color
              "&:hover": {
                backgroundColor: "#5A617F", // Hover effect
              },
            }}
          >
            Month
          </MenuItem>
          <MenuItem
            value="week"
            sx={{
              color: "white", // Text color
              backgroundColor: "#424769", // Background color
              "&:hover": {
                backgroundColor: "#5A617F", // Hover effect
              },
            }}
          >
            Week
          </MenuItem>
        </Select>

      </FormControl>

      {/* Line Chart */}
      <Paper
        sx={{
          p: 3,
          maxWidth: 800,
          width: '100%',
          backgroundColor: "#424769",
          color: "white",
          borderRadius: "12px",
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
          Spending Trends ({timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})
        </Typography>
        <Box sx={{ width: '100%', height: 400 }}>
          <Line data={chartData} />
        </Box>
      </Paper>

      {/* Pie Chart */}
      <Paper
        sx={{
          p: 3,
          maxWidth: 800,
          width: '100%',
          backgroundColor: "#424769",
          color: "white",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
          Category Breakdown
        </Typography>
        <Box sx={{ width: '100%', height: 400 }}>
          <Pie data={pieData} />
        </Box>
      </Paper>
    </Box>
  );
};

export default SpendingTrendsChart;
