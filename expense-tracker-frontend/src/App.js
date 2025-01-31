import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Expenses from "./components/ExpenseList"; // Your existing expense list page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Expenses />} /> {/* Protected Page */}
      </Routes>
    </Router>
  );
}

export default App;
