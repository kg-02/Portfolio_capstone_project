import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
 
const inputStyles = {
  backgroundColor: "#ffffff",
  "& .MuiOutlinedInput-input": { color: "#05668D" },
  "& .MuiInputLabel-root": { color: "#028090" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#00A896" },
    "&:hover fieldset": { borderColor: "#02C39A" },
    "&.Mui-focused fieldset": { borderColor: "#028090" },
  },
};
 
const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
 
  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      alert("Please enter both email and password");
      return;
    }
 
    try {
      const response = await fetch("https://register-login-backend-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
 
      if (response.ok) {
        const data = await response.json();
        // Save token & user details as needed
        localStorage.setItem("token", data.token);
        if (data.userId) localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", credentials.email);
        localStorage.setItem("role", data.role);
        navigate("/dashboard");
      } else {
        const error = await response.json();
        alert("Login failed: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };
 
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px", backgroundColor: "#f8fafc" }}>
      <Paper elevation={0} sx={{ width: 420, p: 4, borderRadius: 3, background: "inherit", color: "#05668D" }}>
        <Typography variant="h5" sx={{ color: "#028090", fontWeight: "bold", textAlign: "center", mb: 1 }}>
          Welcome Back
        </Typography>
 
        <Typography sx={{ color: "#05668D", mb: 3, textAlign: "center" }}>Login to continue</Typography>
 
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" name="email" type="email" margin="normal" value={credentials.email} onChange={handleChange} variant="outlined" sx={inputStyles} />
 
          <TextField fullWidth label="Password" name="password" type="password" margin="normal" value={credentials.password} onChange={handleChange} variant="outlined" sx={inputStyles} />
 
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 3, py: 1.2, background: "#00A896", color: "#ffffff", fontWeight: "bold", "&:hover": { background: "#02C39A" } }}>
            Login
          </Button>
        </form>
 
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Typography sx={{ color: "#05668D" }}>Don’t have an account?</Typography>
          <Link sx={{ color: "#028090", cursor: "pointer", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }} onClick={() => navigate("/register")}>
            Register
          </Link>
        </Box>
 
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link sx={{ color: "#028090", cursor: "pointer", fontWeight: "bold", "&:hover": { textDecoration: "underline" } }} onClick={() => navigate("/forgot")}>
            Forgot password?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};
 
export default Login;