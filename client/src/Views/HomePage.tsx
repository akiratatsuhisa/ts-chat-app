import { FC } from "react";
import { ChatAlt2Icon, ShareIcon, UserGroupIcon } from "@heroicons/react/solid";

interface HomePageProps {}

export const HomePage: FC<HomePageProps> = () => {
  return (
    <div>
      <div
        className="flex relative justify-center items-center shadow-lg h-48 md:h-80  bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/1920/800')" }}
      >
        <div className="absolute inset-0 bg-slate-500/50"></div>
        <div className="relative">
          <h1 className="text-white text-5xl font-semibold">Home Page</h1>
        </div>
      </div>

      <div className="relative mx-3 mb-3 md:container md:mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-4 -mt-8">
        <div className="bg-white dark:bg-slate-900 shadow-md rounded-md p-4 mt-4">
          <div className="inline-block p-4 -mt-8 bg-blue-400 text-white rounded-lg shadow-lg">
            <ChatAlt2Icon className="h-10 w-10"></ChatAlt2Icon>
          </div>
          <div>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta,
              impedit. Error sit quidem temporibus sapiente harum laboriosam
              inventore repellendus ipsa voluptatem. Fugit modi magnam at
              nesciunt consectetur voluptatum enim perspiciatis.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 shadow-md rounded-md p-4 mt-4">
          <div className="inline-block p-4 -mt-8 bg-red-400 text-white rounded-lg shadow-lg">
            <UserGroupIcon className="h-10 w-10"></UserGroupIcon>
          </div>
          <div>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta,
              impedit. Error sit quidem temporibus sapiente harum laboriosam
              inventore repellendus ipsa voluptatem. Fugit modi magnam at
              nesciunt consectetur voluptatum enim perspiciatis.
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 shadow-md rounded-md p-4 mt-4">
          <div className="inline-block p-4 -mt-8 bg-green-400 text-white rounded-lg shadow-lg">
            <ShareIcon className="h-10 w-10"></ShareIcon>
          </div>
          <div>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta,
              impedit. Error sit quidem temporibus sapiente harum laboriosam
              inventore repellendus ipsa voluptatem. Fugit modi magnam at
              nesciunt consectetur voluptatum enim perspiciatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
