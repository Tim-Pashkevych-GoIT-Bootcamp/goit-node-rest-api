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

export default {
  register: ctrlWrapper(userRegister),
};
