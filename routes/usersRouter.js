import express from "express";
import validateBody from "../decorators/validateBody.js";
import { userSignupSchema } from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(userSignupSchema),
  usersControllers.register
);

export default usersRouter;
