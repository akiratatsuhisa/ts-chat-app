import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChatAlt2Icon,
  InformationCircleIcon,
  ArrowLeftIcon,
  ReplyIcon,
  XIcon,
} from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import { apiInstance, apiUrl, IChatRoom } from "../Services/Api.service";
import { useAuth } from "../Contexts/AuthContext";
import { Modal } from "../Components/Modal";

interface ChatRoomPageProps {}

export const ChatRoomPage: FC<ChatRoomPageProps> = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { socket } = useAuth();
  const { id } = useParams();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [room, setRoom] = useState<IChatRoom>();
  const [message, setMessage] = useState<string>("");

  const onOpenSideBar = () => setIsOpen(true);
  const onCloseSideBar = () => setIsOpen(false);

  const fetch = async (): Promise<void> => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const result = await apiInstance.get<IChatRoom>(`/chatRooms/${id}`);

      const { data } = result;

      setRoom(data);
    } catch (error: any) {
      console.log(error?.response);
    } finally {
      setIsFetching(false);
    }
  };

  const sendMessage = () => {};

  const evictMessage = (messageId: string) => {};

  useEffect(() => {
    socket?.on("", () => {});
    socket?.on("", () => {});

    return () => {
      socket?.off("");
      socket?.off("");
    };
  }, [socket]);

  useEffect(() => {
    fetch();
  }, [id]);

  const renderList = [...new Array(30)].map((_, index) => {
    const random = Math.floor(Math.random() * (100 - 4)) + 4;
    const mine = random % 2 === 0;
    return (
      <div
        className={`p-2 w-full flex ${mine ? "flex-row" : "flex-row-reverse"}`}
        key={index}
      >
        <div className={`w-40 md:w-80 ${mine ? "mr-auto" : "ml-auto"}`}></div>
        <div className="px-3 py-2 bg-white dark:bg-slate-800 rounded-2xl">
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
          <h1 className="px-2 text-xl font-bold">Room - {room?.name}</h1>
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
          <div className="border-2 border-cyan-500 flex-auto flex  py-1 px-3 rounded-xl">
            <input
              type="text"
              className="w-full flex-auto outline-none bg-transparent"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {message && (
              <button className="p-1" onClick={() => setMessage("")}>
                <XIcon className="h-4 w-4 text-slate-500" />
              </button>
            )}
          </div>
          <button className="hover:bg-slate-300 dark:hover:bg-slate-700 p-2 ml-2 rounded-full ">
            <ReplyIcon className="h-5 w-5 text-cyan-500" />
          </button>
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
          <h1 className="px-2 text-xl font-bold">Room - {room?.name}</h1>
          <button
            className="flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 w-14 h-14 transform"
            onClick={() => navigate("/chat")}
          >
            <ChatAlt2Icon className="h-6 w-6 text-slate-400"></ChatAlt2Icon>
          </button>
        </div>
        <div className="relative flex-auto">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="flex p-3">
              <h2 className="text-2xl font-semibold">Users</h2>
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md font-semibold ml-auto">
                Add Users
              </button>
            </div>
            <div className="p-3 space-y-3">
              {room?.users?.map((user) => (
                <div key={user._id} className="flex items-center">
                  <img
                    className="block h-8 w-8 shadow-lg rounded-full object-cover object-center"
                    src={new URL(user.avatarUrl, apiUrl).toString()}
                    alt={user.displayName}
                  />
                  <div className="flex-auto mx-2">{user.displayName}</div>
                  <button className="group hover:bg-red-500 p-2 rounded-full border border-red-500">
                    <TrashIcon className="h-4 w-4 text-red-500 group-hover:text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 mt-auto">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow-md font-semibold">
            Leave
          </button>
          <button className="bg-red-500  hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md font-semibold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
