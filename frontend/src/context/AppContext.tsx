import { createContext, useState, type ReactNode } from "react";
import type { User } from "../schemas";

interface AppContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser }}>{children}</AppContext.Provider>
  );
};
