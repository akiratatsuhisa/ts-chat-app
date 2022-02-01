import { FC, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChatAlt2Icon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid";
import { apiInstance, apiUrl, IChatRoom } from "../Services/Api.service";
import { useAuth } from "../Contexts/AuthContext";
import { MessagesContent } from "../Components/ChatRoom/MessagesContent";
import { UpdateRoomContent } from "../Components/ChatRoom/UpdateRoomContent";
import { UsersContent } from "../Components/ChatRoom/UsersContent";
import { DeleteRoomContent } from "../Components/ChatRoom/DeleteRoomContent";
interface ChatRoomPageProps {}

export const ChatRoomPage: FC<ChatRoomPageProps> = () => {
  const navigate = useNavigate();
  const { socket } = useAuth();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [room, setRoom] = useState<IChatRoom>();
  const mountedRef = useRef(true);

  const onOpenSideBar = () => setIsOpen(true);
  const onCloseSideBar = () => setIsOpen(false);

  const fetch = async (): Promise<void> => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const result = await apiInstance.get<IChatRoom>(`/chatRooms/${id}`);

      const { data } = result;
      data.users = data.users?.map((user) => {
        user.avatarUrl = new URL(user.avatarUrl, apiUrl).toString();
        return user;
      });

      if (!mountedRef.current) return;
      setRoom(data);
    } catch (error: any) {
      console.log(error?.response);
    } finally {
      if (!mountedRef.current) return;
      setIsFetching(false);
    }
  };

  useEffect(() => {
    socket?.emit("joinRoom", { chatRoomId: id });

    const modifyUsersListener = ({
      chatRoomId,
      users,
    }: {
      chatRoomId: string;
      users: any[];
    }) => {
      if (chatRoomId !== id) return;
      const clone: IChatRoom = { ...(room as IChatRoom) };
      clone.users = users?.map((user) => {
        user.avatarUrl = new URL(user.avatarUrl, apiUrl).toString();
        return user;
      });
      setRoom(clone);
    };
   
    socket?.on("modifyUsers", modifyUsersListener);

    return () => {
      socket?.emit("leaveRoom", { chatRoomId: id });
      socket?.off("modifyUsers", modifyUsersListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    fetch();

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

        <MessagesContent />
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
            <UsersContent users={room?.users}></UsersContent>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 mt-auto">
          <UpdateRoomContent
            id={id as string}
            onUpdate={(data) => {
              data.users = room?.users;
              setRoom(data);
            }}
          ></UpdateRoomContent>
          <DeleteRoomContent id={id as string}></DeleteRoomContent>
        </div>
      </div>
    </div>
  );
};
