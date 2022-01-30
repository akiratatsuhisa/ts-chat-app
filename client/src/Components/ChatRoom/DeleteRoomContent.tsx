import { useFormik } from "formik";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiInstance, IChatRoom } from "../../Services/Api.service";
import { Alert } from "../Alert";
import { Modal } from "../Modal";

interface DeleteRoomContentProps {
  id: string;
}

export const DeleteRoomContent: FC<DeleteRoomContentProps> = ({ id }) => {
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<any>({
    color: "",
    message: "",
    show: false,
  });

  const formik = useFormik({
    initialValues: {},
    async onSubmit() {
      try {
        const result = await apiInstance.delete<IChatRoom>(`/chatRooms/${id}`);

        const room = result.data;
        setAlert({
          message: `${room.name} was deleted.`,
          color: "green",
          show: true,
        });

        setTimeout(() => {
          navigate("/chat");
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
        className="bg-red-500  hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md font-semibold"
        onClick={() => setShow(true)}
      >
        Delete
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
              <div className="mb-3"></div>
              <div className="grid grid-cols-1 mb-3">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
