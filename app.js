import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import contactsRouter from "./routes/contactsRouter.js";

const { DB_HOST, PORT = 3000 } = process.env;
const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

app.use("/api/contacts", contactsRouter);

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on route /api/contacts",
    data: "Not found",
  });
});

app.use((error, _, res, __) => {
  const {
    status = "fail",
    code = 500,
    message,
    data = "Internal Server Error",
  } = error;

  res.status(code).json({
    status,
    code,
    message,
    data,
  });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
