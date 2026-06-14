import type { ReactNode } from "react";
import AppFooter from "@/shared/components/Footer";
import styles from "../styles/auth.module.css";

interface AuthPageShellProps {
  children: ReactNode;
}

const AuthPageShell = ({ children }: AuthPageShellProps) => {
  return (
    <div className={styles.shell}>
      {children}
      <AppFooter />
    </div>
  );
};

export default AuthPageShell;
