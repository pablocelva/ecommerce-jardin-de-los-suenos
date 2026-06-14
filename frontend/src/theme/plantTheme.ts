import type { ThemeConfig } from "antd";

export const plantTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2d6a4f",
    colorPrimaryHover: "#40916c",
    colorPrimaryActive: "#1b4332",
    colorSuccess: "#52b788",
    colorBgLayout: "#f8faf7",
    colorBgContainer: "#ffffff",
    borderRadius: 12,
    fontFamily:
      "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    Layout: {
      headerBg: "#1b4332",
      siderBg: "#1b4332",
      bodyBg: "#f8faf7",
    },
    Menu: {
      darkItemBg: "#1b4332",
      darkSubMenuItemBg: "#163728",
    },
    Card: {
      borderRadiusLG: 16,
    },
    Button: {
      borderRadius: 10,
    },
  },
};
