import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("token/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/"); // Redirect to home page after login
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup"); // Redirect to signup page
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ textAlign: "center", mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">Don't have an account?</Typography>
          <Button onClick={handleSignupRedirect} variant="text">
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
