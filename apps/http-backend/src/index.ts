import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { auth } from "./middlewares/auth";
import {
  CreateUserSchema,
  SignInSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = await CreateUserSchema.safeParse(req.body);

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
  const data = await SignInSchema.safeParse(req.body);

  if (!data.success) {
    return res.json({
      message: "Incorrect inputs",
    });
  }

  const { email } = req.body;

  const user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    return res.json({
      message: "User does not exist. Please signup first.",
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

  const { name } = req.body;

  const newRoom = await prismaClient.room.create({
    data: {
      slug: name,
      adminId: req.userId,
    },
  });

  res.json({
    roomId: newRoom.id,
  });
});

app.listen(8080, () => {
  console.log("Http server is running on 8080");
});
