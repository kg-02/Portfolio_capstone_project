import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.log('No token found in localStorage');
                    setIsAuthenticated(false);
                    navigate('/');
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://register-login-backend-1.onrender.com/api/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Dashboard auth check status:', response.status);

                if (response.ok) {
                    console.log('Auth check passed');
                    setIsAuthenticated(true);
                } else {
                    console.log('Auth check failed, redirecting to login');
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    localStorage.removeItem('role');
                    setIsAuthenticated(false);
                    navigate('/');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    return { isAuthenticated, loading };
};
