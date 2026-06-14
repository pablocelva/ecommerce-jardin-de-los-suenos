import { useState } from "react";
import { Badge, Button, Drawer, Grid, Menu, Space } from "antd";
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
} from "@ant-design/icons";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";
import { useCart } from "@/shared/context/CartContext";
import CartDrawer from "@/features/cart/components/CartDrawer";
import GrassIcon from "@/shared/components/GrassIcon";
import styles from "./Navbar.module.css";

/** Icono de marca fijo — ver GrassIcon.tsx; no reemplazar. */

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
      ? [{ key: "/profile", label: "Mi Perfil", icon: <UserOutlined />, path: "/profile" }]
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
        label: (
          <NavLink
            to={item.path}
            className={styles.navLink}
            onClick={() => setDrawerOpen(false)}
          >
            <span className={styles.navLinkIcon} aria-hidden="true">
              {item.icon}
            </span>
            <span className={styles.navLinkLabel}>{item.label}</span>
          </NavLink>
        ),
      }))}
      className={styles.menu}
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
          <GrassIcon className={styles.brandIcon} />
          <span className={styles.brandTitle}>Jardin de los Sueños</span>
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
                className={`${styles.actionBtn} ${styles.cartBtn}`}
                icon={<ShoppingCartOutlined />}
                onClick={openCartDrawer}
                aria-label="Abrir carrito"
              />
            </Badge>
          )}

          {isAuthenticated && (
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className={styles.actionBtn}
            >
              {!isCompactNav && "Cerrar sesión"}
            </Button>
          )}

          {isCompactNav && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
              className={`${styles.actionBtn} ${styles.menuToggleBtn}`}
            />
          )}
        </Space>
      </div>

      <Drawer
        title="Menú"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        classNames={{
          header: styles.drawerHeader,
          body: styles.drawerBody,
        }}
      >
        {menuContent}
        {isAuthenticated && (
          <div className={styles.drawerFooter}>
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
