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
import { useLiveStocks } from "../../hooks/useLiveStocks";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../context/WalletContext";
import { Sun, Moon } from "lucide-react";
import Profile from "../pages/Profile";
import Header from "../Header";
import { useNavigate, useLocation } from "react-router-dom";


import AppLogoLight from "../../assets/portfolio_app_icon_light.png";
import AppLogoDark from "../../assets/portfolio_app_icon_dark.png";

const Dashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasSufficientFunds, updateBalance } = useWallet();

  const liveStocks = useLiveStocks(); // Live fluctuating stocks

  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedStock, setSelectedStock] = useState(null);
  const [editingHolding, setEditingHolding] = useState(null);

  const API_BASE_URL = "https://capstone-backend-service-mkiq.onrender.com/api/stocks";
  const navigate = useNavigate();
  const location = useLocation();


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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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

  // Update current prices from liveStocks when they change
  useEffect(() => {
    if (stocks.length > 0 && liveStocks.length > 0) {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          const liveStock = liveStocks.find(ls => ls.symbol === stock.symbol);
          if (liveStock) {
            return {
              ...stock,
              currentPrice: liveStock.currentPrice,
              totalValue: stock.quantity * liveStock.currentPrice,
            };
          }
          return stock;
        })
      );
    }
  }, [liveStocks]);


  const handleStockSelect = (stock) => {
    playClickSound();
    setSelectedStock(stock);
    setEditingHolding(null);
    setCurrentView("details");
  };

  useEffect(() => {
    if (location.state && location.state.selectedStock) {
      handleStockSelect(location.state.selectedStock);
      // Clear the state so it doesn't re-trigger if we navigate back and forth in a way that preserves state
      // but we want to keep it if we just refresh.
      // Actually, let's just leave it. If they are here with that state, they probably want to see that stock.
      // If they click "Back to Dashboard", handleBackToDashboard clears selectedStock and currentView.
    }
  }, [location]);

  const handleBackToDashboard = () => {
    playClickSound();
    setSelectedStock(null);
    setEditingHolding(null);
    setCurrentView("dashboard");
    fetchStocks();
    // Clear location state when going back to dashboard view
    navigate("/dashboard", { replace: true, state: {} });
  };

  const handleStockFormSubmit = async (submittedData) => {
    try {
      const payload = {
        stockSymbol: submittedData.symbol,
        companyName: submittedData.companyName,
        currentPrice: parseFloat(submittedData.purchasePrice),
        quantity: parseInt(submittedData.quantity),
      };

      const cost = payload.quantity * payload.currentPrice;
      let response;

      if (editingHolding) {
        // Calculate difference in cost
        const oldCost = editingHolding.quantity * editingHolding.purchasePrice; // Approximation
        const diff = cost - oldCost;

        if (diff > 0) {
          if (!hasSufficientFunds(diff)) {
            alert("Insufficient funds in wallet!");
            return;
          }
        }

        response = await fetch(`${API_BASE_URL}/${editingHolding.stockId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          if (diff > 0) updateBalance(diff, "subtract");
          else if (diff < 0) updateBalance(Math.abs(diff), "add");
        }

      } else {
        if (!hasSufficientFunds(cost)) {
          alert("Insufficient funds in wallet!");
          return;
        }

        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          updateBalance(cost, "subtract");
        }
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
    const staticData = liveStocks.find(
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
    if (!window.confirm("Sell all of this stock holding?")) return;

    playClickSound();

    try {
      const stockToDelete = stocks.find((s) => s.stockId === stockId);

      const response = await fetch(`${API_BASE_URL}/${stockId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      if (stockToDelete) {
        const sellValue = stockToDelete.quantity * stockToDelete.currentPrice;
        updateBalance(sellValue, "add");
      }

      setStocks((prev) => prev.filter((s) => s.stockId !== stockId));
      alert("Stock sold successfully! Funds added to wallet.");
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

        {/* Removed this because now i have added it into the hamburger menu options ThemeToggle (positioned fixed) */}
        {/* <ThemeToggle /> */}

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
                  {/* SECTION 1 — Portfolio Summary */}
                  <div style={{ marginBottom: "32px" }}>
                    <PortfolioSummary stocks={stocks} />
                  </div>

                  {/* SECTION 2 — Charts + Stock List */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "24px",
                      marginBottom: "32px", // <-- IMPORTANT
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
        <Header onSelectStock={handleStockSelect} showSearch={true} />
        <ThemeAwareContent />
      </>
    </ThemeProvider>
  );
};

export default Dashboard;