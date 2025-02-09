import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("register/", { username, email, password });
      alert(response.data.message); // Show success message
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ textAlign: "center", mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSignup}>
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
            label="Email (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
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
              Sign Up
            </Button>
          </Box>
        </form>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">Already have an account?</Typography>
          <Button onClick={() => navigate("/login")} variant="text">
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
