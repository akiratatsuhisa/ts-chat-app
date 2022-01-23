import { FC } from "react";
import { Outlet } from "react-router-dom";

export const BaseLayout: FC = () => {
  return (
    <>
      <Outlet></Outlet>
    </>
  );
};
