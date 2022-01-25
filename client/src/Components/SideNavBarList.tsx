import { FC } from "react";
import { NavLink, To } from "react-router-dom";

interface SideNavBarListProps {
  className?: string;
}

export const SideNavBarList: FC<SideNavBarListProps> = ({
  children,
  className,
}) => {
  return (
    <ul className={`flex flex-col p-3 ${className ?? ""}`}>{children}</ul>
  );
};

interface SideNavBarListItemProps {
  className?: string;
  to: To;
  onClick: () => void;
}

export const SideNavBarListItem: FC<SideNavBarListItemProps> = ({
  children,
  className,
  to,
  onClick,
}) => {
  return (
    <NavLink
      onClick={onClick}
      to={to}
      className={({ isActive }) =>
        `${
          isActive ? "border-green-600" : "border-slate-200"
        } pl-3 border-l hover:border-green-600 font-light text-lg ${className ?? ""}`
      }
    >
      {children}
    </NavLink>
  );
};
