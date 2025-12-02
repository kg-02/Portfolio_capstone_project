// src/components/pages/Profile.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Target, Activity, Mail, Phone, Clock } from "lucide-react";
import { playClickSound } from "../utils/sound";
import LogoutButton from "../LogoutButton";
import SearchBar from "../Dashboard/SearchBar";
import AppLogoLight from "../../assets/portfolio_app_icon_light.png";
import AppLogoDark from "../../assets/portfolio_app_icon_dark.png";

/**
 * Full-featured Profile page.
 * - Uses your ThemeContext colors
 * - Calls /api/me with getAuthHeaders
 * - Shows Personal Info, Investment Goal & Risk Profile, Recent Activity
 * - Matches dashboard card styles (solid card - option B)
 * - Back to dashboard button with playClickSound()
 */

const API_BASE = "https://capstone-backend-1xwd.onrender.com";

const Profile = () => {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Use your exact getAuthHeaders function as requested
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId || userId === "undefined") {
      alert("Authentication Error: Missing User ID. Please log in again.");
      throw new Error("Authentication required");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId,
    };
  }, []);

  // Last-seen formatter (no NaN)
  const formatLastSeen = (isoTime) => {
    if (!isoTime) return "Unknown";
    const last = new Date(isoTime);
    if (isNaN(last.getTime())) return "Unknown";
    const now = new Date();
    const diffMs = now - last;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Active logic — lastActiveAt within 10 minutes = Active now
  const computeActiveStatus = (isoTime) => {
    if (!isoTime) return { label: "Inactive", isActive: false };
    const last = new Date(isoTime);
    if (isNaN(last.getTime())) return { label: "Inactive", isActive: false };
    const diffMs = Date.now() - last.getTime();
    const isActive = diffMs < 10 * 60 * 1000; // 10 minutes
    return {
      label: isActive ? "Active now" : `Last seen ${formatLastSeen(isoTime)}`,
      isActive,
    };
  };

  // Fetch profile from /api/me (authorized)
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      // Primary profile endpoint
      const res = await fetch(`${API_BASE}/api/me`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        // Read body if possible for debug
        let text;
        try {
          text = await res.text();
        } catch {}
        throw new Error(`Profile fetch failed (${res.status}) ${text || ""}`);
      }

      const data = await res.json();

      /**
       * /api/me returned this JSON in your example:
       * {
       *  fullName, username, email, phone, experience, riskAppetite,
       *  investmentGoal, investorSince, isActive, walletBalance,
       *  recentActivity: [{ symbol, companyName, action, timeAgo }, ...],
       *  lastActiveAt
       * }
       *
       * Some backends wrap under { user: { ... } }, so handle both.
       */
      const profileData = data.user ? data.user : data;

      setProfile(profileData);

      // Normalize recentActivity if not present
      const activity = profileData.recentActivity || [];
      setRecentActivity(Array.isArray(activity) ? activity : []);

    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    try {
      fetchProfile();
    } catch (err) {
      console.warn("fetchProfile invocation error:", err);
    }
  }, [fetchProfile]);

  // header menu item style helper (copied from dashboard)
  const menuItemStyle = (colors) => ({
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
  });

  // Card style — Option B matching dashboard (solid card)
  const cardStyle = {
    background: isDarkMode ? "#0f172a" : "#ffffff",
    borderRadius: 16,
    padding: 20,
    boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.08)",
    border: `1px solid ${colors.border}`,
  };

  // Inline styles
  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: colors.background,
      color: colors.textPrimary,
      paddingTop: 92, // spacer for fixed header
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "24px",
    },
    headerSpacer: { height: 92 },
    sectionTitle: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
      fontSize: 20,
      fontWeight: 700,
      color: colors.textPrimary,
    },
    fieldLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: "0.6px",
    },
    fieldBox: {
      background: isDarkMode ? "#071226" : "#fbfcfd",
      padding: "12px 14px",
      borderRadius: 12,
      border: `1px solid ${colors.border}`,
      color: colors.textPrimary,
    },
    twoColGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 16,
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      background: isDarkMode ? "#111827" : "#f1f5f9",
      color: colors.textPrimary,
      boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.08)",
    }
  };

  // Render
  return (
    <>
      {/* HEADER — replicate dashboard header exactly so profile looks identical */}
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
          background: isDarkMode ? "rgba(8, 12, 20, 0.85)" : "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(8px)",
          boxShadow: isDarkMode ? "0 2px 10px rgba(0,0,0,0.6)" : "0 2px 8px rgba(0,0,0,0.08)",
          borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.04)",
          zIndex: 3000,
        }}
      >
        {/* LEFT: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={isDarkMode ? AppLogoDark : AppLogoLight}
            alt="StockX Logo"
            height="52"
            style={{
              borderRadius: 10,
              display: "block",
              boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.6)" : "0 2px 8px rgba(0,0,0,0.06)",
            }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: colors.textPrimary }}>
              StockX
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE — Search + Menu Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <SearchBar onSelectStock={() => {}} />

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
              boxShadow: isDarkMode ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "0.2s",
            }}
          >
            <div style={{ fontSize: 26, color: colors.textPrimary }}>☰</div>
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU (same as dashboard) */}
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
            animation: "fadeIn 0.12s ease-out",
          }}
        >
          <div style={menuItemStyle(colors)} onClick={() => { navigate("/profile"); setMenuOpen(false); }}>
            Profile
          </div>

          <div style={menuItemStyle(colors)} onClick={() => { toggleTheme(); setMenuOpen(false); }}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </div>

          <div style={menuItemStyle(colors)}>
            <LogoutButton />
          </div>
        </div>
      )}

      {/* PAGE BODY */}
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Back button */}
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => {
                playClickSound();
                navigate("/dashboard");
              }}
              style={styles.backButton}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>

          {/* Loading or error */}
          {loading ? (
            <div style={{ padding: 28, ...cardStyle }}>
              <p style={{ margin: 0, color: colors.textSecondary }}>Loading profile...</p>
            </div>
          ) : error ? (
            <div style={{ padding: 28, ...cardStyle }}>
              <p style={{ margin: 0, color: "crimson" }}>Error: {error}</p>
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => fetchProfile()}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background: isDarkMode ? "#0b59a7" : "#eef2f7",
                    color: colors.textPrimary,
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TOP SUMMARY CARD (name + small meta) */}
              <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 24 }}>{profile.fullName || profile.username}</h1>
                  <div style={{ marginTop: 6, color: colors.textSecondary }}>
                    {profile.username} · {profile.email}
                  </div>
                  <div style={{ marginTop: 8, color: colors.textSecondary, display: "flex", gap: 12, alignItems: "center" }}>
                    <Clock size={14} /> {formatLastSeenText(profile.lastActiveAt)}
                  </div>
                </div>

                {/* Status & Wallet */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>
                    Wallet
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>
                    ₹ {Number(profile.walletBalance || 0).toLocaleString()}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 12,
                        background: profile.isActive ? "#d1f5d3" : "#ffebeb",
                        color: profile.isActive ? "#0a8a12" : "#a80000",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {computeActiveStatus(profile.lastActiveAt).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* MAIN GRID (three sections stacked) */}
              <div style={{ marginTop: 20, display: "grid", gap: 20 }}>
                {/* Personal Information card */}
                <section style={cardStyle}>
                  <div style={styles.sectionTitle}>
                    <User size={20} color={colors.textPrimary} />
                    Personal Information
                  </div>

                  <div style={{ marginTop: 10, ...styles.twoColGrid }}>
                    <div>
                      <div style={styles.fieldLabel}>Full Name</div>
                      <div style={styles.fieldBox}>{profile.fullName || "N/A"}</div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Username</div>
                      <div style={styles.fieldBox}>@{profile.username || "N/A"}</div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Email</div>
                      <div style={styles.fieldBox}>
                        <Mail size={14} style={{ marginRight: 8 }} /> {profile.email || "N/A"}
                      </div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Phone</div>
                      <div style={styles.fieldBox}>
                        <Phone size={14} style={{ marginRight: 8 }} /> {profile.phone || "N/A"}
                      </div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Member Since</div>
                      <div style={styles.fieldBox}>
                        {profile.investorSince || profile.createdAt ? (profile.investorSince || new Date(profile.createdAt).toLocaleDateString()) : "N/A"}
                      </div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Status</div>
                      <div style={styles.fieldBox}>
                        {computeActiveStatus(profile.lastActiveAt).label}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Investment Goals card */}
                <section style={cardStyle}>
                  <div style={styles.sectionTitle}>
                    <Target size={20} color={colors.textPrimary} />
                    Investment Goal & Risk
                  </div>

                  <div style={{ marginTop: 12, ...styles.twoColGrid }}>
                    <div>
                      <div style={styles.fieldLabel}>Experience Level</div>
                      <div style={styles.fieldBox}>{profile.experience || "N/A"}</div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Risk Appetite</div>
                      <div style={styles.fieldBox}>{profile.riskAppetite || "N/A"}</div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Investment Goal</div>
                      <div style={styles.fieldBox}>{profile.investmentGoal || "N/A"}</div>
                    </div>

                    <div>
                      <div style={styles.fieldLabel}>Investor Since</div>
                      <div style={styles.fieldBox}>{profile.investorSince || "N/A"}</div>
                    </div>
                  </div>
                </section>

                {/* Recent Activity card */}
                <section style={cardStyle}>
                  <div style={styles.sectionTitle}>
                    <Activity size={20} color={colors.textPrimary} />
                    Recent Activity
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {recentActivity && recentActivity.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {recentActivity.map((act, idx) => {
                          // act may be object { symbol, companyName, action, timeAgo } or string
                          const symbol = act.symbol || act.stockSymbol || (typeof act === "string" ? act : "");
                          const company = act.companyName || act.stockName || "";
                          const action = act.action || act.actionType || (typeof act === "string" ? "" : "");
                          const timeAgo = act.timeAgo || (act.createdAt ? new Date(act.createdAt).toLocaleString() : "");
                          return (
                            <div key={idx} style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px",
                              borderRadius: 12,
                              background: isDarkMode ? "rgba(255,255,255,0.02)" : "#fafbfc",
                              border: `1px solid ${colors.border}`
                            }}>
                              <div>
                                <div style={{ fontWeight: 700 }}>{action ? `${action} ${symbol}` : symbol || company}</div>
                                {company && <div style={{ color: colors.textSecondary, marginTop: 6 }}>{company}</div>}
                              </div>

                              <div style={{ textAlign: "right", color: colors.textSecondary, fontSize: 13 }}>
                                {timeAgo}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ color: colors.textSecondary }}>No recent activity found.</div>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

  // helper inside component to format last seen text succinctly for header summary
  function formatLastSeenText(iso) {
    if (!iso) return "Unknown";
    const last = new Date(iso);
    if (isNaN(last.getTime())) return "Unknown";
    const diffMs = Date.now() - last.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
};

export default Profile;
