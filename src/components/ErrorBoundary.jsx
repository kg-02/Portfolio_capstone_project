import React from 'react';
import { useTheme } from './context/ThemeContext';
 
class ErrorBoundaryInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
 
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
 
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }
 
    render() {
        if (this.state.hasError) {
            const { theme } = this.props;
            const colors = theme ? theme.colors : {
                background: '#fff',
                textPrimary: '#000',
                negative: '#eb5b3c',
                textSecondary: '#666',
                primary: '#00d09c'
            };
 
            return (
                <div style={{
                    padding: '24px',
                    color: colors.textPrimary,
                    backgroundColor: colors.background,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <h1 style={{ color: colors.negative, marginBottom: '16px' }}>Something went wrong.</h1>
                    <details style={{
                        whiteSpace: 'pre-wrap',
                        color: colors.textSecondary,
                        maxWidth: '800px',
                        textAlign: 'left',
                        backgroundColor: colors.cardBackground,
                        padding: '16px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        maxHeight: '400px'
                    }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '24px',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            backgroundColor: colors.primary,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
 
        return this.props.children;
    }
}
 
const ErrorBoundary = (props) => {
    const theme = useTheme();
    return <ErrorBoundaryInner {...props} theme={theme} />;
};
 
export default ErrorBoundary;