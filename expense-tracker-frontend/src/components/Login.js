import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Container, TextField, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { motion, AnimatePresence } from "framer-motion";

const useStyles = makeStyles({

  "@global": {
    "html, body, #root": {
      height: "100%",
      margin: 0,
      padding: 0,
      backgroundColor: "#242840", // Keeps the dark background
    },
    ".MuiFilledInput-root": {
      backgroundColor: "#676F8D !important",
      // Other styling as needed
    }
  },


  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242840",
  },
  gridContainer: {
    width: "100%",
    height: "90vh",
    maxWidth: "1100px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 1)",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#424769",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    width: "50%",
    textAlign: "center",
    transition: "transform 0.5s ease-in-out",
  },
  rightPanel: {
    backgroundColor: "#008080",
    background: `url('/assets/money-login.jpg') no-repeat center center/cover`,
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    width: "50%",
    transition: "transform 0.5s ease-in-out",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "20px",
    color: "white",
    fontSize: "30px !important"
  },
  button: {
    marginTop: "20px !important",
    backgroundColor: "#f9b17a !important",
    color: "#2d3250 !important",
    width: "200px",
    borderRadius: "2px !important",
    boxShadow: "0 0 10px #f9b17a !important", // Adds glow effect
    transition: "0.3s ease-in-out !important",
    "&:hover": {
      backgroundColor: "#f9b17a !important",
      boxShadow: "0 0 20px #f9b17a !important", // Increases glow on hover
    },
  },
  rightButton: {
    marginTop: "20px !important",
    color: "white !important",
    width: "200px",
    textAlign: "center",
    borderRadius: "2px !important",
    border: "2px solid white !important",
  },
  link: {
    marginTop: "10px",
    color: "#FFC107",
    cursor: "pointer",
  },
  username: {
    backgroundColor: "#676F8D",
    borderRadius: "2px",

  },
  password: {
    backgroundColor: "#676F8D",
    borderRadius: "2px"
  },
  email: {
    backgroundColor: "#676F8D",
    borderRadius: "2px"
  }
});

const LoginSignup = () => {
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const response = await API.post("token/", { username, password });
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        navigate("/");
      } else {
        const response = await API.post("register/", { username, email, password });
        alert(response.data.message);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Container className={classes.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%" }}
        >

          <Grid
            container
            className={classes.gridContainer}
            style={{ flexDirection: isLogin ? "row" : "row-reverse" }}
          >

            {/* Left Panel - Form */}
            <Grid item xs={12} md={6} className={classes.leftPanel} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

              <Typography variant="h4" className={classes.title}>
                {isLogin ? "Log In" : "Sign Up"}
              </Typography>
              {error && <Typography color="error">{error}</Typography>}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "350px" }}>
                <TextField className={classes.username}
                  id="filled-required"
                  variant="filled"
                  color="white"
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="dense"
                  required
                  InputProps={{
                    style: {
                      backgroundColor: "#676F8D !important",
                      color: "white",
                      borderRadius: "5px"
                    },
                  }}
                  // Replace your TextField sx properties with this more comprehensive approach
                  sx={{
                    marginBottom: "-3px",
                    "& .MuiFilledInput-root": {
                      backgroundColor: "#676F8D !important", // Added !important to ensure it applies on initial load
                      borderRadius: "5px",
                      color: "white",
                      // Force the initial state to have the correct background
                      "&.Mui-focused, &:hover, &": {
                        backgroundColor: "#676F8D !important",
                      },
                      "&:before": {
                        borderBottom: "2px solid transparent", // Default border (hidden)
                      },
                      "&:hover:before": {
                        borderBottom: "2px solid #f9b17a !important", // Border color on hover
                      },
                      "&.Mui-focused:before": {
                        borderBottom: "2px solid #f9b17a !important", // Border color when clicked (focused)
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#B3B7C6", // Default label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#f9b17a", // Label color when focused (clicked)
                    },
                  }}

                />
                {!isLogin && (
                  <TextField className={classes.email}
                    id="filled-required"
                    variant="filled"
                    fullWidth
                    color="white"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="dense"
                    sx={{
                      marginBottom: "-3px",
                      "& .MuiFilledInput-root": {
                        backgroundColor: "#676F8D", // Background color
                        borderRadius: "5px",
                        color: "white",
                        "&:before": {
                          borderBottom: "2px solid transparent", // Default border (hidden)
                        },
                        "&:hover:before": {
                          borderBottom: "2px solid #f9b17a", // Border color on hover
                        },
                        "&.Mui-focused:before": {
                          borderBottom: "2px solid #f9b17a !important", // Border color when clicked (focused)
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#B3B7C6", // Default label color
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#f9b17a", // Label color when focused (clicked)
                      },
                    }}
                  />
                )}
                <TextField className={classes.password}
                  id="filled-required"
                  variant="filled"
                  fullWidth
                  color="white"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="dense"
                  required
                  sx={{
                    "& .MuiFilledInput-root": {
                      backgroundColor: "#676F8D", // Background color
                      borderRadius: "5px",
                      color: "white",
                      "&:before": {
                        borderBottom: "2px solid transparent", // Default border (hidden)
                      },
                      "&:hover:before": {
                        borderBottom: "2px solid #f9b17a", // Border color on hover
                      },
                      "&.Mui-focused:before": {
                        borderBottom: "2px solid #f9b17a !important", // Border color when clicked (focused)
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#B3B7C6", // Default label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#f9b17a", // Label color when focused (clicked)
                    },
                  }}
                />
                <Button type="submit" variant="contained" className={classes.button}>
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </form>
            </Grid>

            {/* Right Panel - Message */}
            <Grid item xs={12} md={6} className={classes.rightPanel} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "'Changa', serif",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                ExpenseEase
              </Typography>

              <Typography variant="h4" align="center">{isLogin ? "Don't have an Account?" : "Already Registered?"}</Typography>
              <Typography variant="body1" align="center">
                {isLogin
                  ? " Enter your details and start your journey with us."
                  : "To continue, please login with your personal info."}
              </Typography>
              <Button className={classes.rightButton} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </Grid>
          </Grid>
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default LoginSignup;
