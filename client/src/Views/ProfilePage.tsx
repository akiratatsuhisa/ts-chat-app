import { FC } from "react";
import { useAuth } from "../Contexts/AuthContext";

export const ProfilePage: FC = () => {
  const { currentUser } = useAuth();
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
};
