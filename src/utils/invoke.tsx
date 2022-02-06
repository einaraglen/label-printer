import { IPC, LogType } from "./enums";
import ReduxAccessor from "../store/accessor";

const testPaths = [
  "CustomerOrderS16112 210804-110500.xml",
  "InventoryPartInStock 210802-155209.xml",
  "PurchaseOrder629195 210803-141357.xml",
  "InventoryPartInStock 210812-124414.xml",
  "MaterialTransferRequisitions 210817-115842.xml",
  "MaterialTransferRequisitions 210824-100806.xml",
];

const { ipcRenderer } = window.require("electron");

const InvokeHandler = () => {
  const { log, setStatus } = ReduxAccessor();

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

  const handleSuccess = (key: IPC, response: LabelResponse) => {
    log(LogType.Success, `${key} ${response.message}`);
  };

  const handleFailure = (key: IPC, response: LabelResponse) => {
    log(LogType.Failure, response.message);
    setStatusOf(key, false)
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
      case IPC.GET_CONFIG:
        setStatus({ key: "isConfig", value });
        break;
    }
  };

  const developmentFile = (): LabelResponse => {
    return {
      statuscode: 200,
      message: "Success",
      payload: { filepath: `src/examples/${testPaths[1]}` },
    };
  };

  return { invoke };
};

export default InvokeHandler;
