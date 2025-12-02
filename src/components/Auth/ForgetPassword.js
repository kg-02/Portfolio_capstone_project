import React, { useState } from "react";
import { TextField, Button, Box, Typography, Link, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
 
const inputStylesFP = {
  backgroundColor: "#ffffff",
  "& .MuiOutlinedInput-input": { color: "#05668D" },
  "& .MuiInputLabel-root": { color: "#028090" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#00A896" },
    "&:hover fieldset": { borderColor: "#02C39A" },
    "&.Mui-focused fieldset": { borderColor: "#028090" },
  },
};
 
const ForgotPassword = () => {
  // note: removed oldPassword; added confirmPassword
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      // keep only digits and limit to 6
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 6) setForm({ ...form, [name]: digitsOnly });
      return;
    }
    setForm({ ...form, [name]: value });
  };
 
  const validate = () => {
    if (!form.email) return "Email is required";
    if (!form.otp || form.otp.length !== 6) return "OTP must be 6 digits";
    if (!form.newPassword) return "New password is required";
    if (!form.confirmPassword) return "Confirm password is required";
    if (form.newPassword !== form.confirmPassword) return "New password and Confirm password must match";
    if (form.newPassword.length < 6) return "New password must be at least 6 characters";
    return null;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
 
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
 
    setLoading(true);
    try {
      // send email, otp and newPassword. Backend should verify OTP for the email and set the new password.
      const response = await fetch("https://register-login-backend-1.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, otp: form.otp, newPassword: form.newPassword }),
      });
 
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message || "Password updated successfully");
        // redirect to login after short delay
        setTimeout(() => navigate("/"), 1400);
      } else {
        setError(result.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  const handleRequestOtp = async () => {
    if (!form.email) {
      setError("Enter an email to request OTP");
      return;
    }
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("https://register-login-backend-1.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const result = await response.json();
      if (response.ok) setMessage(result.message || "OTP sent to your email");
      else setError(result.message || "Failed to send OTP");
    } catch (err) {
      console.error(err);
      setError("Network error while requesting OTP");
    }
  };
 
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px", backgroundColor: "#f8fafc" }}>
      <Paper elevation={0} sx={{ width: 480, p: 4, borderRadius: 3, background: "inherit", color: "#05668D" }}>
        <Typography variant="h5" sx={{ color: "#028090", fontWeight: "bold", textAlign: "center", mb: 1 }}>
          Reset Password
        </Typography>
 
        <Typography sx={{ color: "#05668D", mb: 2, textAlign: "center" }}>
          Enter your email, OTP (6 digits), your new password and confirm it
        </Typography>
 
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" name="email" type="email" margin="normal" value={form.email} onChange={handleChange} variant="outlined" sx={inputStylesFP} />
 
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="OTP (6 digits)"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              inputProps={{ maxLength: 6, inputMode: "numeric" }}
              margin="normal"
              variant="outlined"
              sx={{ ...inputStylesFP, flex: 1 }}
            />
            <Button sx={{ height: 48, mt: 1 }} variant="outlined" onClick={handleRequestOtp}>Request OTP</Button>
          </Box>
 
          <TextField fullWidth label="New Password" name="newPassword" type="password" margin="normal" value={form.newPassword} onChange={handleChange} variant="outlined" sx={inputStylesFP} />
 
          <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" margin="normal" value={form.confirmPassword} onChange={handleChange} variant="outlined" sx={inputStylesFP} />
 
          <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 3, py: 1.2, background: "#00A896", color: "#ffffff", fontWeight: "bold", "&:hover": { background: "#02C39A" } }}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
 
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link sx={{ color: "#028090", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate("/")}>
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};
 
export default ForgotPassword;
 