const codes = require("http-codes")

interface Params {
  status?: number;
  message?: string;
  payload?: any;
}

export const handleResponse = ({ status = codes.OK, message = "Success", payload }: Params): LabelResponse => {
  if (payload) return { statuscode: status, message, payload };
  return { statuscode: status, message };
};
