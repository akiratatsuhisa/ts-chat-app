import { FC, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { BaseLayout } from "./Components/BaseLayout";
import { AboutPage } from "./Views/AboutPage";
import { ChatRoomPage } from "./Views/ChatRoomPage";
import { ChatRoomsPage } from "./Views/ChatRoomsPage";
import { HomePage } from "./Views/HomePage";
import { LoginPage } from "./Views/LoginPage";
import { RegisterPage } from "./Views/RegisterPage";

export const App: FC = () => {

  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<HomePage />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/chat" element={<ChatRoomsPage />}></Route>
        <Route path="/chat/:id" element={<ChatRoomPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
      </Route>
    </Routes>
  );
};
