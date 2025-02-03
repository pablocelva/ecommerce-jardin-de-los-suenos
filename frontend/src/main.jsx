import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider> {/* Envuelve todo con el AuthProvider */}
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
)
