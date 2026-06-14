import { useState } from "react";
import { Badge, Button, Drawer, Grid, Menu, Space, Typography } from "antd";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  SettingOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";
import { useCart } from "@/shared/context/CartContext";
import CartDrawer from "@/features/cart/components/CartDrawer";
import styles from "./Navbar.module.css";

const { useBreakpoint } = Grid;

const Navbar = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const { cart, openCartDrawer } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isCompactNav = !screens.lg;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate("/");
  };

  const navItems = [
    { key: "/", label: "Inicio", icon: <HomeOutlined />, path: "/" },
    { key: "/catalogo", label: "Catálogo", icon: <AppstoreOutlined />, path: "/catalogo" },
    { key: "/blogs", label: "Blog", icon: <ReadOutlined />, path: "/blogs" },
    ...(isAuthenticated && userRole === "cliente"
      ? [
          // Carrito accesible solo desde el drawer lateral (icono en navbar)
          // { key: "/cart", label: "Carrito", icon: <ShoppingCartOutlined />, path: "/cart" },
          { key: "/profile", label: "Mi Perfil", icon: <UserOutlined />, path: "/profile" },
        ]
      : []),
    ...(isAuthenticated && userRole === "admin"
      ? [{ key: "/admin", label: "Admin", icon: <SettingOutlined />, path: "/admin" }]
      : []),
    ...(!isAuthenticated
      ? [
          { key: "/login", label: "Iniciar sesión", icon: <LoginOutlined />, path: "/login" },
          { key: "/register", label: "Registrarse", icon: <UserOutlined />, path: "/register" },
        ]
      : []),
  ];

  const selectedKey =
    navItems.find((item) => {
      if (item.path === "/catalogo") {
        return location.pathname.startsWith("/catalogo");
      }
      if (item.path === "/blogs") {
        return location.pathname.startsWith("/blogs");
      }
      return item.path === location.pathname;
    })?.key ?? "/";

  const menuContent = (
    <Menu
      theme="dark"
      mode={isCompactNav ? "inline" : "horizontal"}
      selectedKeys={[selectedKey]}
      items={navItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: (
          <NavLink
            to={item.path}
            onClick={() => setDrawerOpen(false)}
            style={{ color: "inherit" }}
          >
            {item.label}
          </NavLink>
        ),
      }))}
      style={
        isCompactNav
          ? { border: "none", background: "transparent" }
          : {
              flex: 1,
              minWidth: 0,
              justifyContent: "flex-end",
              background: "transparent",
              borderBottom: "none",
            }
      }
    />
  );

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink
          to="/"
          className={styles.brand}
          onClick={() => setDrawerOpen(false)}
        >
          <Typography.Title level={3} className={styles.brandTitle}>
            <BranchesOutlined className={styles.brandIcon} />
            Jardin de los Sueños
          </Typography.Title>
        </NavLink>

        {!isCompactNav && (
          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {menuContent}
          </nav>
        )}

        <Space size="middle" className={styles.actions}>
          {isAuthenticated && userRole === "cliente" && (
            <Badge count={cartCount} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                icon={<ShoppingCartOutlined style={{ fontSize: 20, color: "#fff" }} />}
                onClick={openCartDrawer}
                aria-label="Abrir carrito"
              />
            </Badge>
          )}

          {isAuthenticated && (
            <Button
              type="text"
              icon={<LogoutOutlined style={{ color: "#fff" }} />}
              onClick={handleLogout}
              className={isCompactNav ? undefined : styles.logoutBtn}
            >
              {!isCompactNav && "Cerrar sesión"}
            </Button>
          )}

          {isCompactNav && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 22, color: "#fff" }} />}
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
            />
          )}
        </Space>
      </div>

      <Drawer
        title="Menú"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ body: { padding: 0, background: "#1b4332" } }}
        headerStyle={{ background: "#1b4332", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        {menuContent}
        {isAuthenticated && (
          <div style={{ padding: "16px 24px" }}>
            <Button block danger onClick={handleLogout} icon={<LogoutOutlined />}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </Drawer>

      {isAuthenticated && userRole === "cliente" && <CartDrawer />}
    </header>
  );
};

export default Navbar;
