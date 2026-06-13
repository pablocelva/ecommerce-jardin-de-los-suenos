import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ProductPage from "../pages/ProductPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import AdminPanel from "../pages/AdminPanel";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute requiredRole="cliente">
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PrivateRoute requiredRole="cliente">
            <CartPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute requiredRole="cliente">
            <CheckoutPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminPanel />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
