import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BaseLayout } from "./Components/BaseLayout";
import { useAuth } from "./Contexts/AuthContext";
import { AboutPage } from "./Views/AboutPage";
import { ChatRoomPage } from "./Views/ChatRoomPage";
import { ChatRoomsPage } from "./Views/ChatRoomsPage";
import { HomePage } from "./Views/HomePage";
import { LoginPage } from "./Views/LoginPage";
import { LogoutPage } from "./Views/LogoutPage";
import { ProfilePage } from "./Views/ProfilePage";
import { RegisterPage } from "./Views/RegisterPage";

export const App: FC = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<HomePage />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/chat" element={<ChatRoomsPage />}></Route>
        <Route
          path="/chat/:id"
          element={!currentUser ? <Navigate to="/login" /> : <ChatRoomPage />}
        ></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/logout" element={<LogoutPage />}></Route>
        <Route
          path="/profile"
          element={!currentUser ? <Navigate to="/login" /> : <ProfilePage />}
        ></Route>
      </Route>
    </Routes>
  );
};
