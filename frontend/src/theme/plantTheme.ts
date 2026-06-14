import type { ThemeConfig } from "antd";
import { colors, fontFamily, radii } from "./tokens";

export const plantTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorPrimaryHover: colors.primaryHover,
    colorPrimaryActive: colors.primaryActive,
    colorSuccess: colors.success,
    colorBgLayout: colors.surface,
    colorBgContainer: colors.white,
    borderRadius: radii.default,
    fontFamily,
  },
  components: {
    Layout: {
      headerBg: colors.primaryDark,
      siderBg: colors.primaryDark,
      bodyBg: colors.surface,
    },
    Menu: {
      darkItemBg: colors.primaryDark,
      darkSubMenuItemBg: "#163728",
    },
    Card: {
      borderRadiusLG: radii.card,
    },
    Button: {
      borderRadius: radii.button,
    },
  },
};
