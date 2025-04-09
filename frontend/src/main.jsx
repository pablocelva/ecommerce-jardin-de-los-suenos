import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import 'antd/dist/reset.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { ImagenesProvider } from './context/ImagenesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ImagenesProvider>
        <ProductProvider>
          <AuthProvider> 
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </ProductProvider>
      </ImagenesProvider>
    </Router>
  </StrictMode>,
)