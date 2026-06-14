import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import PrivateRoute from "./PrivateRoute";
import CategoryRedirect from "./CategoryRedirect";

const Home = lazy(() => import("@/features/home/pages/Home"));
const CatalogPage = lazy(() => import("@/features/catalog/pages/CatalogPage"));
const ProductPage = lazy(() => import("@/features/product/pages/ProductPage"));
const BlogsPage = lazy(() => import("@/features/blog/pages/BlogsPage"));
const BlogPostPage = lazy(() => import("@/features/blog/pages/BlogPostPage"));
const NotFound = lazy(() => import("@/shared/components/NotFound"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ProfilePage = lazy(() => import("@/features/auth/pages/ProfilePage"));
const CartPage = lazy(() => import("@/features/cart/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/features/checkout/pages/CheckoutPage"));
const PaymentPage = lazy(() => import("@/features/checkout/pages/PaymentPage"));
const AdminPanel = lazy(() => import("@/features/admin/pages/AdminPanel"));

const PageLoader = () => (
  <div className="route-loading">
    <Spin size="large" />
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/catalogo/categoria/:categoryId" element={<CatalogPage />} />
        <Route path="/categoria/:categoryId" element={<CategoryRedirect />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogPostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />

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
          path="/checkout/payment"
          element={
            <PrivateRoute requiredRole="cliente">
              <PaymentPage />
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
    </Suspense>
  );
};

export default AppRouter;
