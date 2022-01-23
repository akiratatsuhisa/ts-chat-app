import { createContext, useContext, FunctionComponent, useState } from "react";

interface IAuthContext {
  currentUser: object | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = (): IAuthContext => {
  return useContext<IAuthContext>(AuthContext);
};

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<object | null>(null);

  const login = async (username: string, password: string) => {
    await new Promise((resolve) => resolve(true));
  };

  const register = async (username: string, password: string) => {
    await new Promise((resolve) => resolve(true));
  };

  const value: IAuthContext = { currentUser, login, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
