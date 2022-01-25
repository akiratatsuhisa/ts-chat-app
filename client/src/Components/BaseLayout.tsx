import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { XIcon, MenuAlt1Icon } from "@heroicons/react/solid";
import { TopNavBarList, TopNavBarListItem } from "./TopNavBarList";
import { SideNavBarList, SideNavBarListItem } from "./SideNavBarList";
import { CogIcon } from "@heroicons/react/solid";

const SettingsComponent: FC = () => {
  return (
    <div className="mx-3 relative inline-block">
      <div className="bg-slate-300 dark:bg-slate-700 p-2 text-white rounded-full shadow-md">
        <CogIcon className="h-6 w-6"></CogIcon>
      </div>
      <div className="bg-slate-100 dark:bg-slate-500 absolute right-0 mt-1 py-3 w-60 rounded-lg shadow-md">
        <div>
          <div className=" hover:bg-slate-300 dark:hover:bg-slate-500 p-2">
            Items
          </div>
          <div className=" hover:bg-slate-300 dark:hover:bg-slate-500 p-2">
            Items
          </div>
          <hr className="bg-slate-300 my-2" />
          <div className=" hover:bg-slate-300 dark:hover:bg-slate-500 p-2">
            Items
          </div>
          <div className=" p-2">Items</div>
        </div>
      </div>
    </div>
  );
};

export const BaseLayout: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenSideBar = () => setIsOpen(true);
  const onCloseSideBar = () => setIsOpen(false);
  return (
    <div className="text-black dark:text-white min-h-screen flex flex-col">
      <div className="bg-white dark:bg-slate-900 flex items-center sticky top-0 z-40   shadow-md h-14 md:px-5 ">
        <button
          className="flex justify-center items-center w-14 h-14 md:hidden hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onOpenSideBar}
        >
          <MenuAlt1Icon className="h-5 w-5"></MenuAlt1Icon>
        </button>
        <span className="px-2 text-xl font-bold">Chat App</span>

        <TopNavBarList className="hidden md:flex">
          <TopNavBarListItem to="/">Home</TopNavBarListItem>
          <TopNavBarListItem to="/about">About</TopNavBarListItem>
          <TopNavBarListItem to="/chat">Chat Rooms</TopNavBarListItem>
        </TopNavBarList>

        <div className="flex-1"></div>

        <TopNavBarList className="hidden sm:flex">
          <TopNavBarListItem to="/login">Login</TopNavBarListItem>
          <TopNavBarListItem to="/register">Register</TopNavBarListItem>
        </TopNavBarList>
        <SettingsComponent />
      </div>

      <div
        className={`bg-black/20 backdrop-blur-sm dark:bg-slate-900/80 fixed inset-0 z-40 md:hidden ${
          isOpen ? "" : "hidden"
        }`}
      ></div>

      <div
        className={` bg-white dark:bg-slate-900  shadow-lg w-60 fixed inset-y-0 left-0 z-40 flex flex-col transform transition duration-200 ease-in-out md:-translate-x-full ${
          isOpen ? "" : "-translate-x-full"
        }`}
      >
        <div className="shadow-lg z-10 flex items-center">
          <span className="px-2 text-xl font-bold">Chat App</span>
          <button
            className="ml-auto flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={onCloseSideBar}
          >
            <XIcon className="h-5 w-5"></XIcon>
          </button>
        </div>
        <div className="bg-white dark:bg-slate-800 flex-1 overflow-y-scroll">
          <SideNavBarList>
            <SideNavBarListItem to="/" onClick={onCloseSideBar}>
              Home
            </SideNavBarListItem>
            <SideNavBarListItem to="/about" onClick={onCloseSideBar}>
              About
            </SideNavBarListItem>
            <SideNavBarListItem to="/chat" onClick={onCloseSideBar}>
              Chat Rooms
            </SideNavBarListItem>
          </SideNavBarList>
          <hr className="my-3" />
          <SideNavBarList>
            <SideNavBarListItem to="/login" onClick={onCloseSideBar}>
              Login
            </SideNavBarListItem>
            <SideNavBarListItem to="/register" onClick={onCloseSideBar}>
              Register
            </SideNavBarListItem>
          </SideNavBarList>
        </div>
        <div className="flex"></div>
      </div>

      <div className=" bg-slate-100 dark:bg-slate-800 flex-1 relative">
        <Outlet></Outlet>
      </div>
    </div>
  );
};
