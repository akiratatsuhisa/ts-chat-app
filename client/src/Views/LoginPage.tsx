import { FC, useState } from "react";
import { Alert } from "../Components/Alert";
import { useFormik } from "formik";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { FieldInput } from "../Components/FieldInput";

interface LoginFormValues {
  username: string;
  password: string;
}

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [alert, setAlert] = useState<any>({
    color: "",
    message: "",
    show: false,
  });

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required(),
      password: Yup.string().required(),
    }),
    async onSubmit(values: LoginFormValues) {
      try {
        const result = await login(values.username, values.password);
        setAlert({
          message: result,
          color: "green",
          show: true,
        });

        setTimeout(() => navigate("/"), 1500);
      } catch (e: any) {
        setAlert({
          message: e.response.data.message,
          color: "red",
          show: true,
        });
      }
    },
  });

  return (
    <div>
      <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-3xl shadow-md md:w-2/3 mx-3 md:mx-auto  my-3 md:my-12">
        <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>
        {alert.show && (
          <Alert
            show={alert.show}
            onClose={() => setAlert({ ...alert, show: false })}
            color={alert.color}
            closable={true}
          >
            {alert.message}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <FieldInput
              type="text"
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={{
                show: !!(formik.touched.username && formik.errors.username),
                value: formik.errors.username,
              }}
            />
          </div>

          <div className="mb-3">
            <FieldInput
              type="password"
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={{
                show: !!(formik.touched.password && formik.errors.password),
                value: formik.errors.password,
              }}
            />
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
