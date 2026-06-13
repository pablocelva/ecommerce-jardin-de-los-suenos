import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { ImagenesProvider } from "./context/ImagenesContext";

createRoot(document.getElementById("root")!).render(
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
);
