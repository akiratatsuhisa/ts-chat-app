import {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import { apiInstance, apiUrl } from "../Services/Api.service";
import { default as decode } from "jwt-decode";

function getUserFromAccessToken(token: string): any {
  if (token?.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
    const user: any = decode(token);
    user.avatarUrl = new URL(user.avatarUrl, apiUrl);
    return user;
  }
  return null;
}

interface IAuthContext {
  currentUser: any | null;
  login: (username: string, password: string) => Promise<string>;
  register: (
    username: string,
    displayName: string,
    email: string,
    password: string
  ) => Promise<string>;
  logout: () => string;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = (): IAuthContext => {
  return useContext<IAuthContext>(AuthContext);
};

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(
    getUserFromAccessToken(localStorage.getItem("accessToken") || "")
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );

  useEffect(() => {
    setCurrentUser(getUserFromAccessToken(accessToken || ""));
  }, [accessToken]);

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const result = await apiInstance.post("/api/users/login", {
        username,
        password,
      });
      localStorage.setItem("accessToken", result.data.token);
      setAccessToken(result.data.token);
      return result.data.message;
    } catch (e) {
      throw e;
    }
  };

  const register = async (
    username: string,
    displayName: string,
    email: string,
    password: string
  ): Promise<string> => {
    try {
      const result = await apiInstance.post("/api/users/register", {
        username,
        displayName,
        email,
        password,
      });
      setAccessToken(result.data.token);
      return result.data.message;
    } catch (e) {
      throw e;
    }
  };

  const logout = (): string => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    return "Logout successfully.";
  };

  const value: IAuthContext = { currentUser, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
