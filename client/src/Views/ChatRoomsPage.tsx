import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiInstance, IChatRoom } from "../Services/Api.service";

interface ChatRoomsPageProps {}

export const ChatRoomsPage: FC<ChatRoomsPageProps> = () => {
  const [rooms, setRooms] = useState<IChatRoom[]>([]);

  const renderItems = [...Array(20)].map((_, index) => (
    <div
      key={index}
      className="bg-white dark:bg-slate-900 border-r-4 border-cyan-400 p-3 shadow-md rounded-md"
    >
      <h3>
        <Link
          to={`/chat/${index + 1}`}
          className="text-lg font-semibold hover:text-cyan-500"
        >
          Room - long name
        </Link>
      </h3>
      <div className="-space-x-2">
        <span className="bg-red-500  inline-block h-8 w-8  border-2 border-white dark:border-slate-900 rounded-full"></span>
        <span className="bg-green-500 inline-block h-8 w-8   border-2 border-white dark:border-slate-900 rounded-full"></span>
        <span className="bg-blue-500  inline-block h-8 w-8  border-2 border-white dark:border-slate-900 rounded-full"></span>
        <span className="bg-yellow-500 inline-block h-8 w-8   border-2 border-white dark:border-slate-900 rounded-full"></span>
      </div>
      <div>
        <Link
          className="border-teal-500 hover:bg-teal-500 inline-block  border-2 px-4 py-1 rounded-full"
          to={`/chat/${index + 1}`}
        >
          Join
        </Link>
      </div>
    </div>
  ));
  return (
    <div className="container mx-auto p-2 md:p-3">
      <div className=" my-6 flex flex-row flex-wrap items-center">
        <h1 className="text-4xl font-medium">Room List</h1>
        <button className="ml-auto px-3 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white">
          New Room
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{renderItems}</div>
      <div className="mt-8 text-center">
        <button className="bg-cyan-400/50 hover:bg-cyan-400/80 outline-none rounded-xl px-4 py-2 font-semibold">
          Fetch more
        </button>
      </div>
    </div>
  );
};
