import React, { useState } from "react";
import { Typography, Paper, Box, Divider, IconButton, Grid } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Step4Review = ({ formData }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}>
      <Typography variant="h6" mb={3} sx={{ fontWeight: "bold", textAlign: "center", color: "text.secondary" }}>
        Review & Confirm
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" sx={{ color: "text.secondary" }}>
          Personal Details
        </Typography>
        <Grid container spacing={2} justifyContent="center" mt={1}>
          <Grid item xs={12} sm={6} textAlign="center">First Name: {formData.firstName || "-"}</Grid>
          <Grid item xs={12} sm={6} textAlign="center">Last Name: {formData.lastName || "-"}</Grid>
          <Grid item xs={12} sm={6} textAlign="center">Email: {formData.email || "-"}</Grid>
          <Grid item xs={12} sm={6} textAlign="center">Phone: {formData.phone || "-"}</Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2, borderColor: "divider" }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" sx={{ color: "text.secondary" }}>
          Account Security
        </Typography>
        <Typography textAlign="center">Username: {formData.username || "-"}</Typography>

        <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
          <Typography>Password: {showPassword ? formData.password : "********"}</Typography>
          <IconButton onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderColor: "divider" }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" textAlign="center" sx={{ color: "text.secondary" }}>
          Investment Profile
        </Typography>
        <Typography textAlign="center">Risk Appetite: {formData.riskAppetite || "-"}</Typography>
        <Typography textAlign="center">Experience: {formData.experience || "-"}</Typography>
        <Typography textAlign="center">Goal: {formData.investmentGoal || "-"}</Typography>
      </Box>
    </Paper>
  );
};

export default Step4Review;
