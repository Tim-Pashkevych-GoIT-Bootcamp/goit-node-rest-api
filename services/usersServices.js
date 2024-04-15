import bcrypt from "bcrypt";
import { User } from "../models/User.js";

const find = (filter) => User.findOne(filter);

const create = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashPassword });

  return user;
};

export default { find, create };
