type IAction = {
    type: string;
    payload: any;
  };

type DispatchType = (args: IAction) => IAction;