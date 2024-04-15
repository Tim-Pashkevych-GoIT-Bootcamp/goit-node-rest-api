import bcrypt from "bcrypt";
import gravatar from "gravatar";

import { User } from "../models/User.js";

const find = (filter) => User.findOne(filter);

const create = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  const avatarURL = gravatar.url(data.email);

  const user = await User.create({
    ...data,
    password: hashPassword,
    avatarURL,
  });

  return user;
};

const update = async (id, data) => User.findByIdAndUpdate(id, data);

const validatePassword = async (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export default { find, create, update, validatePassword };
