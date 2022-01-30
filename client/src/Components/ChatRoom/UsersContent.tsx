import { DotsVerticalIcon, TrashIcon } from "@heroicons/react/solid";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { IUser } from "../../Services/Api.service";
import { AutocompleteInput } from "../AutocompleteInput";
import { Modal } from "../Modal";

interface UsersContentProps {
  users: IUser[] | undefined;
}

export const UsersContent: FC<UsersContentProps> = ({ users }) => {
  const [show, setShow] = useState<boolean>(false);
  const { socket } = useAuth();
  const { id } = useParams();

  const removeUser = (userId: string) => {
    socket?.emit("updateUsers", {
      chatRoomId: id,
      users: [userId],
      type: "remove",
    });
  };

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
          <div className="p-3">
            {/*Uncompleted */}
            <AutocompleteInput></AutocompleteInput>
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
