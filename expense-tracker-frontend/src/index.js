import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "./theme"; // Import the theme
import { ThemeProvider } from "@mui/material/styles"; 
import CssBaseline from "@mui/material/CssBaseline"; // Ensures theme background is applied

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Ensures the theme's background.default applies immediately */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>
);
