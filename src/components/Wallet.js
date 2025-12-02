import React, { useState } from "react";
import { useWallet } from "./context/WalletContext";
import { useTheme } from "./context/ThemeContext";
import { X, Wallet as WalletIcon, ArrowUpCircle } from "lucide-react";
import { Box, Typography, Button, Modal, Card, CardContent, TextField, InputAdornment } from "@mui/material";

const Wallet = ({ open, onClose }) => {
    const { isDarkMode, colors } = useTheme();
    const { balance, updateBalance, loading } = useWallet();
    const [amount, setAmount] = useState("");

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleTopUp = async () => {
        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const topUpAmount = parseFloat(amount);
        if (!topUpAmount || topUpAmount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        const options = {
            key: "rzp_test_RmeET7lIph7vJw",
            amount: topUpAmount * 100,
            currency: "INR",
            name: "StockX Portfolio",
            description: "Wallet Top Up",
            image: "https://via.placeholder.com/150",
            handler: function (response) {
                updateBalance(topUpAmount, "add");
                setAmount("");
                alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            },
            prefill: {
                name: "User Name",
                email: "user@example.com",
                contact: "9999999999",
            },
            theme: {
                color: colors.primary,
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card
                sx={{
                    width: "90%",
                    maxWidth: 500,
                    backgroundColor: colors.cardBackground,
                    borderRadius: 4,
                    boxShadow: isDarkMode
                        ? "0 8px 32px rgba(0,0,0,0.6)"
                        : "0 8px 32px rgba(0,0,0,0.15)",
                    outline: "none",
                    position: "relative",
                }}
            >
                {/* Close Button */}
                <Box
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        cursor: "pointer",
                        color: colors.textSecondary,
                        transition: "0.2s",
                        "&:hover": {
                            color: colors.textPrimary,
                        },
                    }}
                >
                    <X size={24} />
                </Box>

                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 3,
                                background: colors.primary,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <WalletIcon size={28} color="#fff" />
                        </Box>
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    color: colors.primary,
                                    mb: 0.5,
                                }}
                            >
                                My Wallet
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: colors.textSecondary,
                                }}
                            >
                                Manage your funds
                            </Typography>
                        </Box>
                    </Box>

                    {/* Balance Display */}
                    <Box
                        sx={{
                            background: isDarkMode
                                ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                                : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                            borderRadius: 3,
                            p: 4,
                            mb: 3,
                            textAlign: "center",
                            border: `1px solid ${isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: colors.textSecondary,
                                mb: 1,
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                fontSize: "0.75rem",
                            }}
                        >
                            Available Balance
                        </Typography>
                        {loading ? (
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: "bold",
                                    color: colors.textSecondary,
                                }}
                            >
                                Loading...
                            </Typography>
                        ) : (
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: "bold",
                                    color: colors.textPrimary,
                                    background: colors.primary,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }}
                            >
                                ₹{balance.toLocaleString()}
                            </Typography>
                        )}
                    </Box>

                    {/* Amount Input */}
                    <TextField
                        fullWidth
                        placeholder="Enter amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                color: colors.textPrimary,
                                "& fieldset": {
                                    borderColor: colors.border,
                                },
                                "&:hover fieldset": {
                                    borderColor: colors.primary,
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: colors.primary,
                                },
                            },
                            "& .MuiInputBase-input": {
                                color: colors.textPrimary,
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography sx={{ color: colors.textSecondary }}>₹</Typography>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Top Up Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleTopUp}
                        disabled={!amount || parseFloat(amount) <= 0}
                        sx={{
                            background: colors.primary,
                            color: "#fff",
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: "bold",
                            borderRadius: 2,
                            textTransform: "none",
                            boxShadow: isDarkMode
                                ? "0 4px 16px rgba(0,0,0,0.4)"
                                : "0 4px 16px rgba(0,0,0,0.1)",
                            transition: "0.3s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: isDarkMode
                                    ? "0 6px 20px rgba(0,0,0,0.5)"
                                    : "0 6px 20px rgba(0,0,0,0.15)",
                            },
                            "&.Mui-disabled": {
                                background: colors.primary,
                                color: "#fff",
                                opacity: 0.5
                            }
                        }}
                        startIcon={<ArrowUpCircle size={20} />}
                    >
                        Top Up Wallet
                    </Button>

                    {/* Info Text */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            textAlign: "center",
                            color: colors.textSecondary,
                            mt: 2,
                        }}
                    >
                        Add funds to your wallet to start trading
                    </Typography>
                </CardContent>
            </Card>
        </Modal>
    );
};

export default Wallet;