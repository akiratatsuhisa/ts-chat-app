import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { HTMLProps, useState } from "react";
import { FC, ReactElement } from "react";
import { IUser } from "../Services/Api.service";
import { IInputMessage } from "./Input";

interface AutocompleteInputProps {
  selected?: any[];
  onSelectedChange?: (value: any[]) => void;
  label?: string | ReactElement;
  type?: string;
  validMessage?: IInputMessage;
  errorMessage?: IInputMessage;
}

export const AutocompleteInput: FC<
  AutocompleteInputProps & HTMLProps<HTMLInputElement>
> = ({
  selected,
  onSelectedChange,
  label,
  type = "text",
  validMessage,
  errorMessage,
  ...props
}) => {
  const fakeSelectedItems: IUser[] = [
    {
      _id: "1",
      username: "username 1",
      displayName: "hello world 1",
      avatarUrl: "https://picsum.photos/61/60",
    },
    {
      _id: "2",
      username: "username 2",
      displayName: "hello world 2",
      avatarUrl: "https://picsum.photos/62/60",
    },
    {
      _id: "3",
      username: "username 3",
      displayName: "hello world 3",
      avatarUrl: "https://picsum.photos/63/60",
    },
    {
      _id: "4",
      username: "username 4",
      displayName: "hello world 4",
      avatarUrl: "https://picsum.photos/64/60",
    },
  ];

  return (
    <>
      {label && <label className="block mb-2 font-light">{label}</label>}
      <div className="relative mb-2">
        <div
          className={`bg-white dark:bg-slate-800 text-black dark:text-white flex flex-row flex-wrap items-center
        p-1 rounded-lg border-2 ${
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
          {fakeSelectedItems.map((item) => (
            <span
              key={item._id}
              className="bg-cyan-400 text-white px-2 rounded-3xl inline-flex items-center m-1 space-x-1"
            >
              <img
                className="h-5 w-5 rounded-full object-cover object-center"
                src={item.avatarUrl}
                alt=""
              />
              <span>{item.displayName}</span>
              <button className="hover:bg-cyan-500 p-1 rounded-full">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            {...props}
            type={type}
            className="inline-block bg-transparent outline-none flex-auto p-1"
          />
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 absolute inset-x-0 z-10 py-3 shadow-xl rounded-lg">
          <div></div>
        </div>
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
