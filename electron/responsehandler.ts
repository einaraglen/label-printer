export enum StatusType {
  Success = 200,
  Created = 201,
  Error = 400,
  Missing = 404,
  Conflict = 409,
}

interface Params {
  type?: StatusType;
  message?: string;
  payload?: any;
}

export const handleResponse = ({ type = StatusType.Success, message = "Success", payload }: Params): LabelResponse => {
  if (payload) return { statuscode: type, message, payload };
  return { statuscode: type, message };
};
