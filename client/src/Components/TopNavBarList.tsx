import { FC } from "react";
import { NavLink, To } from "react-router-dom";

interface TopNavBarListProps {
  className?: string;
}

export const TopNavBarList: FC<TopNavBarListProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`h-full ${
        className ?? ""
      } `}
    >
      {children}
    </div>
  );
};

interface TopNavBarListItemProps {
  className?: string;
  to: To;
}

export const TopNavBarListItem: FC<TopNavBarListItemProps> = ({
  children,
  className,
  to,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${
          isActive ? "border-green-600" : "border-transparent"
        } flex items-center px-3 hover:bg-gray-200 dark:hover:bg-gray-700 border-b-2  hover:border-green-600 font-light text-lg ${
          className ?? ""
        }`
      }
    >
      {children}
    </NavLink>
  );
};
