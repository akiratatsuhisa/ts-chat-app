import { FC } from "react";

interface ChatRoomsPageProps {}

export const ChatRoomsPage: FC<ChatRoomsPageProps> = () => {
  return (
    <div className="container mx-auto p-2 md:p-3">
      <div className=" my-6 flex flex-row flex-wrap items-center">
        <h1 className="text-4xl font-medium">Room List</h1>
        <button className="ml-auto px-3 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white">
          New Room
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
        <div className="h-40 bg-white dark:bg-slate-900 shadow-md rounded-md"></div>
      </div>
    </div>
  );
};
