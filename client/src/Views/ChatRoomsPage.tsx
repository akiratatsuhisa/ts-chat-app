import { FC } from "react";
import { Link } from "react-router-dom";

interface ChatRoomsPageProps {}

export const ChatRoomsPage: FC<ChatRoomsPageProps> = () => {
  const renderItems = [...Array(20)].map((_, index) => (
    <div
      key={index}
      className="bg-white dark:bg-slate-900 border-r-4 border-cyan-400 p-3 shadow-md rounded-md"
    >
      <Link
        to={`/chat/${index + 1}`}
        className="text-lg font-mono font-semibold hover:text-cyan-500"
      >
        Room - {index + 1}
      </Link>
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
    </div>
  );
};
