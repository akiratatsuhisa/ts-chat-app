import {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import { apiInstance, apiUrl, wsUrl } from "../Services/Api.service";
import { default as decode } from "jwt-decode";
import { io, Socket } from "socket.io-client";

interface IAuthUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
  [key: string]: any;
}

function getUserFromAccessToken(token: string): IAuthUser | null {
  if (token?.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
    const user: any = decode(token);
    user.avatarUrl = new URL(user.avatarUrl, apiUrl);
    return user;
  }
  return null;
}

interface IAuthContext {
  currentUser: IAuthUser | null;
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
  const [currentUser, setCurrentUser] = useState<IAuthUser | null>(
    getUserFromAccessToken(localStorage.getItem("accessToken") || "")
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );
  const [socket, setSocket] = useState<Socket | null>();

  const setupSocket = (): void => {
    if (!accessToken) return;
    const url = new URL("/chat", wsUrl).toString();
    const socket = io(url, {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("connect", () => {
      setSocket(socket);
      console.log("connected");
    });

    socket.on("disconnect", () => {
      setSocket(null);
      console.log("disconnected");
    });
  };

  useEffect(() => {
    setCurrentUser(getUserFromAccessToken(accessToken || ""));

    if (!accessToken) {
      socket?.disconnect();
    } else {
      setupSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const login = async (username: string, password: string): Promise<string> => {
    try {
      const result = await apiInstance.post("/users/login", {
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
      const result = await apiInstance.post("/users/register", {
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
