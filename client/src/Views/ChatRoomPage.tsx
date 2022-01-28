import {
  ChatAlt2Icon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid";
import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ChatRoomPageProps {}

export const ChatRoomPage: FC<ChatRoomPageProps> = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpenSideBar = () => setIsOpen(true);
  const onCloseSideBar = () => setIsOpen(false);

  const renderList = [...new Array(30)].map((_, index) => {
    const random = Math.floor(Math.random() * (100 - 4)) + 4;
    const mine = random % 2 === 0;
    return (
      <div
        className={`p-2 w-full flex ${mine ? "flex-row" : "flex-row-reverse"}`}
      >
        <div className={`w-40 md:w-80 ${mine ? "mr-auto" : "ml-auto"}`}></div>
        <div
          className="px-3 py-2 bg-white dark:bg-slate-800 rounded-2xl"
          key={index}
        >
          <span>
            {` Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
          quod vel sequi dolores! Repellendus ducimus libero ratione molestiae
          reiciendis nemo voluptatem recusandae sint magnam necessitatibus!
          Earum modi repudiandae ex accusantium!`.slice(0, random)}
          </span>
        </div>
        <div className="m-2">
          <div
            className={`h-6 w-6 rounded-full ${
              mine ? "bg-green-500" : "bg-blue-500"
            }  shadow-md`}
          ></div>
        </div>
      </div>
    );
  });

  return (
    <div className="h-full relative flex flex-row felx-nowrap">
      <div className="dark:bg-slate-700 flex-1 flex flex-col">
        <div className="bg-white dark:bg-slate-800 h-14 shadow-lg flex items-center z-10">
          <h1 className="px-2 text-xl font-bold">Room - long name</h1>
          <button
            className="ml-auto flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={() => (isOpen ? onCloseSideBar() : onOpenSideBar())}
          >
            <InformationCircleIcon className="h-6 w-6 text-slate-400"></InformationCircleIcon>
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
        className={`bg-white dark:bg-slate-800 flex flex-col md:w-80 shadow-lg absolute inset-0 z-10 md:static ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="shadow-lg h-14 flex items-center justify-between">
          <button
            className="flex md:hidden justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={onCloseSideBar}
          >
            <ArrowLeftIcon className="h-6 w-6 text-slate-400"></ArrowLeftIcon>
          </button>
          <h1 className="px-2 text-xl font-bold">Room - long name</h1>
          <button
            className="flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={() => navigate("/chat")}
          >
            <ChatAlt2Icon className="h-6 w-6 text-slate-400"></ChatAlt2Icon>
          </button>
        </div>
        <div className="p-3 flex-auto">
          <h2 className="text-2xl font-semibold">Users</h2>
          <div>
            <div className="p-2 flex items-center">
              <div className="bg-red-500 inline-block h-8 w-8 rounded-full"></div>
              <div className="flex-auto mx-2">Username</div>
            </div>
            <div className="p-2 flex items-center">
              <div className="bg-green-500 inline-block h-8 w-8 rounded-full"></div>
              <div className="flex-auto mx-2">Username</div>
            </div>
            <div className="p-2 flex items-center">
              <div className="bg-blue-500 inline-block h-8 w-8 rounded-full"></div>
              <div className="flex-auto mx-2">Username</div>
            </div>
            <div className="p-2 flex items-center">
              <div className="bg-yellow-500 inline-block h-8 w-8 rounded-full"></div>
              <div className="flex-auto mx-2">Username</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mt-auto">
          <button className="bg-yellow-500 px-4 py-2 rounded-full shadow-md font-semibold">
            Leave
          </button>
          <button className="bg-red-500  px-4 py-2 rounded-full shadow-md font-semibold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
