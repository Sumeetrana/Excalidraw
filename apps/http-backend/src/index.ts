import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { auth } from "./middlewares/auth";

const app = express();

app.post("/signup", (req, res) => {
  // db call
  res.json({
    message: "Hello world",
  });
});

app.post("/signin", (req, res) => {
  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({ token });
});

app.post("/room", auth, (req, res) => {
  // db call
  res.json({
    roomId: 123,
  });
});

app.listen(8080, () => {
  console.log("Http server is running on 8080");
});
