import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    if (message.toString() == "ping") {
      socket.send("pong");
    }
  });
});
