import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import RequestError from "../helpers/RequestError.js";
import usersServices from "../services/usersServices.js";

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

  const token = "exampletoken";

  res.status(201).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

export default {
  register: ctrlWrapper(userRegister),
  login: ctrlWrapper(userLogin),
};
