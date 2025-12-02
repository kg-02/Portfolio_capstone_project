// src/components/pages/Profile.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Target, Activity, Mail, Phone } from "lucide-react";
import { playClickSound } from "../utils/sound";
import LogoutButton from "../LogoutButton";
import Header from "../Header";


const API_BASE = "https://capstone-backend-service-mkiq.onrender.com";

const Profile = () => {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const { balance } = useWallet();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`${API_BASE}/api/me`, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        let text;
        try {
          text = await res.text();
        } catch { }
        throw new Error(`Profile fetch failed (${res.status}) ${text || ""}`);
      }

      const data = await res.json();
      const profileData = data.user ? data.user : data;
      setProfile(profileData);
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
    fetchProfile();
  }, [fetchProfile]);

  // Reuse card styling consistent with Dashboard
  const cardStyle = {
    background: isDarkMode ? "#0f172a" : "#ffffff",
    borderRadius: 16,
    padding: 20,
    boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.08)",
    border: `1px solid ${colors.border}`,
  };

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: colors.background,
      color: colors.textPrimary,
      paddingTop: 92,
    },
    container: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "24px",
    },
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
    },
  };

  return (
    <>
      <Header />

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

          {/* Loading / Error */}
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
              {/* TOP SUMMARY CARD */}
              <div
                style={{
                  ...cardStyle,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h1 style={{ margin: 0, fontSize: 24 }}>{profile.fullName || profile.username}</h1>
                  <div style={{ marginTop: 6, color: colors.textSecondary }}>
                    {profile.username} · {profile.email}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>
                    Wallet
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>
                    ₹ {Number(balance || 0).toLocaleString()}
                  </div>
                  <div style={{ marginTop: 10 }}>

                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20, display: "grid", gap: 20 }}>
                {/* Personal Information */}
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
                      <div style={styles.fieldBox}>{profile.username || "N/A"}</div>
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
                  </div>
                </section>

                {/* Investment Goals */}
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

                {/* Recent Activity */}
                <section style={cardStyle}>
                  <div style={styles.sectionTitle}>
                    <Activity size={20} color={colors.textPrimary} />
                    Recent Activity
                  </div>

                  <div style={{ marginTop: 12 }}>
                    {recentActivity && recentActivity.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {recentActivity.map((act, idx) => {
                          const symbol = act.symbol || act.stockSymbol || (typeof act === "string" ? act : "");
                          const company = act.companyName || act.stockName || "";
                          const action = act.action || act.actionType || (typeof act === "string" ? "" : "");
                          const timeAgo = act.timeAgo || (act.createdAt ? new Date(act.createdAt).toLocaleString() : "");
                          return (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px",
                                borderRadius: 12,
                                background: isDarkMode ? "rgba(255,255,255,0.02)" : "#fafbfc",
                                border: `1px solid ${colors.border}`,
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700 }}>{action ? `${action} ${symbol}` : symbol || company}</div>
                                {company && <div style={{ color: colors.textSecondary, marginTop: 6 }}>{company}</div>}
                              </div>

                              <div style={{ textAlign: "right", color: colors.textSecondary, fontSize: 13 }}>{timeAgo}</div>
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
};

export default Profile;
