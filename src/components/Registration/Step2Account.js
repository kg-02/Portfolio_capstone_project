import React, { useState } from "react";
import { TextField, Box, Typography, Paper, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Step2Account = ({ formData, setFormData, errors = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}>
      <Typography variant="h6" mb={3} sx={{ fontWeight: "bold", color: "text.secondary" }}>
        Account Security
      </Typography>

      <Box component="form" noValidate autoComplete="off" sx={{
        "& input::-ms-reveal, & input::-ms-clear": { display: "none" }
      }}>
        <TextField
          fullWidth
          label="Username *"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          margin="normal"
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          fullWidth
          label="Password *"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Confirm Password *"
          type={showConfirm ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword || ""}
          onChange={handleChange}
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default Step2Account;
