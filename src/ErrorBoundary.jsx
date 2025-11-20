import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0a0f',
          color: 'white',
          padding: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ color: '#a855f7', marginBottom: '20px' }}>Oops! Something went wrong</h1>
          <p style={{ marginBottom: '20px', maxWidth: '600px', textAlign: 'center' }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '40px', maxWidth: '800px', width: '100%' }}>
              <summary style={{ cursor: 'pointer', color: '#ec4899', marginBottom: '10px' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ 
                background: 'rgba(255,255,255,0.1)', 
                padding: '20px', 
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
