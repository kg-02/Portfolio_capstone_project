import React from "react";
import { TextField, Box, Typography, Paper } from "@mui/material";

const Step1Personal = ({ formData, setFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone field, only allow digits and limit to 10
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}>
      <Typography variant="h6" mb={3} sx={{ fontWeight: "bold", color: "text.secondary" }}>
        Personal Details
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="First Name *"
          name="firstName"
          fullWidth
          value={formData.firstName || ""}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          label="Last Name *"
          name="lastName"
          fullWidth
          value={formData.lastName || ""}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          label="Email *"
          name="email"
          type="email"
          fullWidth
          value={formData.email || ""}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Phone *"
          name="phone"
          type="tel"
          fullWidth
          value={formData.phone || ""}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
          inputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
        />
      </Box>
    </Paper>
  );
};

export default Step1Personal;
