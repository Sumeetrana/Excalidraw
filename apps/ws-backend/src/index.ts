import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8081 });

interface IUser {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: IUser[] = [];

wss.on("connection", (socket, request) => {
  const url = request.url; // ws://localhost:8081?token=1234
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  let decoded: JwtPayload | string;
  try {
    decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !(decoded as JwtPayload).userId) {
      socket.close();
      return null;
    }
  } catch (error) {
    console.error("Error parsing token:", error);
    socket.close();
    return null;
  }

  const userId = (decoded as JwtPayload).userId;

  users.push({
    userId,
    rooms: [],
    ws: socket,
  });

  console.log(
    "Users: ",
    users.map((u) => {
      return {
        userId: u.userId,
        rooms: u.rooms,
      };
    })
  );

  socket.on("message", async (message) => {
    const parsedData = JSON.parse(message as unknown as string); // {type: "join", roomId: 1}

    if (parsedData.type === "join") {
      const user = users.find((u) => u.userId === userId);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave") {
      const user = users.find((u) => u.userId === userId);

      if (!user) {
        return;
      }

      user.rooms = user.rooms.filter((room) => room !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          userId,
          message,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          console.log("Reaching here", user.userId, roomId, message);

          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            })
          );
        }
      });
    }

    console.log(
      "Users 2: ",
      users.map((u) => {
        return {
          userId: u.userId,
          rooms: u.rooms,
        };
      })
    );
  });
});
