import { FC } from "react";

export const RegisterPage: FC = () => {
  return (
    <div>
      <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-3xl shadow-md md:w-2/3 mx-3 md:mx-auto  my-3 md:my-12">
        <h1 className="text-3xl font-semibold text-center mb-6">Register</h1>
        <div className="mb-3">
          <label className="block mb-3 font-light">Username</label>
          <input
            type="text"
            className="dark:bg-slate-800 w-full p-2 outline-none border-2 rounded-lg border-slate-300 dark:border-slate-700 focus:border-green-400 dark:focus:border-green-400"
          ></input>
        </div>
        <div className="mb-3">
          <label className="block mb-3 font-light">Display name</label>
          <input
            type="text"
            className="dark:bg-slate-800 w-full p-2 outline-none border-2 rounded-lg border-slate-300 dark:border-slate-700 focus:border-green-400 dark:focus:border-green-400"
          ></input>
        </div>
        <div className="mb-3">
          <label className="block mb-3 font-light">Email</label>
          <input
            type="email"
            className="dark:bg-slate-800 w-full p-2 outline-none border-2 rounded-lg border-slate-300 dark:border-slate-700 focus:border-green-400 dark:focus:border-green-400"
          ></input>
        </div>
        <div className="mb-3">
          <label className="block mb-3 font-light">Password</label>
          <input
            type="password"
            className="dark:bg-slate-800 w-full p-2 outline-none border-2 rounded-lg border-slate-300 dark:border-slate-700 focus:border-green-400 dark:focus:border-green-400"
          ></input>
        </div>
        <button className="w-full mt-6 p-3 text-center bg-green-500 rounded-lg text-white">
          Create
        </button>
      </div>
    </div>
  );
};
