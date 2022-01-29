import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { HTMLProps, useState } from "react";
import { FC, ReactElement } from "react";

interface IInputMessage {
  show?: boolean;
  value?: string | ReactElement | null;
}

interface InputProps {
  label?: string | ReactElement;
  type?: string;
  validMessage?: IInputMessage;
  errorMessage?: IInputMessage;
}

export const Input: FC<InputProps & HTMLProps<HTMLInputElement>> = ({
  label,
  type = "text",
  validMessage,
  errorMessage,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <>
      {label && <label className="block mb-2 font-light">{label}</label>}
      <div
        className={`bg-white dark:bg-slate-800 text-black dark:text-white flex flex-row
        p-2 mb-2 space-x-2 rounded-lg border-2 ${
          errorMessage?.show
            ? "border-red-500"
            : validMessage?.show
            ? "border-green-500"
            : "border-slate-300 dark:border-slate-700"
        } focus-within:border-cyan-500 dark:focus-within:border-cyan-500 hover:border-cyan-500 dark:hover:border-cyan-500`}
      >
        {validMessage?.show && (
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
        )}
        {errorMessage?.show && (
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
        )}
        <input
          {...props}
          type={showPassword ? "text" : type}
          className="bg-transparent outline-none w-full flex-auto"
        />
        {type === "password" ? (
          <div className="z-10">
            {showPassword ? (
              <EyeOffIcon
                className="h-6 w-6 text-slate-500 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeIcon
                className="h-6 w-6 text-slate-500 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        ) : null}
      </div>
      {validMessage?.show && (
        <div className="font-thin text-green-500">{validMessage.value}</div>
      )}
      {errorMessage?.show && (
        <div className="font-thin text-red-500">{errorMessage.value}</div>
      )}
    </>
  );
};