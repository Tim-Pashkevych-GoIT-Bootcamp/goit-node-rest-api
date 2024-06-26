import express from "express";
import validateBody from "../decorators/validateBody.js";
import { userSignupLoginSchema } from "../schemas/usersSchemas.js";
import usersControllers from "../controllers/usersControllers.js";
import middlewares from "../middlewares/index.js";

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

usersRouter.post("/logout", middlewares.auth, usersControllers.logout);

usersRouter.get("/current", middlewares.auth, usersControllers.current);

usersRouter.patch(
  "/avatars",
  middlewares.auth,
  middlewares.upload.single("avatar"),
  usersControllers.updateAvatar
);

export default usersRouter;
