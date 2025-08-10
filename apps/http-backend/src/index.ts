import express from "express";
import jwt from "jsonwebtoken";
import { auth } from "./middlewares/auth";
import {
  CreateUserSchema,
  SignInSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);

  if (!data.success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  try {
    await prismaClient.user.create({
      data: {
        email: data.data.username,
        password: data.data.password,
        name: data.data.name,
      },
    });

    res.json({
      message: "User signed up",
    });
  } catch (error) {
    res.status(411).json({
      error: "User exists",
    });
  }
});

app.post("/signin", async (req, res) => {
  const data = SignInSchema.safeParse(req.body);

  if (!data.success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  const user = await prismaClient.user.findFirst({
    where: { email: data.data.username },
  });

  if (!user) {
    return res.status(403).json({
      message: "User does not exist. Please signup first.",
    });
  }

  if (user.password !== data.data.password) {
    return res.status(403).json({
      message: "Incorrect password",
    });
  }

  const userId = user.id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({ token });
});

app.post("/room", auth, async (req, res) => {
  const data = await CreateRoomSchema.safeParse(req.body);

  if (!data.success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  try {
    const newRoom = await prismaClient.room.create({
      data: {
        slug: data.data.name,
        adminId: req.userId,
      },
    });

    res.json({
      roomId: newRoom.id,
    });
  } catch (error) {
    res.status(411).json({
      error: "Room already exists",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: { roomId: roomId },
    orderBy: { id: "desc" },
    take: 50,
  });

  res.json({ messages });
});

app.listen(8080, () => {
  console.log("Http server is running on 8080");
});
