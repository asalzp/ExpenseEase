import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#242840", // Ensures dark background on page load
    },
    text: {
      primary: "#ffffff", // Ensures white text
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#242840", // Makes sure the entire app has this background
          color: "#ffffff",
          margin: 0,
          padding: 0,
          overflowX: "hidden",
          fontFamily: "'Changa', sans-serif",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#676F8D !important",
          color: "white !important",
          borderRadius: "5px",
          transition: "background-color 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "#5A617F !important",
          },
          "&.Mui-focused": {
            backgroundColor: "#5A617F !important",
          },
        },
        input: {
          color: "white !important",
        },
      },
    },
  },
});

export default theme;
