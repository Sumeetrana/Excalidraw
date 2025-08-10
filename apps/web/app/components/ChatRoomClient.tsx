"use client";

import React, { useEffect } from "react";
import useSocket from "../hooks/useSocket";

interface IProps {
  messages: { message: string }[];
  roomId: string;
}

const ChatRoomClient: React.FC<IProps> = ({ messages, roomId }) => {
  const [chats, setChats] = React.useState(messages);
  const [currentMessage, setCurrentMessage] = React.useState("");
  const { socket, loading } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join",
          roomId: roomId,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type === "chat") {
          setChats((c) => [...c, parsedData.message]);
        }
      };
    }
  }, [socket, loading]);

  console.log("Chats: ", chats);

  return (
    <div>
      {chats.map((m) => (
        <div key={m.message}>{m.message}</div>
      ))}
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: roomId,
              message: currentMessage,
            })
          );
          setCurrentMessage("");
        }}
      >
        Send message
      </button>
    </div>
  );
};

export default ChatRoomClient;
