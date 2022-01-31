import {
  CheckIcon,
  DotsVerticalIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/solid";
import { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { debounce, uniqBy } from "lodash";
import { useAuth } from "../../Contexts/AuthContext";
import { apiInstance, apiUrl, IUser } from "../../Services/Api.service";
import { Input } from "../Input";
import { Modal } from "../Modal";

interface UsersContentProps {
  users: IUser[] | undefined;
}

export const UsersContent: FC<UsersContentProps> = ({ users }) => {
  const { id } = useParams();
  const { socket } = useAuth();
  const [show, setShow] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [items, setItems] = useState<IUser[]>([]);
  const [search, setSearch] = useState<string>("");

  const removeUser = (userId: string) => {
    socket?.emit("updateUsers", {
      chatRoomId: id,
      users: [userId],
      type: "remove",
    });
  };

  const addUser = (users: IUser[]) => {
    if (!users.length) return;
    setSearch("");
    setItems([]);
    setSelectedUsers([]);
    socket?.emit("updateUsers", {
      chatRoomId: id,
      users: users.map((u) => u._id),
      type: "add",
    });
    setShow(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceCallSearchApi = useCallback(
    debounce(async (search: string) => {
      try {
        const { data } = await apiInstance.get<IUser[]>("/users", {
          params: {
            search,
          },
        });
        const items = data.map((user) => {
          user.avatarUrl = new URL(user.avatarUrl, apiUrl).toString();
          return user;
        });
        setItems(items);
      } catch (e: any) {
        console.error(e);
      }
      setIsLoading(false);
    }, 2000),
    []
  );

  const handleSelectUser = (user: IUser) => {
    setSelectedUsers((prevUser) => uniqBy([user, ...prevUser], (u) => u._id));
    setItems((prevUser) => prevUser.filter((u) => u._id !== user._id));
  };

  const handleUnselectUser = (user: IUser) => {
    setSelectedUsers((prevUser) => prevUser.filter((u) => u._id !== user._id));
    setItems((prevUser) => uniqBy([user, ...prevUser], (u) => u._id));
  };

  const handleSearch = (search: string) => {
    setIsLoading(true);
    if (!search) {
      debounceCallSearchApi.cancel();
      setIsLoading(false);
      return;
    }
    debounceCallSearchApi(search);
  };

  useEffect(() => {
    return () => {
      debounceCallSearchApi.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex p-3">
        <h2 className="text-2xl font-semibold">Users</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md font-semibold ml-auto"
          onClick={() => setShow(true)}
        >
          Add Users
        </button>
        <Modal show={show} onHide={() => setShow(false)} title="Add new users">
          <div className="p-3 lg:w-2/3 lg:mx-auto">
            <Input
              label="Find user"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                const { value } = e.target;
                setSearch(value);
                handleSearch(value);
              }}
            ></Input>
            <h3 className="text-2xl p-2">Selected users</h3>
            <div className="max-h-44 overflow-y-auto mb-3">
              {!selectedUsers.length ? (
                <div className="text-center p-2">
                  <span className="font-mono text-slate-500">-unselected-</span>
                </div>
              ) : (
                selectedUsers.map((item) => (
                  <div key={item._id} className="flex items-center p-1">
                    <img
                      className="block h-8 w-8 shadow-lg rounded-full object-cover object-center"
                      src={item.avatarUrl}
                      alt="..."
                    />
                    <div className="flex-auto mx-2">{item.displayName}</div>
                    <button
                      className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-500 p-2 rounded-full"
                      onClick={() => handleUnselectUser(item)}
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <h3 className="text-2xl p-2">Search result</h3>
            <div className="max-h-44 overflow-y-auto mb-3">
              {isLoading ? (
                <div className="text-center p-2">
                  <span className=" inline-block h-6 w-6 rounded-full border-2  border-slate-300/60 border-l-cyan-500 animate-spin"></span>
                </div>
              ) : !items.length ? (
                <div className="text-center p-2">
                  <span className="font-mono text-slate-500">-no result-</span>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="flex items-center p-1">
                    <img
                      className="block h-8 w-8 shadow-lg rounded-full object-cover object-center"
                      src={item.avatarUrl}
                      alt="..."
                    />
                    <div className="flex-auto mx-2">{item.displayName}</div>
                    <button
                      className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-500 p-2 rounded-full"
                      onClick={() => handleSelectUser(item)}
                    >
                      <CheckIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="grid">
              <button
                className="bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
                onClick={() => addUser(selectedUsers)}
              >
                Add Users
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="p-3 space-y-3">
        {users?.map((user) => (
          <div key={user._id} className="flex items-center">
            <img
              className="block h-8 w-8 shadow-lg rounded-full object-cover object-center"
              src={user.avatarUrl}
              alt={user.displayName}
            />
            <div className="flex-auto mx-2">{user.displayName}</div>
            <div className="group relative">
              <button className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-500 dark:hover:bg-slate-500 p-2 rounded-full ">
                <DotsVerticalIcon className="h-4 w-4 text-white" />
              </button>
              <div className="bg-slate-50 dark:bg-slate-800 absolute right-0 z-20 py-3 w-60 rounded-lg shadow-lg hidden group-hover:block">
                <div
                  className=" hover:bg-slate-300 dark:hover:bg-slate-900 cursor-pointer"
                  onClick={() => removeUser(user._id)}
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
          </div>
        ))}
      </div>
    </>
  );
};
