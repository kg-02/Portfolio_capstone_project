import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";   // rename
import CssBaseline from "@mui/material/CssBaseline";

import { ThemeProvider as AppThemeProvider } from "./components/context/ThemeContext";  // ⭐ Custom provider

import Login from "./components/Auth/Login";
import RegistrationForm from "./components/Registration/RegistrationForm";
import Dashboard from "./components/pages/Dashboard";
import Profile from "./components/pages/Profile";
import ForgotPassword from "./components/Auth/ForgetPassword";
import Explore from "./components/pages/Explore";

import appTheme from "./theme";

function App() {
  return (
    <AppThemeProvider>           
      <MuiThemeProvider theme={appTheme}>   
        <CssBaseline />

        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forgot" element={<ForgotPassword />} /> 
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>

      </MuiThemeProvider>
    </AppThemeProvider>
  );
}

export default App;
