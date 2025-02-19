import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Container, TextField, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { motion, AnimatePresence } from "framer-motion";

const useStyles = makeStyles({
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    width: "90%",
    height: "90vh",
    maxWidth: "1100px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
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
    color: "#008080",
  },
  button: {
    marginTop: "20px !important",
    backgroundColor: "#FFC107 !important",
    color: "#008080 !important",
    width: "200px",
    borderRadius: "15px !important", 
  },
  rightButton: {
    marginTop: "20px !important",
    color: "white !important",
    width: "200px",
    textAlign: "center",
    borderRadius: "15px !important", 
    border: "2px solid white !important",
  },
  link: {
    marginTop: "10px",
    color: "#FFC107",
    cursor: "pointer",
  },
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
            <Grid item xs={12} md={6} className={classes.leftPanel} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <Typography variant="h4" className={classes.title}>
                {isLogin ? "Login" : "Sign Up"}
              </Typography>
              {error && <Typography color="error">{error}</Typography>}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "350px" }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                  required
                />
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                  />
                )}
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                />
                <Button type="submit" variant="contained" className={classes.button}>
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </form>
            </Grid>

            {/* Right Panel - Message */}
            <Grid item xs={12} md={6} className={classes.rightPanel} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <Typography variant="h4">{isLogin ? "Hello, Friend!" : "Welcome Back!"}</Typography>
              <Typography variant="body1" align="center">
                {isLogin
                  ? "Enter your details and start your journey with us."
                  : "To keep connected with us, please login with your personal info."}
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
