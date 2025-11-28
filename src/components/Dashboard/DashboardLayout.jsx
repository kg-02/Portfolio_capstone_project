import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = ({ children }) => {
    const { colors } = useTheme();

    return (
        <div style={{
            backgroundColor: colors.background,
            minHeight: '100vh',
            transition: 'background-color 0.3s ease',
        }}>
            {children}
        </div>
    );
};

DashboardLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DashboardLayout;
