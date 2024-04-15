import express from "express";
import validateBody from "../decorators/validateBody.js";
import { userSignupLoginSchema } from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(userSignupLoginSchema),
  usersControllers.register
);

export default usersRouter;
