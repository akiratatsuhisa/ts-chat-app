import { XIcon } from "@heroicons/react/solid";
import { isValidElement, FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  title?: any;
  footer?: any;
  show?: boolean;
  onHide?: () => void;
}

export const Modal: FC<ModalProps> = ({
  title = "Modal",
  footer,
  show = true,
  children,
  onHide,
}) => {
  const [container] = useState(document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const render = (
    <div
      className={`${
        show ? "block" : "hidden"
      } fixed inset-0 backdrop-blur-sm bg-slate-500/60 z-50 p-3 flex flex-col items-center overflow-y-auto`}
    >
      <div className="bg-white dark:bg-slate-900 text-black dark:text-white relative w-full md:w-2/3  rounded-lg shadow-xl flex flex-col">
        <div className="p-2 px-4 flex items-center shadow-lg">
          <div className="flex-auto">
            {isValidElement(title) ? (
              title
            ) : (
              <h3 className="text-xl font-semibold">{title}</h3>
            )}
          </div>
          <button
            className="hover:bg-slate-300 text-slate-500 rounded-full p-2"
            onClick={() => onHide?.()}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-auto">{children}</div>
        {footer ? (
          isValidElement(footer) ? (
            { footer }
          ) : (
            <div className="p-2 px-4 text-xl font-semibold">{footer}</div>
          )
        ) : null}
      </div>
    </div>
  );

  if (!show) return null;
  return ReactDOM.createPortal(render, container);
};
