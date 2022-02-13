type IAction = {
  type: string;
  payload: any;
};

interface SetStateAction extends IAction {
  payload: ProgramState
}

interface LogAction extends IAction {
  payload: ProgramLog
}

interface FilePathAction extends IAction {
  payload: string
}
interface ConfigAction extends IAction {
  payload: string
}

interface AddConfigAction extends IAction {
  payload: Config
}

interface RemoveConfigAction extends IAction {
  payload: Config
}

interface UpdateConfigKeyAction extends IAction {
  payload: {
    name: string;
    payload: any
  }
}

interface UpdateConfigAction extends IAction {
  payload: {
    name: string;
    payload: Config
  }
}

interface SetConfigAction extends IAction {
  payload: Config[]
}

interface SetTemplatesAction extends IAction {
  payload: Template[]
}

interface SetTemplateAction extends IAction {
  payload: string
}

interface AddTemplateAction extends IAction {
  payload: string
}

interface UpdateAdjustmentAction extends IAction {
  payload: {
    name: string;
    value: any
  }
}

interface SetPrinterAction extends IAction {
  payload: string
}

interface StatusAction extends IAction {
  payload: {
    key: string,
    value: boolean
  }
}

type DispatchType = (args: IAction) => IAction;
