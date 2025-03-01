import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme"; // Import your custom theme
import Login from "./components/Login";
import Signup from "./components/Signup";
import Expenses from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import SpendingTrendsChart from "./components/SpendingTrendsChart";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures global styles (background, text color, etc.) */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Expenses />} />
          <Route path="/summary" element={<ExpenseSummary />} />
          <Route path="/spending-trends" element={<SpendingTrendsChart />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
