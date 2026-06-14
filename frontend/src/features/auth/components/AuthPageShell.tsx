import type { ReactNode } from "react";
import AppFooter from "@/shared/components/Footer";

interface AuthPageShellProps {
  children: ReactNode;
}

const AuthPageShell = ({ children }: AuthPageShellProps) => {
  return (
    <div className="auth-shell">
      {children}
      <AppFooter />
    </div>
  );
};

export default AuthPageShell;
