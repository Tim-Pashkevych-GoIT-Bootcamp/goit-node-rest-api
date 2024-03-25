import { errorMessageList } from "../constants/constants.js";

const RequestError = (code, message = errorMessageList[code]) => {
  return {
    status: "error",
    code,
    message,
    data: errorMessageList[code],
  };
};

export default RequestError;
