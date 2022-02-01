import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiInstance, IChatRoom } from "../../Services/Api.service";
import { Alert } from "../Alert";
import { Modal } from "../Modal";
import { Input } from "../Input";

interface CreateRoomFormValues {
  name: string;
}

export const CreateRoomContent: FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<any>({
    color: "",
    message: "",
    show: false,
  });

  const formik = useFormik<CreateRoomFormValues>({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required().min(3).max(256),
    }),
    async onSubmit(values: CreateRoomFormValues) {
      try {
        const result = await apiInstance.post<IChatRoom>("/chatRooms", values);

        const room = result.data;
        setAlert({
          message: "Created",
          color: "green",
          show: true,
        });

        setTimeout(() => navigate(`/chat/${room._id}`), 1500);
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
    <>
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-full"
        onClick={() => setShow(true)}
      >
        New Room
      </button>

      <Modal show={show} onHide={() => setShow(false)} title="New Room">
        <div className="p-3">
          <div className="w-full md:w-2/3 mx-auto">
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
                  label="Room name"
                  placeholder="enter room name..."
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={{
                    show: !!(formik.touched.name && formik.errors.name),
                    value: formik.errors.name,
                  }}
                ></Input>
              </div>
              <div className="grid grid-cols-1 mb-3">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
