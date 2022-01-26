import { FC } from "react";
import { useParams } from "react-router-dom";

interface ChatRoomPageProps {}

export const ChatRoomPage: FC<ChatRoomPageProps> = () => {
  const { id } = useParams();

  return <h1 className="text-4xl font-medium">Room {id}</h1>;
};
