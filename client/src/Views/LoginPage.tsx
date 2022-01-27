import { FC, useState } from "react";
import { Alert } from "../Components/Alert";
import { FormikErrors, useFormik } from "formik";
import { apiInstance } from "../Services/Api.service";
import { useAuth } from "../Contexts/AuthContext";

interface LoginFormValues {
  username: string;
  password: string;
}

export const LoginPage: FC = () => {
  const [alert, setAlert] = useState<string>("");
  const { login } = useAuth();
  const validate = (values: LoginFormValues) => {
    const errors: FormikErrors<LoginFormValues> = {};
    if (!values.username) {
      errors.username = "Required";
    }

    if (!values.password) {
      errors.password = "Required";
    }

    return errors;
  };

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    async onSubmit(values: LoginFormValues) {
      try {
        const result = await login(values.username, values.password);
        setAlert(result);
      } catch (e: any) {
        setAlert(e.response.data.message);
      }
    },
  });

  return (
    <div>
      <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-3xl shadow-md md:w-2/3 mx-3 md:mx-auto  my-3 md:my-12">
        <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>
        {alert && (
          <Alert title="Warning" color="yellow">
            {alert}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="block mb-3 font-light">Username</label>
            <input
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
              type="text"
              className="dark:bg-slate-800 w-full p-2 mb-2 outline-none border-2 rounded-lg border-slate-300 dark:border-slate-700 focus:border-green-400 dark:focus:border-green-400"
            ></input>
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 font-medium">
                {formik.errors.username}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-3 font-light">Password</label>
            <input
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              type="password"
              className="dark:bg-slate-800 w-full p-2 mb-2 outline-none border-2 rounded-lg border-slate-300 dark:border-slate-700 focus:border-green-400 dark:focus:border-green-400"
            ></input>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 font-medium">
                {formik.errors.password}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full mt-6 p-3 text-center bg-green-500 rounded-lg text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
