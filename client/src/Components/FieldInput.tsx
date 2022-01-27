import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { FocusEventHandler, ChangeEventHandler, FC, ReactElement } from "react";

interface IFieldInputMessage {
  show?: boolean;
  value?: string | ReactElement | null;
}

interface FieldInputProps {
  label?: string | ReactElement;
  name?: string;
  type?: string;
  value?: any;
  validMessage?: IFieldInputMessage;
  errorMessage?: IFieldInputMessage;
  onChange?: ChangeEventHandler;
  onBlur?: FocusEventHandler;
}

export const FieldInput: FC<FieldInputProps> = ({
  label,
  name,
  value,
  type = "text",
  onChange,
  onBlur,
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
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={showPassword ? "text" : type}
          className="bg-white dark:bg-slate-800 outline-none w-full flex-auto"
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
        <div className="font-semibold text-green-500">{validMessage.value}</div>
      )}
      {errorMessage?.show && (
        <div className="font-semibold text-red-500">{errorMessage.value}</div>
      )}
    </>
  );
};
