import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Login from "./components/Auth/Login";
import RegistrationForm from "./components/Registration/RegistrationForm";
import Dashboard from "./components/pages/Dashboard";

import appTheme from "./theme";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />

      <Router>
        <Routes>
          {/* DEFAULT LOGIN PAGE */}
          <Route path="/" element={<Login />} />

          {/* REGISTRATION */}
          <Route path="/register" element={<RegistrationForm />} />

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
