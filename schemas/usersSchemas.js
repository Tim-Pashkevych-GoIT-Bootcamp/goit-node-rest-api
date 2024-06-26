import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

export const userSignupLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
