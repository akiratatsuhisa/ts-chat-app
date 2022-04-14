import { FC, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { uniqBy } from "lodash";
import { useAuth } from "../Contexts/AuthContext";
import { apiInstance, apiUrl, IChatRoom } from "../Services/Api.service";
import { CreateRoomContent } from "../Components/ChatRoom/CreateRoomContent";

interface ChatRoomsPageProps {}

export const ChatRoomsPage: FC<ChatRoomsPageProps> = () => {
  const { currentUser } = useAuth();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const mountedRef = useRef(true);

  const fetch = async (reset: boolean = false): Promise<void> => {
    if (isFetching) return;
    setIsFetching(true);
    const cursor = reset ? "" : rooms[rooms.length - 1]?._id ?? "";
    try {
      const result = await apiInstance.get<IChatRoom[]>("/chatRooms", {
        params: {
          size: 12,
          cursor,
        },
      });

      const { data } = result;

      if (!mountedRef.current) return;
      setRooms((prevRooms) =>
        reset ? data : uniqBy([...prevRooms, ...data], (room) => room._id)
      );
    } catch (error: any) {
      console.error(error?.response);
    }

    setTimeout(() => {
      if (!mountedRef.current) return;
      setIsFetching(false);
    }, 1000);
  };

  useEffect(() => {
    fetch(true);

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItems = rooms.map(
    ({ _id, name, users, createdAt, updatedAt }) => (
      <div
        key={_id}
        className="bg-white dark:bg-slate-900 flex flex-col border-r-4 border-cyan-400 hover:border-teal-400 p-3 shadow-md hover:shadow-lg rounded-md transition-all hover:scale-95 md:hover:scale-105 duration-200 ease-in-out "
      >
        <h3 className="text-lg hover:text-cyan-500">
          <span className="text-slate-600 dark:text-slate-300  font-thin">
            Room:{" "}
          </span>
          <span className="font-semibold">{name}</span>
        </h3>
        <div className="-space-x-2 flex-auto">
          {users?.map((user) => (
            <div key={user._id} className="inline-block ">
              <img
                className="block border-2 h-10 w-10 rounded-full border-white dark:border-slate-900"
                src={new URL(user.avatarUrl, apiUrl).toString()}
                alt={user.username}
              />
            </div>
          ))}
        </div>
        <div className="mt-2">
          {users?.find((u) => u._id === currentUser?.id) && (
            <Link
              className="text-teal-500 hover:text-white border-teal-500 hover:bg-teal-500 inline-block text-sm border-2 px-4 py-1 rounded-full"
              to={`/chat/${_id}`}
            >
              OPEN
            </Link>
          )}
        </div>
      </div>
    )
  );

  return (
    <div className="container mx-auto p-2 md:p-3">
      <div className=" my-6 flex flex-row flex-wrap items-center">
        <h1 className="text-4xl font-medium">Room List</h1>
        <div className="ml-auto grid grid-cols-2 gap-2">
          <button
            className="bg-cyan-400 hover:bg-cyan-500 text-white px-3 rounded-full"
            onClick={() => fetch(true)}
          >
            {isFetching ? (
              <span className=" inline-block h-6 w-6 rounded-full border-2  border-slate-300/60 border-l-white animate-spin"></span>
            ) : (
              "Reset"
            )}
          </button>
          <CreateRoomContent></CreateRoomContent>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {renderItems}
      </div>
      <div className="mt-8 text-center">
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
    </div>
  );
};
