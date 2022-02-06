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
  payload: any
}

interface AddTemplateAction extends IAction {
  payload: string
}

interface StatusAction extends IAction {
  payload: {
    key: string,
    value: boolean
  }
}

type DispatchType = (args: IAction) => IAction;
