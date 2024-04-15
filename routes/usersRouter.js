import express from "express";
import validateBody from "../decorators/validateBody.js";
import { userSignupLoginSchema } from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";
import authenticate from "../middlewares/authenticate.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(userSignupLoginSchema),
  usersControllers.register
);

usersRouter.post(
  "/login",
  validateBody(userSignupLoginSchema),
  usersControllers.login
);

usersRouter.post("/logout", authenticate, usersControllers.logout);

export default usersRouter;
