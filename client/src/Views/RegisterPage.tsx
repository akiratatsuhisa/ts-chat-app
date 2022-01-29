import { FC, useState } from "react";
import { Alert } from "../Components/Alert";
import { useFormik } from "formik";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Input } from "../Components/Input";

interface RegisterFormValues {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [alert, setAlert] = useState<any>({
    color: "",
    message: "",
    show: false,
  });

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      username: "",
      displayName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required().trim().min(3).max(32),
      displayName: Yup.string().required().trim().min(3).max(32),
      email: Yup.string().email(),
      password: Yup.string().required().min(3).max(32),
    }),
    async onSubmit(values: RegisterFormValues) {
      try {
        const result = await register(
          values.username,
          values.displayName,
          values.email,
          values.password
        );
        setAlert({
          message: result,
          color: "green",
          show: true,
        });

        setTimeout(() => navigate("/login"), 1500);
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
        <h1 className="text-3xl font-semibold text-center mb-6">Register</h1>
        {alert.show && (
          <Alert
            show={alert.show}
            onHide={() => setAlert({ ...alert, show: false })}
            color={alert.color}
            closable={true}
          >
            {alert.message}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <Input
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
            <Input
              type="text"
              label="Display name"
              name="displayName"
              value={formik.values.displayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={{
                show: !!(
                  formik.touched.displayName && formik.errors.displayName
                ),
                value: formik.errors.displayName,
              }}
            />
          </div>
          <div className="mb-3">
            <Input
              type="email"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={{
                show: !!(formik.touched.email && formik.errors.email),
                value: formik.errors.email,
              }}
            />
          </div>
          <div className="mb-3">
            <Input
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
            Create
          </button>
        </form>
      </div>
    </div>
  );
};
