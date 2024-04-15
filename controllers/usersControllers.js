import jwt from "jsonwebtoken";
import path from "path";
import Jimp from "jimp";

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import usersServices from "../services/usersServices.js";

const { JWT_SECRET } = process.env;
const avatarsDir = path.resolve("public", "avatars");

const userRegister = async (req, res) => {
  const { email } = req.body;

  const user = await usersServices.find({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await usersServices.create(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await usersServices.find({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await usersServices.validatePassword(
    password,
    user.password
  );

  if (!comparePassword) {
    throw HttpError(401, "Email or password wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await usersServices.update({ _id: id }, { token });

  res.status(201).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const userLogout = async (req, res) => {
  const { _id } = req.user;
  await usersServices.update({ _id }, { token: "" });

  res.status(204).json();
};

const userCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(201).json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const extention = originalname.split(".").pop();
  const filename = `${_id}.${extention}`;
  const resultUpload = path.resolve(avatarsDir, filename);

  const avatar = await Jimp.read(tempUpload);
  await avatar.resize(250, 250);
  await avatar.writeAsync(resultUpload);

  const avatarURL = path.resolve("avatars", filename);
  await usersServices.update(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  register: ctrlWrapper(userRegister),
  login: ctrlWrapper(userLogin),
  logout: ctrlWrapper(userLogout),
  current: ctrlWrapper(userCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
