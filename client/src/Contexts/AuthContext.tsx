import {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import { apiInstance } from "../Services/Api.service";
import { default as decode } from "jwt-decode";

interface IAuthContext {
  currentUser: object | null;
  login: (username: string, password: string) => Promise<string>;
  register: (
    username: string,
    password: string,
    displayName: string,
    email?: string
  ) => Promise<string>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuth = (): IAuthContext => {
  return useContext<IAuthContext>(AuthContext);
};

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );

  useEffect(() => {
    if (
      accessToken?.match(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
      )
    ) {
      setCurrentUser(decode(accessToken));
    } else {
      setCurrentUser(null);
    }
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
    password: string,
    displayName: string,
    email?: string
  ): Promise<string> => {
    try {
      const result = await apiInstance.post("/api/users/register", {
        username,
        password,
        displayName,
        email,
      });
      setAccessToken(result.data.token);
      return result.data.message;
    } catch (e) {
      throw e;
    }
  };

  const value: IAuthContext = { currentUser, login, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
