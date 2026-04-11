import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/michroma/400.css'
import '@fontsource/source-serif-4/300.css'
import '@fontsource/source-serif-4/400.css'
import '@fontsource/source-serif-4/300-italic.css'
import '@fontsource/source-serif-4/400-italic.css'
import 'lenis/dist/lenis.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </HashRouter>
    </React.StrictMode>,
)

