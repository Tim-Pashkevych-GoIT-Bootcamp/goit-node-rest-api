import bcrypt from "bcrypt";
import gravatar from "gravatar";
import formData from "form-data";
import Mailgun from "mailgun.js";

import { User } from "../models/User.js";

const { APP_HOST } = process.env;
const { MAILGUN_API_KEY } = process.env;
const { MAILGUN_DOMAIN_NAME } = process.env;

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

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${APP_HOST}/api/users/verify/${verificationToken}`;
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: MAILGUN_API_KEY,
  });

  await mg.messages.create(MAILGUN_DOMAIN_NAME, {
    from: `API <mailgun@${MAILGUN_DOMAIN_NAME}>`,
    to: [email],
    subject: "Please, verify your email address",
    text: `Dear customer\n Please, click this link to verify your email address:\n ${verificationLink}`,
    html: `Dear customer<br /> Please, click this link to verify your email address:<br /><br /> <a href="${verificationLink}">${verificationLink}</a>`,
  });
};

export default {
  find,
  create,
  update,
  validatePassword,
  sendVerificationEmail,
};
