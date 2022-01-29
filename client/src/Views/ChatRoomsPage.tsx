import { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../Components/Modal";
import { Input } from "../Components/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { uniqBy } from "lodash";
import { useAuth } from "../Contexts/AuthContext";
import { apiInstance, apiUrl, IChatRoom } from "../Services/Api.service";
import { Alert } from "../Components/Alert";

interface ChatRoomsPageProps {}

export const ChatRoomsPage: FC<ChatRoomsPageProps> = () => {
  const { currentUser } = useAuth();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [rooms, setRooms] = useState<IChatRoom[]>([]);

  const fetch = async (prevRooms: IChatRoom[]): Promise<void> => {
    if (isFetching) return;
    setIsFetching(true);
    const cursor = prevRooms[prevRooms.length - 1]?._id ?? "";
    try {
      const result = await apiInstance.get<IChatRoom[]>("/chatRooms", {
        params: {
          size: 12,
          cursor,
        },
      });

      const newRooms = result.data;

      setRooms(uniqBy([...prevRooms, ...newRooms], (room) => room._id));
    } catch (error: any) {
      console.log(error?.response);
    } finally {
      setTimeout(() => {
        setIsFetching(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetch([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItems = rooms.map(
    ({ _id, name, users, createdAt, updatedAt }) => (
      <div
        key={_id}
        className="bg-white dark:bg-slate-900 border-r-4 border-cyan-400 hover:border-teal-400 p-3 shadow-md hover:shadow-lg rounded-md transition-all hover:scale-105 duration-200 ease-in-out "
      >
        <h3 className="text-lg hover:text-cyan-500">
          <span className="text-slate-600 dark:text-slate-300  font-thin">
            Room:{" "}
          </span>
          <span className="font-semibold">{name}</span>
        </h3>
        <div className="-space-x-2">
          {users?.map((user) => (
            <div key={user._id} className="inline-block ">
              <img
                className="block border-2 h-10 w-10 rounded-full border-white dark:border-slate-900"
                src={new URL(user.avatarUrl, apiUrl).toString()}
                alt={user.username}
              />
            </div>
          ))}
        </div>
        <div className="mt-2">
          {users?.find((u) => u._id === currentUser?.id) && (
            <Link
              className="text-teal-500 hover:text-white border-teal-500 hover:bg-teal-500 inline-block text-sm border-2 px-4 py-1 rounded-full"
              to={`/chat/${_id}`}
            >
              OPEN
            </Link>
          )}
        </div>
      </div>
    )
  );
  return (
    <div className="container mx-auto p-2 md:p-3">
      <div className=" my-6 flex flex-row flex-wrap items-center">
        <h1 className="text-4xl font-medium">Room List</h1>
        <div className="ml-auto grid grid-cols-2 gap-2">
          <button
            className="bg-cyan-400 hover:bg-cyan-500 text-white px-3 rounded-full"
            onClick={() => fetch([])}
          >
            {isFetching ? (
              <span className=" inline-block h-6 w-6 rounded-full border-2  border-slate-300/60 border-l-white animate-spin"></span>
            ) : (
              "Reset"
            )}
          </button>
          <CreateRoomContent></CreateRoomContent>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{renderItems}</div>
      <div className="mt-8 text-center">
        {isFetching ? (
          <span className=" inline-block h-8 w-8 rounded-full border-4  border-slate-300/60 border-l-white animate-spin"></span>
        ) : (
          <button
            disabled={isFetching}
            className="bg-cyan-400 disabled:bg-cyan-300 hover:bg-cyan-500 text-white outline-none rounded-xl px-4 py-2 font-semibold"
            onClick={() => fetch(rooms)}
          >
            Fetch more
          </button>
        )}
      </div>
    </div>
  );
};

interface CreateRoomFormValues {
  name: string;
}

const CreateRoomContent: FC = () => {
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
