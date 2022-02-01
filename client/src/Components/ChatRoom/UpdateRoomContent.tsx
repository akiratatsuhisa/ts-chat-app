import { useFormik } from "formik";
import { FC, useState } from "react";
import * as Yup from "yup";
import { apiInstance, IChatRoom } from "../../Services/Api.service";
import { Alert } from "../Alert";
import { Input } from "../Input";
import { Modal } from "../Modal";

interface UpdateRoomFormValues {
  name: string;
}

interface UpdateRoomContentProps {
  id: string;
  onUpdate: (room: IChatRoom) => void;
}

export const UpdateRoomContent: FC<UpdateRoomContentProps> = ({ id, onUpdate }) => {
  const [show, setShow] = useState<boolean>(false);
  const [alert, setAlert] = useState<any>({
    color: "",
    message: "",
    show: false,
  });

  const formik = useFormik<UpdateRoomFormValues>({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required().min(3).max(256),
    }),
    async onSubmit(values: UpdateRoomFormValues) {
      try {
        const result = await apiInstance.put<IChatRoom>(
          `/chatRooms/${id}`,
          values
        );

        const room = result.data;
        setAlert({
          message: `${room.name} was updated`,
          color: "green",
          show: true,
        });

        onUpdate(room);
        setTimeout(() => {
          setAlert({
            color: "",
            message: "",
            show: false,
          });
          setShow(false);
        }, 1500);
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
        className="bg-blue-500  hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md font-semibold"
        onClick={() => setShow(true)}
      >
        Update
      </button>

      <Modal show={show} onHide={() => setShow(false)} title="Update Room">
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
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
