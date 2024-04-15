import Joi from "joi";
import { emailRegexp } from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
