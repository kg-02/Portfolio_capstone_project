import React from 'react';
import { LogOut } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { playClickSound } from './utils/sound';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const { colors } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        playClickSound();

        if (!window.confirm('Are you sure you want to logout?')) return;

        try {
            // ✅ Call backend to clear JWT HttpOnly cookie
            await fetch("https://register-login-backend-1.onrender.com/api/auth/logout", {
                method: "POST",
                credentials: "include", // ✅ Sends cookie so backend can clear it
            });

            // Clear local display data
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('role');

            // Redirect to login page
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const styles = {
        button: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: colors.cardBackground,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            color: colors.textPrimary,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            outline: 'none',
        },
        icon: {
            width: '18px',
            height: '18px',
        }
    };

    return (
        <button
            style={styles.button}
            onClick={handleLogout}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.hover;
                e.currentTarget.style.borderColor = colors.primary;
                e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.cardBackground;
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.color = colors.textPrimary;
            }}
        >
            <LogOut style={styles.icon} />
            Logout
        </button>
    );
};

export default LogoutButton;
