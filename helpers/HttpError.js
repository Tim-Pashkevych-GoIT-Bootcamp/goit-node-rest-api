import { errorMessageList } from "../constants/constants.js";

const HttpError = (status, message = errorMessageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpError;
