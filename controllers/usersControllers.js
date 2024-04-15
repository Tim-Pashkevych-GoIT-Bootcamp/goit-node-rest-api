import jwt from "jsonwebtoken";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import formData from "form-data";
import Mailgun from "mailgun.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import usersServices from "../services/usersServices.js";

const { JWT_SECRET } = process.env;
const { APP_HOST } = process.env;
const { MAILGUN_API_KEY } = process.env;
const { MAILGUN_DOMAIN_NAME } = process.env;
const avatarsDir = path.resolve("public", "avatars");

const userRegister = async (req, res) => {
  const { email } = req.body;

  const user = await usersServices.find({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await usersServices.create({
    ...req.body,
    verificationToken: nanoid(),
  });

  // Sending a verification email
  const verificationLink = `${APP_HOST}/api/users/verify/${newUser.verificationToken}`;
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: MAILGUN_API_KEY,
  });

  await mg.messages.create(MAILGUN_DOMAIN_NAME, {
    from: `API <mailgun@${MAILGUN_DOMAIN_NAME}>`,
    to: [newUser.email],
    subject: "Please, verify your email address",
    text: `Dear customer\n Please, click this link to verify your email address:\n ${verificationLink}`,
    html: `Dear customer<br /> Please, click this link to verify your email address:<br /><br /> <a href="${verificationLink}">${verificationLink}</a>`,
  });

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

  if (!user.verify) {
    throw HttpError(400, "Verification has not been passed");
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

const userVerify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await usersServices.find({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await usersServices.update(user["_id"], {
    verificationToken: null,
    verify: true,
  });

  res.json({
    message: "Verification successful",
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
  verify: ctrlWrapper(userVerify),
  updateAvatar: ctrlWrapper(updateAvatar),
};
