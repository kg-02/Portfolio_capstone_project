import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../LogoutButton";

import AppLogoLight from "../../assets/portfolio_app_icon_light.png";
import AppLogoDark from "../../assets/portfolio_app_icon_dark.png";

const Profile = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (storedUsername || storedEmail) {
      setUser({
        username: storedUsername,
        email: storedEmail,
      });
    }
  }, []);

  if (!user)
    return (
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mt: 4, color: colors.text }}
      >
        No user data found
      </Typography>
    );

  // Menu item style helper
  const menuItemStyle = {
    padding: "12px 18px",
    cursor: "pointer",
    fontSize: 15,
    color: colors.textPrimary,
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    userSelect: "none",
    borderBottom: `1px solid ${colors.border}`,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        color: colors.textPrimary,
      }}
    >
      {/* Fixed Header */}
      <div
        style={{
          width: "100%",
          padding: "12px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          background: isDarkMode
            ? "rgba(8, 12, 20, 0.85)"
            : "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(8px)",
          boxShadow: isDarkMode
            ? "0 2px 10px rgba(0,0,0,0.6)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          borderBottom: isDarkMode
            ? "1px solid rgba(255,255,255,0.03)"
            : "1px solid rgba(0,0,0,0.04)",
          zIndex: 3000,
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={isDarkMode ? AppLogoDark : AppLogoLight}
            alt="Logo"
            height="52"
            style={{
              borderRadius: 10,
              display: "block",
            }}
          />
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              StockX
            </h2>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>
              Portfolio · Track · Grow
            </div>
          </div>
        </div>

        {/* Right Side: Hamburger Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 10,
              background: isDarkMode ? "#1e293b" : "#f1f5f9",
              boxShadow: isDarkMode
                ? "0 2px 8px rgba(0,0,0,0.5)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "0.2s",
            }}
          >
            <div style={{ fontSize: 26, color: colors.textPrimary }}>☰</div>
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 72,
            right: 28,
            width: 200,
            background: isDarkMode ? "#0f172a" : "#ffffff",
            padding: "10px 0",
            borderRadius: 12,
            boxShadow: isDarkMode
              ? "0 4px 16px rgba(0,0,0,0.6)"
              : "0 4px 16px rgba(0,0,0,0.12)",
            zIndex: 3500,
          }}
        >
          <div
            style={menuItemStyle}
            onClick={() => {
              navigate("/profile");
              setMenuOpen(false);
            }}
          >
            Profile
          </div>

          <div
            style={menuItemStyle}
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </div>

          <div style={menuItemStyle}>
            <LogoutButton />
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: 92 }} />

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 3,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: 500,
            p: 4,
            borderRadius: 3,
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            color: colors.textPrimary,
            boxShadow: isDarkMode
              ? "0px 8px 24px rgba(0,0,0,0.6)"
              : "0px 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 2,
              color: colors.textPrimary,
              fontWeight: "bold",
            }}
          >
            Profile
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
              sx={{
                color: colors.textPrimary,
                borderColor: colors.textPrimary,
                "&:hover": {
                  backgroundColor: isDarkMode ? "#111827" : "#e0f7fa",
                  borderColor: isDarkMode ? "#028090" : "#02C39A",
                },
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1">
              <strong>Username:</strong> {user.username || "N/A"}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Email:</strong> {user.email || "N/A"}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;
