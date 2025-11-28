import React from "react";
import { Box, Typography, Paper, MenuItem, TextField } from "@mui/material";

const Step3Profile = ({ formData, setFormData }) => {
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}>
      <Typography variant="h6" mb={3} sx={{ fontWeight: "bold", color: "text.secondary" }}>
        Investment Profile
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <TextField select label="Risk Appetite" name="riskAppetite" fullWidth margin="normal" value={formData.riskAppetite || ""} onChange={handleChange}>
          <MenuItem value=""><em>Select</em></MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Moderate">Moderate</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

        <TextField select label="Experience" name="experience" fullWidth margin="normal" value={formData.experience || ""} onChange={handleChange}>
          <MenuItem value=""><em>Select</em></MenuItem>
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Expert">Expert</MenuItem>
        </TextField>

        <TextField label="Investment Goal" name="investmentGoal" fullWidth margin="normal" value={formData.investmentGoal || ""} onChange={handleChange} multiline minRows={2} placeholder="Describe your investment goal" />
      </Box>
    </Paper>
  );
};

export default Step3Profile;
