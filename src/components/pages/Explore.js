import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Header from "../Header";
import { useLiveStocks } from "../../hooks/useLiveStocks";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { TrendingUp, TrendingDown } from "lucide-react";

const Explore = () => {
    const { isDarkMode, colors } = useTheme();
    const navigate = useNavigate();
    const stocks = useLiveStocks(); // Live fluctuating stocks

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: colors.background,
                color: colors.textPrimary,
            }}
        >
            <Header />

            {/* Spacer for fixed header */}
            <div style={{ height: 92 }} />

            <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        textAlign: "center"
                    }}
                >
                    Explore Stocks
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 3,
                    }}
                >
                    {stocks.map((stock) => (
                        <Card
                            key={stock.id}
                            onClick={() => navigate("/dashboard", { state: { selectedStock: stock } })}
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                backgroundColor: colors.cardBackground,
                                color: colors.textPrimary,
                                borderRadius: 3,
                                cursor: "pointer",
                                boxShadow: isDarkMode
                                    ? "0 4px 20px rgba(0,0,0,0.4)"
                                    : "0 4px 20px rgba(0,0,0,0.05)",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                },
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <img
                                        src={stock.logoUrl}
                                        alt={stock.companyName}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "50%",
                                            marginRight: 16,
                                            objectFit: "contain",
                                            backgroundColor: "#fff",
                                            padding: 4
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                                            {stock.symbol}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                            {stock.companyName}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                        ₹{stock.currentPrice.toLocaleString()}
                                    </Typography>
                                    <Chip
                                        icon={stock.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        label={`${stock.changePercent > 0 ? "+" : ""}${stock.changePercent}%`}
                                        sx={{
                                            backgroundColor: stock.changePercent >= 0 ? "rgba(0, 208, 156, 0.1)" : "rgba(235, 91, 60, 0.1)",
                                            color: stock.changePercent >= 0 ? colors.positive : colors.negative,
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            "& .MuiChip-icon": {
                                                color: "inherit"
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: colors.textSecondary }}>
                                    <Box>
                                        <Typography variant="caption" display="block">Market Cap</Typography>
                                        <Typography variant="body2" fontWeight="500">{stock.marketCap}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" display="block">P/E Ratio</Typography>
                                        <Typography variant="body2" fontWeight="500">{stock.peRatio}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" display="block">Div Yield</Typography>
                                        <Typography variant="body2" fontWeight="500">{stock.dividendYield}</Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 2,
                                        color: colors.textSecondary,
                                        display: '-webkit-box',
                                        overflow: 'hidden',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                    }}
                                >
                                    {stock.about}
                                </Typography>

                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Explore;

