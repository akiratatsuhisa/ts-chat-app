import {
  DotsVerticalIcon,
  ReplyIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid";
import { uniqBy } from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { apiInstance, IChatMessage, IUser } from "../../Services/Api.service";

interface MessagesContentProps {
  users: {
    [key: string]: IUser;
  };
}

export const MessagesContent: FC<MessagesContentProps> = ({ users }) => {
  const { socket, currentUser } = useAuth();
  const { id } = useParams();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = async (reset: boolean = false): Promise<void> => {
    if (isFetching) return;
    setIsFetching(true);
    const cursor = reset ? "" : messages[0]?._id ?? "";
    try {
      const result = await apiInstance.get<IChatMessage[]>(
        `/chatRooms/${id}/messages`,
        {
          params: {
            cursor,
          },
        }
      );

      const { data } = result;
      const oldMessage = data.reverse();
      setMessages((prevMessages) =>
        reset
          ? oldMessage
          : uniqBy([...oldMessage, ...prevMessages], (x) => x._id)
      );
    } catch (error: any) {
      console.log(error?.response);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetch(true);
  }, []);

  useEffect(() => {
    const paramId = id;
    socket?.on(
      "receiveMessage",
      ({
        id,
        chatRoomId,
        userId,
        content,
        createdAt,
      }: {
        id: string;
        chatRoomId: string;
        userId: string;
        content: string;
        createdAt: string;
      }) => {
        if (chatRoomId !== paramId) return;
        const newMessage = {
          _id: id,
          chatRoom_id: chatRoomId,
          user_id: userId,
          content,
          createdAt: new Date(createdAt),
        } as IChatMessage;
        setMessages((prevMessages) =>
          uniqBy([...prevMessages, newMessage], (x) => x._id)
        );
      }
    );
    socket?.on(
      "admitMessage",
      ({ id, chatRoomId }: { id: string; chatRoomId: string }) => {
        if (chatRoomId !== paramId) return;
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== id)
        );
      }
    );
    return () => {
      socket?.off("receiveMessage");
      socket?.off("admitMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    socket?.emit("sendMessage", { chatRoomId: id, content: message });
    setMessage("");
  };

  const evictMessage = (messageId: string) => {
    socket?.emit("evictMessage", { chatMessageId: messageId });
  };

  const renderItems = messages.map(({ _id, content, user_id, createdAt }) => {
    const isCurrentUserMessage = currentUser?.id === user_id;
    const date = new Date(createdAt as Date);
    const user = users[user_id as string];
    return (
      <div key={_id} className="flex flex-col">
        <div
          className={`p-2 w-full flex ${
            isCurrentUserMessage ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <div
            className={`w-12 md:w-24 lg:w-32 shrink-0 ${
              isCurrentUserMessage ? "mr-auto" : "ml-auto"
            }`}
          ></div>
          {isCurrentUserMessage && (
            <div className="group relative m-1 shrink-0">
              <button className="hover:bg-slate-300 dark:hover:bg-slate-600 p-2 rounded-full">
                <DotsVerticalIcon className="h-4 w-4 text-slate-600 dark:text-white" />
              </button>
              <div className="bg-slate-50 dark:bg-slate-800 absolute z-20 right-0 py-3 rounded-lg shadow-lg hidden group-hover:block">
                <div
                  className=" hover:bg-slate-300 dark:hover:bg-slate-900 cursor-pointer"
                  onClick={() => evictMessage(_id)}
                >
                  <div className=" flex items-center p-2">
                    <div className=" bg-slate-400 dark:bg-slate-700 text-white p-2 rounded-full">
                      <TrashIcon className="h-4 w-4" />
                    </div>
                    <span className="flex-auto ml-2 font-semibold">Delete</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <span className="px-4 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center ">
            {content}
          </span>
          <div className="m-1 shrink-0">
            <img
              className="block h-8 w-8 rounded-full shadow-lg"
              src={user?.avatarUrl}
              alt={user?.displayName}
            />
          </div>
        </div>
        <div
          className={`${
            isCurrentUserMessage ? "text-right" : "text-left"
          } font-mono text-xs pb-1 px-2`}
        >
          <span>{date.toLocaleString()}</span>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="flex-auto relative overflow-x-hidden overflow-y-auto">
        <div className="absolute inset-0 p-3">
          <div className="text-center">
            {isFetching ? (
              <span className=" inline-block h-8 w-8 rounded-full border-4  border-slate-300/60 border-l-white animate-spin"></span>
            ) : (
              <button
                disabled={isFetching}
                className="bg-cyan-400 disabled:bg-cyan-300 hover:bg-cyan-500 text-white outline-none rounded-xl px-4 py-2 font-semibold"
                onClick={() => fetch()}
              >
                Fetch more
              </button>
            )}
          </div>
          {renderItems}
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 shadow-lg flex items-center p-2">
        <div className="border-2 border-cyan-500 flex-auto flex  py-1 px-3 rounded-xl">
          <input
            type="text"
            className="w-full flex-auto outline-none bg-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          />
          {message && (
            <button className="p-1" onClick={() => setMessage("")}>
              <XIcon className="h-4 w-4 text-slate-500" />
            </button>
          )}
        </div>
        <button
          className="hover:bg-slate-300 dark:hover:bg-slate-700 p-2 ml-2 rounded-full"
          onClick={() => sendMessage()}
        >
          <ReplyIcon className="h-5 w-5 text-cyan-500" />
        </button>
      </div>
    </>
  );
};
