import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Expenses from "./components/ExpenseList";
import ExpenseSummary from './components/ExpenseSummary';
import SpendingTrendsChart from './components/SpendingTrendsChart'; // Import the chart component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Expenses />} />
        <Route path="/summary" element={<ExpenseSummary />} /> {/* New route for summary */}
        <Route path="/spending-trends" element={<SpendingTrendsChart />} /> {/* New route for spending trends */}
      </Routes>
    </Router>
  );
}

export default App;
