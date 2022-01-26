import {
  ChatAlt2Icon,
  InformationCircleIcon,
  XIcon,
} from "@heroicons/react/solid";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

interface ChatRoomPageProps {}

export const ChatRoomPage: FC<ChatRoomPageProps> = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const onOpenSideBar = () => setIsOpen(true);
  const onCloseSideBar = () => setIsOpen(false);

  const renderList = [...new Array(30)].map((_, index) => (
    <div
      className={`m-2 flex ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className="w-40 md:w-80"></div>
      <div
        className="px-3 py-2 bg-white dark:bg-slate-800 rounded-2xl"
        key={index}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque quod
        vel sequi dolores! Repellendus ducimus libero ratione molestiae
        reiciendis nemo voluptatem recusandae sint magnam necessitatibus! Earum
        modi repudiandae ex accusantium!
      </div>
      <div className="m-3">
        <div className="h-8 w-8 rounded-full bg-green-600 shadow-md"></div>
      </div>
    </div>
  ));

  return (
    <div className="h-full relative flex flex-row felx-nowrap">
      <div className="dark:bg-slate-700 flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-800 shadow-lg flex items-center">
          <span className="px-2 text-xl font-bold">Room - {id}</span>
          <button
            className="ml-auto flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={onOpenSideBar}
          >
            <InformationCircleIcon className="h-5 w-5"></InformationCircleIcon>
          </button>
        </div>

        <div className="flex-auto relative overflow-y-auto">
          <div className="absolute inset-0 p-3">{renderList}</div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-lg flex items-center p-2">
          <div className="flex flex-nowrap w-full md:mx-4">
            <input className="dark:bg-slate-600 flex-auto outline-none p-2 pl-4 rounded-l-full border-2 border-cyan-500 focus:border-cyan-600 hover:border-cyan-600" />
            <button className="bg-cyan-500 focus:bg-cyan-600 hover:bg-cyan-600 text-white py-2 px-4  rounded-r-full">
              Send
            </button>
          </div>
        </div>
      </div>
      <div
        className={`bg-white dark:bg-slate-800 md:w-80 shadow-lg absolute md:static ${
          isOpen ? "block" : "hidden"
        }  inset-0`}
      >
        <div className="shadow-lg flex items-center justify-between">
          <button
            className="flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={onCloseSideBar}
          >
            <ChatAlt2Icon className="h-5 w-5"></ChatAlt2Icon>
          </button>
          <span className="px-2 text-xl font-bold">Room - {id}</span>
          <button
            className="flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={onCloseSideBar}
          >
            <XIcon className="h-5 w-5"></XIcon>
          </button>
        </div>
      </div>
    </div>
  );
};
