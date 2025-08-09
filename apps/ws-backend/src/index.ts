import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
 
const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (socket, request) => {
  const url = request.url; // ws://localhost:8081?token=1234
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded || !(decoded as JwtPayload).userId) {
    socket.close();
    return;
  }

  socket.on("message", (message) => {
    if (message.toString() == "ping") {
      socket.send("pong");
    }
  });
});
