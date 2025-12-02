import React, { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

export const WalletProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshBalance = () => {
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
            const storedBalance = localStorage.getItem(`wallet_balance_${currentUserId}`);
            if (storedBalance) {
                setBalance(parseFloat(storedBalance));
            } else {
                const initialBalance = 50000;
                setBalance(initialBalance);
                localStorage.setItem(`wallet_balance_${currentUserId}`, initialBalance);
            }
        } else {
            setBalance(0);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshBalance();
    }, []);

    const updateBalance = (amount, type) => {
        const currentUserId = localStorage.getItem("userId");
        setBalance((prev) => {
            let newBalance = prev;
            if (type === "add") {
                newBalance += amount;
            } else if (type === "subtract") {
                newBalance -= amount;
            }

            if (currentUserId) {
                localStorage.setItem(`wallet_balance_${currentUserId}`, newBalance);
            }

            return newBalance;
        });
    };

    const hasSufficientFunds = (amount) => {
        return balance >= amount;
    };

    return (
        <WalletContext.Provider value={{ balance, loading, updateBalance, hasSufficientFunds, refreshBalance }}>
            {children}
        </WalletContext.Provider>
    );
};
