import React from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import ChatRoomClient from "./ChatRoomClient";

interface IProps {
  roomId: string;
}

async function getChats(roomId: string) {
  const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
  return response.data.messages;
}

const ChatRoom = async (props: IProps) => {
  const messages = await getChats(props.roomId);
  return <ChatRoomClient roomId={props.roomId} messages={messages} />;
};

export default ChatRoom;
