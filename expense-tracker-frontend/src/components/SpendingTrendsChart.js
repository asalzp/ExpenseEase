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
        <InputLabel sx={{ color: "white" }}>Time Period</InputLabel>
        <Select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          sx={{
            backgroundColor: "#676F8D",
            color: "white",
            borderRadius: "5px",
            "& .MuiSelect-icon": { color: "white" },
          }}
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="week">Week</MenuItem>
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
