import React, { useState } from "react";
import { useTheme } from "./context/ThemeContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import SearchBar from "./Dashboard/SearchBar";
import Wallet from "./Wallet";
import { Sun, Moon, Wallet as WalletIcon } from "lucide-react";
import { UserCircle } from "lucide-react";

 
import AppLogoLight from "../assets/portfolio_app_icon_light.png";
import AppLogoDark from "../assets/portfolio_app_icon_dark.png";
 
const Header = ({ onSelectStock, showSearch = false }) => {
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
                {/* LEFT: Logo */}
                <div
                    style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                    onClick={() => navigate("/dashboard")}
                >
                    <img
                        src={isDarkMode ? AppLogoDark : AppLogoLight}
                        alt="StockX Logo"
                        height="52"
                        style={{
                            borderRadius: 10,
                            display: "block",
                            boxShadow: isDarkMode
                                ? "0 2px 8px rgba(0,0,0,0.6)"
                                : "0 2px 8px rgba(0,0,0,0.06)",
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
                        <div
                            style={{
                                fontSize: 12,
                                color: colors.textSecondary,
                            }}
                        >
                            Portfolio · Track · Grow
                        </div>
                    </div>
                </div>
 
                {/* RIGHT SIDE — Search + Menu Button */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {/* Navigation Links */}
                    <div style={{ display: "flex", gap: "15px", marginRight: "10px" }}>
                        <div
                            onClick={() => navigate("/dashboard")}
                            style={{
                                cursor: "pointer",
                                fontWeight: "600",
                                color: colors.textPrimary,
                                fontSize: "15px",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                transition: "0.2s",
                                backgroundColor: window.location.pathname === "/dashboard" ? (isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent"
                            }}
                        >
                            Dashboard
                        </div>
                        <div
                            onClick={() => navigate("/explore")}
                            style={{
                                cursor: "pointer",
                                fontWeight: "600",
                                color: colors.textPrimary,
                                fontSize: "15px",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                transition: "0.2s",
                                backgroundColor: window.location.pathname === "/explore" ? (isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent"
                            }}
                        >
                            Explore
                        </div>
                    </div>
 
                    {showSearch && <SearchBar onSelectStock={onSelectStock} />}
 
                    {/* Hamburger Menu Button */}
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
                        boxShadow: isDarkMode
                            ? "0 4px 16px rgba(0,0,0,0.6)"
                            : "0 4px 16px rgba(0,0,0,0.12)",
                        zIndex: 3500,
                        animation: "fadeIn 0.2s ease-out",
                    }}
                >
 
 
                    {/* Profile */}
                    <div
                        style={menuItemStyle}
                        onClick={() => {
                            navigate("/profile");
                            setMenuOpen(false);
                        }}
                    >
                        <UserCircle size={20} color="#3b82f6" />
                        <span style={{ marginLeft: 8 }}>Profile</span>
                    </div>

 
                    {/* Wallet */}
                    <div
                        style={menuItemStyle}
                        onClick={() => {
                            setWalletOpen(true);
                            setMenuOpen(false);
                        }}
                    >
                        <WalletIcon size={20} color={colors.primary} />
                        <span style={{ marginLeft: 8 }}>Wallet</span>
                    </div>
 
                    {/* Theme Toggle */}
                    <div
                        style={menuItemStyle}
                        onClick={() => {
                            toggleTheme();
                            // Don't close menu so user can see the change
                        }}
                        className="flex items-center gap-3"
                    >
                        {isDarkMode ? (
                            <Sun size={20} color="#fbbf24" />
                        ) : (
                            <Moon size={20} color="#475569" />
                        )}
 
                        <span style={{ marginLeft: 8 }}>
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </span>
                    </div>
 
                    {/* Logout */}
                    <div style={menuItemStyle}>
                        <LogoutButton />
                    </div>
                </div>
            )}
 
            {/* Wallet Modal */}
            <Wallet open={walletOpen} onClose={() => setWalletOpen(false)} />
        </>
    );
};
 
export default Header;
 