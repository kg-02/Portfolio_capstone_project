import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            const saved = localStorage.getItem('darkMode');
            return saved ? JSON.parse(saved) : false;
        } catch (error) {
            console.error('Error parsing theme preference:', error);
            return false;
        }
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const theme = {
        isDarkMode,
        toggleTheme,
        colors: {
            // Background colors
            background: isDarkMode ? '#0f172a' : '#F5F7FA',
            cardBackground: isDarkMode ? '#1e293b' : '#ffffff',

            // Text colors
            textPrimary: isDarkMode ? '#f1f5f9' : '#44475b',
            textSecondary: isDarkMode ? '#94a3b8' : '#7c7e8c',

            // Border colors
            border: isDarkMode ? '#334155' : '#ebedf0',

            // Accent colors (these stay the same)
            positive: '#00d09c',
            negative: '#eb5b3c',
            primary: '#00d09c',

            // Input colors
            inputBackground: isDarkMode ? '#334155' : '#ffffff',
            inputBorder: isDarkMode ? '#475569' : '#ebedf0',

            // Hover states
            hover: isDarkMode ? '#334155' : '#f9fafb',
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
