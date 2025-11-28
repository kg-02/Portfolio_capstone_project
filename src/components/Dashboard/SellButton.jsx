import React from 'react';
import PropTypes from 'prop-types';

const SellButton = ({ onClick, size = 'medium' }) => {
    const sizeConfig = {
        small: { width: 40, height: 24, fontSize: 14 },
        medium: { width: 70, height: 42, fontSize: 24 },
        large: { width: 90, height: 54, fontSize: 32 }
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    return (
        <button
            onClick={onClick}
            style={{
                ...styles.button,
                width: config.width,
                height: config.height,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
        >
            <div style={styles.innerRectangle}>
                <div style={styles.gloss} />
                <span style={{ ...styles.text, fontSize: config.fontSize }}>S</span>
            </div>
        </button>
    );
};

const styles = {
    button: {
        position: 'relative',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        padding: 0,
        background: 'linear-gradient(145deg, #d32f2f 0%, #f44336 50%, #d32f2f 100%)',
        boxShadow: `
      0 4px 8px rgba(211, 47, 47, 0.4),
      inset 0 -2px 4px rgba(0, 0, 0, 0.2),
      inset 0 2px 4px rgba(255, 255, 255, 0.15)
    `,
        transition: 'transform 0.2s ease',
        outline: 'none',
    },
    innerRectangle: {
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #ff5252 0%, #e53935 50%, #c62828 100%)',
        border: '1px solid rgba(139, 0, 0, 0.3)',
        overflow: 'hidden',
    },
    gloss: {
        position: 'absolute',
        top: '5%',
        left: '10%',
        right: '10%',
        height: '35%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)',
        borderRadius: '6px',
        filter: 'blur(2px)',
        pointerEvents: 'none',
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        letterSpacing: '0.5px',
        textShadow: `
      1px 1px 3px rgba(0, 0, 0, 0.4),
      0 0 6px rgba(0, 0, 0, 0.2)
    `,
        zIndex: 1,
    }
};

SellButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default SellButton;
