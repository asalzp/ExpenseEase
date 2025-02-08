import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Expenses from "./components/ExpenseList";
import ExpenseSummary from './components/ExpenseSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Expenses />} />
        <Route path="/summary" element={<ExpenseSummary />} /> {/* New route for summary */}
      </Routes>
    </Router>
  );
}

export default App;
