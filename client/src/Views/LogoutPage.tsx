import { FC, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export const LogoutPage: FC = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Navigate to="/"></Navigate>;
};
