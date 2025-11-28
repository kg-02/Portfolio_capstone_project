import React, { useState, useEffect, useCallback } from "react";
import ErrorBoundary from "../ErrorBoundary";
import StockPurchaseForm from "../Stocks/StockPurchaseForm";
import PortfolioSummary from "../Dashboard/PortfolioSummary";
import StockList from "../Dashboard/StockList";
import PortfolioCharts from "../Dashboard/PortfolioCharts";
import SearchBar from "../Dashboard/SearchBar";
import DashboardLayout from "../Dashboard/DashboardLayout";
import ThemeToggle from "../ThemeToggle";
import LogoutButton from "../LogoutButton";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { playClickSound } from "../utils/sound";
import { MOCK_STOCKS } from "../data/mockStocks";
import { useAuth } from "../../hooks/useAuth";

import AppLogoLight from "../../assets/portfolio_app_icon_light.png";
import AppLogoDark from "../../assets/portfolio_app_icon_dark.png";

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedStock, setSelectedStock] = useState(null);
  const [editingHolding, setEditingHolding] = useState(null);

  const API_BASE_URL = "/api/stocks";

  const getAuthHeaders = () => {
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
  };

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stocks: ${response.status}`);
      }

      const data = await response.json();

      const mappedStocks = (data.stocks || []).map((stock) => ({
        stockId: stock.stockId,
        symbol: stock.stockSymbol,
        companyName: stock.companyName || "Unknown Company",
        quantity: stock.quantity,
        purchasePrice: stock.currentPrice,
        currentPrice: stock.currentPrice,
        totalValue: stock.totalValue || stock.quantity * stock.currentPrice,
        logoUrl:
          MOCK_STOCKS.find((s) => s.symbol === stock.stockSymbol)?.logoUrl ||
          "https://via.placeholder.com/64?text=💼",
      }));

      setStocks(mappedStocks);
    } catch (err) {
      setError(`Failed to load portfolio: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStocks();
    }
  }, [isAuthenticated, fetchStocks]);

  const handleStockSelect = (stock) => {
    playClickSound();
    setSelectedStock(stock);
    setEditingHolding(null);
    setCurrentView("details");
  };

  const handleBackToDashboard = () => {
    playClickSound();
    setSelectedStock(null);
    setEditingHolding(null);
    setCurrentView("dashboard");
    fetchStocks();
  };

  const handleStockFormSubmit = async (submittedData) => {
    try {
      const payload = {
        stockSymbol: submittedData.symbol,
        companyName: submittedData.companyName,
        currentPrice: parseFloat(submittedData.purchasePrice),
        quantity: parseInt(submittedData.quantity),
      };

      let response;

      if (editingHolding) {
        response = await fetch(`${API_BASE_URL}/${editingHolding.stockId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      await fetchStocks();
      handleBackToDashboard();
      alert(
        editingHolding
          ? "Stock updated successfully!"
          : "Stock purchased successfully!"
      );
    } catch (err) {
      alert(`Failed to save stock: ${err.message}`);
    }
  };

  const handleEdit = (portfolioItem) => {
    playClickSound();
    const staticData = MOCK_STOCKS.find(
      (s) => s.symbol === portfolioItem.symbol
    );

    const fullStockData = staticData || {
      ...portfolioItem,
      chartData: {},
      about: "Description not available",
      marketCap: "-",
      peRatio: "-",
      dividendYield: "-",
      changePercent: 0,
      logoUrl: "https://via.placeholder.com/64?text=💼",
    };

    setSelectedStock(fullStockData);
    setEditingHolding(portfolioItem);
    setCurrentView("details");
  };

  const handleDelete = async (stockId) => {
    if (!window.confirm("Delete this stock holding?")) return;

    playClickSound();

    try {
      const response = await fetch(`${API_BASE_URL}/${stockId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      setStocks((prev) => prev.filter((s) => s.stockId !== stockId));
      alert("Stock deleted successfully!");
    } catch (err) {
      alert("Failed to delete stock");
      await fetchStocks();
    }
  };

  if (authLoading) {
    return (
      <ThemeProvider>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          Loading Authentication...
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return <div>Authentication required. Redirecting...</div>;
  }

  /**
   * Theme-aware header defined inside the same file.
   * It uses useTheme() which reads from the ThemeProvider below.
   */
  const Header = ({ onSelectStock }) => {
    const { isDarkMode, colors } = useTheme();

    return (
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
          borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.04)",
          zIndex: 2000,
        }}
      >
        {/* LEFT: Logo + App Name */}
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
            <h2
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: 700,
                color: colors?.textPrimary || (isDarkMode ? "#fff" : "#0f172a"),
                lineHeight: 1,
              }}
            >
              StockX
            </h2>
            <div style={{ fontSize: 12, color: colors?.textSecondary || (isDarkMode ? "#94a3b8" : "#7c7e8c") }}>
              Portfolio · Track · Grow
            </div>
          </div>
        </div>

        {/* RIGHT: Search + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* searchbar will receive the onSelectStock handler */}
            <SearchBar onSelectStock={onSelectStock} />
          </div>

          <LogoutButton />
        </div>
      </div>
    );
  };

  /**
   * Theme-aware content wrapper that applies page background & text colors.
   * It also contains the original page content (unchanged).
   */
  const ThemeAwareContent = () => {
    const { isDarkMode, colors } = useTheme();

    return (
      <div style={{ backgroundColor: colors?.background || (isDarkMode ? "#0f172a" : "#F5F7FA"), color: colors?.textPrimary || (isDarkMode ? "#f1f5f9" : "#44475b"), minHeight: "100vh" }}>
        {/* spacer so fixed header doesn't overlap */}
        <div style={{ height: 92 }} />

        {/* Keep your original ThemeToggle (positioned fixed) */}
        <ThemeToggle />

        {currentView === "dashboard" && (
          <DashboardLayout>
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "24px",
              }}
            >
              {loading ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <p>Loading your portfolio...</p>
                </div>
              ) : error ? (
                <div style={{ color: "red" }}>
                  <strong>Error:</strong> {error}
                  <br />
                  <button onClick={fetchStocks}>Retry</button>
                </div>
              ) : (
                <>
                  <PortfolioSummary stocks={stocks} />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div style={{ gridColumn: "span 2" }}>
                      <StockList
                        stocks={stocks}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isLoading={loading}
                        error={error}
                      />
                    </div>

                    <div>
                      <PortfolioCharts stocks={stocks} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </DashboardLayout>
        )}

        {currentView === "details" && selectedStock && (
          <ErrorBoundary>
            <StockPurchaseForm
              stock={selectedStock}
              initialValues={editingHolding}
              onSubmit={handleStockFormSubmit}
              onBack={handleBackToDashboard}
              isSubmitting={loading}
            />
          </ErrorBoundary>
        )}
      </div>
    );
  };

  // Render ThemeProvider once (as you had), then render theme-aware header + content inside it
  return (
    <ThemeProvider>
      <>
        <Header onSelectStock={handleStockSelect} />
        <ThemeAwareContent />
      </>
    </ThemeProvider>
  );
};

export default Dashboard;
