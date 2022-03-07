import { IPC, LogType } from "./enums";
import ReduxAccessor from "../store/accessor";
import { capitalize } from "@mui/material";
import FirebaseHandler from "./handlers/firebaseHandler";

const testPaths = [
  "CustomerOrderS16112 210804-110500.xml",
  "InventoryPartInStock 210802-155209.xml",
  "PurchaseOrder629195 210803-141357.xml",
  "InventoryPartInStock 210812-124414.xml",
  "MaterialTransferRequisitions 210817-115842.xml",
  "MaterialTransferRequisitions 210824-100806.xml",
];

const { ipcRenderer } = window.require("electron");
const codes = window.require("http-codes")

const InvokeHandler = () => {
  const { log, setStatus } = ReduxAccessor();
  const { addFailure } = FirebaseHandler();

  interface InvokeParams {
    args?: any;
    next?: Function;
    error?: Function;
    setIsLoading?: Function;
  }

  const invoke = async (key: IPC, { args = null, next, error, setIsLoading }: InvokeParams) => {
    if (setIsLoading) setIsLoading(true);
    let response: LabelResponse = await ipcRenderer.invoke(key, args);
    if (key === IPC.GET_FILE && process.env.NODE_ENV === "development") response = developmentFile();
    if (checkStatus(response.statuscode)) {
      handleSuccess(key, response);
      if (next) next(response.payload);
    }
    if (!checkStatus(response.statuscode)) {
      handleFailure(key, response);
      if (error) error(response.message);
    }
    if (setIsLoading) setIsLoading(false);
  };

  const removeUnderscore = (input: string) => {
    let words = input.split("_");
    let result = "";
    for (let i = 0; i < words.length; i++) {
      if (i === words.length - 1) {
        result += capitalize(words[i].toLowerCase()) ;
      } else {
        result += `${capitalize(words[i].toLowerCase())} `;
      }
    }
    return result;
  }

  const getStatusCode = (status: number): string => {
    let string = Object.keys(codes).find((key: string) => (codes as any)[key] === status)
    if (!string) return "Not Supported";
    return removeUnderscore(string)
  }

  const handleSuccess = (key: IPC, response: LabelResponse) => {
    log(LogType.Success, removeUnderscore(key), `${getStatusCode(response.statuscode)} : ${response.message}`);
  };

  const handleFailure = (key: IPC, response: LabelResponse) => {
    log(response.statuscode > 499 ? LogType.Failure : LogType.Error, removeUnderscore(key), `${getStatusCode(response.statuscode)} : ${response.message}`);
    if (response.statuscode > 499) addFailure({ statuscode: response.statuscode, name: removeUnderscore(key),  message: `${getStatusCode(response.statuscode)} : ${response.message}`})
    setStatusOf(key,  false)
  };

  const checkStatus = (statuscode: number): boolean => {
    return statuscode >= 200 && statuscode <= 299;
  };

  const setStatusOf = (key: IPC, value: boolean) => {
    switch (key) {
      case IPC.DYMO_STATUS:
        setStatus({ key: "isDYMO", value });
        break;
      case IPC.GET_TEMPLATE:
        setStatus({ key: "isTemplate", value });
        break;
      case IPC.GET_FILE:
        setStatus({ key: "isFile", value });
        break;
      case IPC.GET_CONFIGS:
        setStatus({ key: "isConfig", value });
        break;
    }
  };

  const developmentFile = (): LabelResponse => {
    return {
      statuscode: 200,
      message: "Success",
      payload: { filepath: `src/examples/${testPaths[4]}` },
    };
  };

  return { invoke };
};

export default InvokeHandler;
