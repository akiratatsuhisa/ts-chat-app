import { FC } from "react";
import { useAuth } from "../Contexts/AuthContext";

export const ProfilePage: FC = () => {
  const { currentUser } = useAuth();
  return (
    <div
      className="h-full flex flex-col justify-center  items-center  bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/1920/1079')" }}
    >
      <div className="absolute inset-0 bg-slate-500/70 dark:bg-slate-600/70"></div>
      <div className="relative p-3 w-full lg:w-2/5 md:w-2/3 mx-auto">
        <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg mt-20">
          <div className="flex flex-row flex-wrap justify-center px-2">
            <div className="-mt-20">
              <img
                className="block object-cover object-center h-40 w-40 rounded-full shadow-lg"
                src={currentUser?.avatarUrl}
                alt="..."
              />
            </div>
          </div>
          <div className="p-3">
            <div className="text-center">
              <h1 className="text-lg font-normal text-slate-400">Profile</h1>
              <h2 className="text-2xl font-medium">
                {currentUser?.displayName}
              </h2>
              <h3 className="text-lg font-extralight">
                username:{" "}
                <span className="font-normal">- {currentUser?.username} -</span>
              </h3>
              {currentUser?.email && (
                <h3 className="text-lg font-extralight">
                  email:{" "}
                  <span className="font-normal"> - {currentUser?.email} -</span>
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
