import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { getSpendingTrends, getCategoryBreakdown } from '../services/api';
import { Box, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
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
  
  // State for month selection
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonthObj, setSelectedMonthObj] = useState(null);
  
  // Generate available months (up to current month)
  const generateMonthOptions = () => {
    const options = [];
    const startDate = dayjs().subtract(12, 'month'); // Start from 12 months ago
    const today = dayjs();
    
    let current = startDate;
    while (current.isBefore(today) || current.isSame(today, 'month')) {
      options.push({
        value: current.format('YYYY-MM'),
        label: current.format('MMMM YYYY'),
        month: current.month() + 1,
        year: current.year()
      });
      current = current.add(1, 'month');
    }
    
    return options;
  };
  
  const monthOptions = generateMonthOptions();
  
  // Initialize with current month
  useEffect(() => {
    const currentMonth = dayjs().format('YYYY-MM');
    setSelectedMonth(currentMonth);
    
    const currentMonthObj = monthOptions.find(m => m.value === currentMonth);
    setSelectedMonthObj(currentMonthObj);
  }, []);
  
  // Fetch data when period or month changes
  useEffect(() => {
    // Only fetch data if selectedMonthObj is available
    if (!selectedMonthObj) return;
    
    const { month, year } = selectedMonthObj;
    
    console.log(`Fetching data for ${month}/${year} with period ${timePeriod}`);
    
    // Fetch spending trends
    getSpendingTrends(timePeriod, '', month, year)
      .then(response => {
        if (!response || !response.data) {
          console.warn("No response or data from API");
          setChartData({ labels: [], datasets: [] });
          return;
        }
        
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
          setChartData({ labels: [], datasets: [] });
        }
      })
      .catch(error => {
        console.error("Error fetching trends:", error);
        setChartData({ labels: [], datasets: [] });
      });
    
    // Fetch category breakdown
    getCategoryBreakdown(timePeriod, '', month, year)
      .then(response => {
        if (!response || !response.data) {
          console.warn("No response or data from API");
          setPieData({ labels: [], datasets: [] });
          return;
        }
        
        const data = response?.data?.category_breakdown || [];
        
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("Empty or invalid category breakdown data.");
          setPieData({ labels: [], datasets: [] });
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
      .catch(error => {
        console.error("Error fetching category breakdown:", error);
        setPieData({ labels: [], datasets: [] });
      });
      
  }, [timePeriod, selectedMonthObj]);
  
  // Handle month selection change
  const handleMonthChange = (event) => {
    const newSelectedMonth = event.target.value;
    setSelectedMonth(newSelectedMonth);
    
    const newMonthObj = monthOptions.find(m => m.value === newSelectedMonth);
    setSelectedMonthObj(newMonthObj);
  };

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
      {/* Selectors Row */}
      <Grid container spacing={2} sx={{ mb: 4, maxWidth: 800, width: '100%' }}>
        {/* Time Period Selector */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel
              sx={{
                color: "#B3B7C6",
                "&.Mui-focused": { color: "#f9b17a" },
              }}
            >
              Time Period
            </InputLabel>
            <Select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              variant="filled"
              color='white'
              sx={{
                backgroundColor: "#676F8D",
                color: "white",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                },
                "& .MuiSelect-icon": { color: "white" },
                "&:hover": {
                  backgroundColor: "#5A617F",
                },
                "&.Mui-focused": {
                  backgroundColor: "#5A617F",
                },
                "&:before": {
                borderBottom: "2px solid transparent", // Default hidden border
              },
              "&:hover:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color on hover
              },
              "&.Mui-focused:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color when focused
              },
              "& .MuiSelect-icon": { color: "white" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#424769",
                    color: "white",
                  },
                },
              }}
            >
              <MenuItem
                value="month"
                sx={{
                  color: "white",
                  backgroundColor: "#424769",
                  "&:hover": {
                    backgroundColor: "#5A617F",
                  },
                }}
              >
                Month
              </MenuItem>
              <MenuItem
                value="week"
                sx={{
                  color: "white",
                  backgroundColor: "#424769",
                  "&:hover": {
                    backgroundColor: "#5A617F",
                  },
                }}
              >
                Week
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Month Selector */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel
              sx={{
                color: "#B3B7C6",
                "&.Mui-focused": { color: "#f9b17a" },
              }}
            >
              Select Month
            </InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              variant="filled"
              color='white'
              sx={{
                backgroundColor: "#676F8D !important",
                color: "white",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                },
                "& .MuiSelect-icon": { color: "white" },
                "&:hover": {
                  backgroundColor: "#5A617F",
                },
                "&.Mui-focused": {
                  backgroundColor: "#5A617F",
                },
                "&:before": {
                borderBottom: "2px solid transparent", // Default hidden border
              },
              "&:hover:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color on hover
              },
              "&.Mui-focused:before": {
                borderBottom: "2px solid #f9b17a !important", // Border color when focused
              },
              "& .MuiSelect-icon": { color: "white" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#424769",
                    color: "white",
                    maxHeight: 300,
                  },
                },
              }}
            >
              {monthOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    color: "white",
                    backgroundColor: "#424769",
                    "&:hover": {
                      backgroundColor: "#5A617F",
                    },
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
          Spending Trends {selectedMonthObj ? `(${selectedMonthObj.label})` : ''}
        </Typography>
        <Box sx={{ width: '100%', height: 400 }}>
          {chartData.labels && chartData.labels.length > 0 ? (
            <Line data={chartData} options={{
              scales: {
                y: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                  },
                  ticks: {
                    color: '#B3B7C6'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                  },
                  ticks: {
                    color: '#B3B7C6'
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: '#B3B7C6'
                  }
                }
              }
            }} />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ textAlign: 'center', color: '#B3B7C6' }}>
                No data available for this period
              </Typography>
            </Box>
          )}
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
          Category Breakdown {selectedMonthObj ? `(${selectedMonthObj.label})` : ''}
        </Typography>
        <Box sx={{ width: '100%', height: 400 }}>
          {pieData.labels && pieData.labels.length > 0 ? (
            <Pie data={pieData} options={{
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    color: '#B3B7C6',
                    padding: 20,
                    font: {
                      size: 12
                    }
                  }
                }
              }
            }} />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography sx={{ textAlign: 'center', color: '#B3B7C6' }}>
                No data available for this period
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SpendingTrendsChart;