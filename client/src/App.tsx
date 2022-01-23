import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { BaseLayout } from "./Components/BaseLayout";
import { Home } from "./Views/Home";

export const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<Home />}></Route>
      </Route>
    </Routes>
  );
};
