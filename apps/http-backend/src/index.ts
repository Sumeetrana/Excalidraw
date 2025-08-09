import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.listen(8080, () => {
  console.log("Http server is running on 8080");
});
