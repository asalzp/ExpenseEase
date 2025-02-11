import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { getSpendingTrends, getCategoryBreakdown } from '../services/api';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import randomColor from 'randomcolor';
import dayjs from 'dayjs'; // For date formatting

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
    // Fetch spending trends based on selected period
    getSpendingTrends(timePeriod)
      .then(response => {
        const data = response.data.trends; // API returns data under 'trends'

        if (data && Array.isArray(data)) {
          setChartData({
            labels: data.map(item => dayjs(item.period).format(timePeriod === 'month' ? 'MMM DD' : 'DD MMM')),  // Format date
            datasets: [
              {
                label: `Total Spending (${timePeriod})`,
                data: data.map(item => item.total),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3, // Smooth line
              }
            ]
          });
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch(error => {
        console.error("Error fetching trends:", error);
      });

    // Fetch category breakdown for Pie Chart

    // Fetch category breakdown for Pie Chart
    getCategoryBreakdown(timePeriod)
      .then(response => {
        
        const data = response?.data?.category_breakdown || []; // Ensure valid data
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("Empty or invalid category breakdown data.");
          return;
        }

        const colors = randomColor({ count: data.length });
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

  }, [timePeriod]); // Update when `timePeriod` changes

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
      {/* Time Period Selector */}
      <FormControl sx={{ marginBottom: 4, width: '200px' }}>
        <InputLabel>Time Period</InputLabel>
        <Select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          label="Time Period"
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="week">Week</MenuItem>
        </Select>
      </FormControl>

      {/* Line Chart */}
      <Paper sx={{ padding: 3, maxWidth: 800, width: '100%', boxShadow: 3, marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom>
          Spending Trends ({timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})
        </Typography>
        <Box sx={{ width: '100%', height: 400 }}>
          <Line data={chartData} />
        </Box>
      </Paper>

      {/* Pie Chart */}
      <Paper sx={{ padding: 3, maxWidth: 800, width: '100%', boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
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
