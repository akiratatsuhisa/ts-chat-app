import { XIcon } from "@heroicons/react/solid";
import { FC, useEffect, useState } from "react";

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

interface AlertProps {
  title?: string;
  color?: string;
  show?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

export const Alert: FC<AlertProps> = ({
  title = "Alert",
  color = "green",
  show = true,
  closable = false,
  onClose,
  children,
}) => {
  const [isShow, setIsShow] = useState<boolean>(show);
  let colorClasses = getColorClasses(color);

  return (
    <div
      className={`${
        isShow ? "" : "hidden"
      } ${colorClasses} bg border-l-4 mb-2 p-2 rounded-lg`}
    >
      <div className="font-bold flex flex-row flex-nowrap">
        <div className="flex-auto">{title}</div>
        {closable && (
          <div>
            <button
              onClick={() => {
                setIsShow(false);
                onClose?.();
              }}
            >
              <XIcon className="h-5 w-5"></XIcon>
            </button>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};
