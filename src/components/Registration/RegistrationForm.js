import React, { useState } from "react";
import Step1Personal from "./Step1Personal";
import Step2Account from "./Step2Account";
import Step3Profile from "./Step3Profile";
import Step4Review from "./Step4Review";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";

const steps = [
  "Personal Details",
  "Account Security",
  "Investment Profile",
  "Review & Confirm",
];

const RegistrationForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateStep = (stepIndex) => {
    const newErrors = {};

    if (stepIndex === 0) {
      // Step 1: Personal Details
      if (!formData.firstName?.trim()) newErrors.firstName = "First Name is required";
      if (!formData.lastName?.trim()) newErrors.lastName = "Last Name is required";

      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!formData.email.includes("@")) {
        newErrors.email = "Email must contain @";
      }

      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be exactly 10 digits";
      }
    }

    if (stepIndex === 1) {
      // Step 2: Account Security
      if (!formData.username?.trim()) newErrors.username = "Username is required";

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setErrors({});
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleStepClick = (index) => {
    if (index < step) {
      setStep(index);
    } else if (index === step + 1) {
      nextStep();
    }
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <Step1Personal formData={formData} setFormData={setFormData} errors={errors} />;
      case 1:
        return <Step2Account formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <Step3Profile formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step4Review formData={formData} />;
      default:
        return "Unknown Step";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
          bgcolor: "background.default",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "600px",
            p: 4,
            borderRadius: 3,
            color: "text.primary",
            bgcolor: "background.paper",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 1,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Welcome Investor
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ textAlign: "center", mb: 3, color: "text.secondary" }}
          >
            Please register by completing all the necessary steps to complete
            your profile and start trading.
          </Typography>

          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label, index) => (
              <Step
                key={label}
                onClick={() => handleStepClick(index)}
                sx={{ cursor: "pointer" }}
              >
                <StepLabel
                  StepIconProps={{
                    sx: {
                      color:
                        index === step
                          ? theme.palette.primary.light
                          : theme.palette.secondary.main,
                    },
                  }}
                >
                  <Typography
                    sx={{ fontWeight: index === step ? "bold" : "normal" }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 3, minHeight: 400 }}>{getStepContent(step)}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" disabled={step === 0} onClick={prevStep}>
              Back
            </Button>

            {step < steps.length - 1 ? (
              <Button variant="contained" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    const response = await fetch('https://register-login-backend-1.onrender.com/api/auth/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        personalInfo: {
                          firstName: formData.firstName,
                          lastName: formData.lastName,
                          email: formData.email,
                          phone: formData.phone,
                          dateOfBirth: formData.dateOfBirth || new Date().toISOString().split('T')[0]
                        },
                        account: {
                          username: formData.username,
                          password: formData.password
                        },
                        investmentProfile: {
                          riskAppetite: formData.riskAppetite || 'moderate',
                          experience: formData.experience || 'beginner',
                          investmentGoal: formData.investmentGoal || 'wealth'
                        }
                      })
                    });

                    if (response.ok) {
                      const data = await response.json();

                      if (data.userId) {
                        localStorage.setItem("userId", data.userId);
                      }

                      alert("Registration successful! Please login.");
                      navigate("/");
                    } else {
                      const error = await response.json();
                      alert('Registration failed: ' + error.message);
                    }
                  } catch (error) {
                    alert('Network error. Please try again.');
                  }
                }}
              >
                Register & Continue
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default RegistrationForm;
