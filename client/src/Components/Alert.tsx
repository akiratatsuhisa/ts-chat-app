import { FC } from "react";

interface AlertProps {
  title?: string;
  color?: string;
}

function getColorClasses(color: string) {
  switch (color) {
    case "red":
      return "bg-red-500/50 border-red-500 ";
    case "blue":
      return "bg-blue-500/50 border-blue-500 ";
    case "yellow":
      return "bg-yellow-500/50 border-yellow-500 ";
    case "purple":
      return "bg-purple-500/50 border-purple-500 ";
    case "pink":
      return "bg-pink-500/50 border-pink-500 ";
    case "green":
    default:
      return "bg-green-500/50 border-green-500 ";
  }
}

export const Alert: FC<AlertProps> = ({ title, color = "green", children }) => {
  let colorClasses = getColorClasses(color);

  return (
    <div className={`${colorClasses} bg border-l-4 mb-2 p-2 rounded-lg`}>
      {title && <div className="font-bold">{title}</div>}
      {children}
    </div>
  );
};
