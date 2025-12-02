// src/components/Header.jsx
import React, { useState } from "react";
import { useTheme } from "./context/ThemeContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import SearchBar from "./Dashboard/SearchBar";
import Wallet from "./Wallet"; // optional; keep if present in your project
import { Sun, Moon, Wallet as WalletIcon, UserCircle } from "lucide-react";

import AppLogoLight from "../assets/portfolio_app_icon_light.png";
import AppLogoDark from "../assets/portfolio_app_icon_dark.png";

const Header = ({ onSelectStock, showSearch = true }) => {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const navigate = useNavigate();

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
    <>
      {/* FIXED HEADER */}
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
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 3000,
        }}
      >
        {/* LEFT — Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={isDarkMode ? AppLogoDark : AppLogoLight}
            alt="StockX Logo"
            height="52"
            style={{
              borderRadius: 10,
              boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.6)" : "0 2px 8px rgba(0,0,0,0.06)",
            }}
          />
          <div>
            <h2 style={{ margin: 0, color: colors.textPrimary, fontSize: "1.25rem" }}>StockX</h2>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Portfolio · Track · Grow</div>
          </div>
        </div>

        {/* RIGHT — Navigation / Search / Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              onClick={() => navigate("/dashboard")}
              style={{
                cursor: "pointer",
                fontWeight: 600,
                color: colors.textPrimary,
                fontSize: 15,
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor:
                  window.location.pathname === "/dashboard"
                    ? isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)"
                    : "transparent",
              }}
            >
              Dashboard
            </div>

            <div
              onClick={() => navigate("/explore")}
              style={{
                cursor: "pointer",
                fontWeight: 600,
                color: colors.textPrimary,
                fontSize: 15,
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor:
                  window.location.pathname === "/explore"
                    ? isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)"
                    : "transparent",
              }}
            >
              Explore
            </div>
          </div>

          {showSearch && <SearchBar onSelectStock={onSelectStock} />}

          {/* MENU BUTTON */}
          <div
            onClick={() => setMenuOpen((s) => !s)}
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 10,
              background: isDarkMode ? "#1e293b" : "#f1f5f9",
              boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 22, color: colors.textPrimary }}>☰</div>
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 72,
            right: 28,
            width: 220,
            background: isDarkMode ? "#0f172a" : "#ffffff",
            padding: "10px 0",
            borderRadius: 12,
            boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.6)" : "0 4px 16px rgba(0,0,0,0.12)",
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
            <UserCircle size={18} color="#3b82f6" />
            <span style={{ marginLeft: 8 }}>Profile</span>
          </div>

          <div
            style={menuItemStyle}
            onClick={() => {
              setWalletOpen(true);
              setMenuOpen(false);
            }}
          >
            <WalletIcon size={18} color={colors.primary} />
            <span style={{ marginLeft: 8 }}>Wallet</span>
          </div>

          <div
            style={menuItemStyle}
            onClick={() => {
              toggleTheme();
              // optionally keep menu open so user sees change — we close for consistency:
              setMenuOpen(false);
            }}
          >
            {isDarkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#475569" />}
            <span style={{ marginLeft: 8 }}>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>

          <div style={menuItemStyle}>
            <LogoutButton />
          </div>
        </div>
      )}

      {/* Wallet modal/sidepanel (if you have Wallet component) */}
      {typeof Wallet === "function" && <Wallet open={walletOpen} onClose={() => setWalletOpen(false)} />}
    </>
  );
};

export default Header;
