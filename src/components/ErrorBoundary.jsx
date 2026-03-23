import { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    color: '#94a3b8',
                    textAlign: 'center',
                    padding: '2rem',
                }}>
                    <h2 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>Something went wrong</h2>
                    <p>Please try refreshing the page.</p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false })
                            window.location.reload()
                        }}
                        style={{
                            marginTop: '1rem',
                            padding: '0.6rem 1.5rem',
                            background: 'linear-gradient(135deg, #06b6d4, #10b981)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
