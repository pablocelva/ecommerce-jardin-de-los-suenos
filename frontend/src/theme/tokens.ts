/**
 * Fuente única de tokens de diseño.
 * Ant Design (`plantTheme`) y CSS Modules (`var(--color-*)`) deben alinearse con estos valores.
 */
export const colors = {
  primary: "#2d6a4f",
  primaryHover: "#40916c",
  primaryActive: "#1b4332",
  primaryDark: "#1b4332",
  navbar: "#1f7d53",
  navbarHoverText: "#1c3224",
  surface: "#f8faf7",
  border: "#e9f5ee",
  white: "#ffffff",
  textPrimary: "#1b4332",
  textSecondary: "#444444",
  textMuted: "#555555",
  textInverse: "#f3f3f3",
  success: "#52b788",
  accent: "#95d5b2",
  accentLight: "#b7e4c7",
  footerDark: "#152a1e",
} as const;

export const fontFamily =
  "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export const radii = {
  button: 10,
  default: 12,
  card: 16,
  panel: 20,
} as const;

/** Variables CSS inyectadas en `:root` al arrancar la app. */
export const cssVariables: Record<string, string> = {
  "--color-primary": colors.primary,
  "--color-primary-hover": colors.primaryHover,
  "--color-primary-active": colors.primaryActive,
  "--color-primary-dark": colors.primaryDark,
  "--color-navbar": colors.navbar,
  "--color-navbar-hover-text": colors.navbarHoverText,
  "--color-surface": colors.surface,
  "--color-border": colors.border,
  "--color-white": colors.white,
  "--color-text-primary": colors.textPrimary,
  "--color-text-secondary": colors.textSecondary,
  "--color-text-muted": colors.textMuted,
  "--color-text-inverse": colors.textInverse,
  "--color-success": colors.success,
  "--color-accent": colors.accent,
  "--color-accent-light": colors.accentLight,
  "--color-footer-dark": colors.footerDark,
  "--radius-button": `${radii.button}px`,
  "--radius-default": `${radii.default}px`,
  "--radius-card": `${radii.card}px`,
  "--radius-panel": `${radii.panel}px`,
  "--font-family-base": fontFamily,
};

export function applyCssVariables(root: HTMLElement = document.documentElement) {
  Object.entries(cssVariables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
