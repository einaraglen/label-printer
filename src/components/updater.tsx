import React, { useEffect } from "react";
import { IPC } from "../utils/enums";
import InvokeHandler from "../utils/invoke";
import packageJson from "../../package.json";
import ReduxAccessor from "../store/accessor";

const Updater = () => {
  const { invoke } = InvokeHandler();
  const { setUpdate } = ReduxAccessor();

  useEffect(() => {
    const check = async () => {
      await invoke(IPC.CHECK_UPDATE, {
        args: packageJson.version,
        next: (data: any) => setUpdate(data),
        error: (data: any) => console.warn(data),
      });
    };
    check();
  }, []);

  return <></>;
};

export default Updater;
