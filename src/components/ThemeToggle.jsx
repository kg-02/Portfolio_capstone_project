import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { playClickSound } from './utils/sound';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    const handleToggle = () => {
        playClickSound();
        toggleTheme();
    };

    return (
        <button
            onClick={handleToggle}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isDarkMode ? '#ffffff' : '#1e293b',
                color: isDarkMode ? '#1e293b' : '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 1000,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDarkMode ? (
                <Sun size={24} color="#fbbf24" />
            ) : (
                <Moon size={24} color="#475569" />
            )}
        </button>
    );
};

export default ThemeToggle;
