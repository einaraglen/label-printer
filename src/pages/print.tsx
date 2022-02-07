import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage, parseFile } from "../utils/tools";
import { Helmet } from 'react-helmet'
import InvokeHandler from "../utils/invoke";
import { IPC } from "../utils/enums";
import ConfigHandler from "../utils/handlers/confighandler";

const PrintPage = () => {
    const [IFS, setIFS] = useState<string | null>(null);
    const { filepath, setConfigs, setConfig } = ReduxAccessor();
    const { invoke } = InvokeHandler();
    const { checkForExistingConfig } = ConfigHandler();

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found")
    /*const parse = async () => {
      if (filepath) console.log(await parseFile(filepath));
    };
    parse();*/
  }, [filepath]);

const handleReset = async () => {
  setConfigs([])
  await invoke(IPC.SET_CONFIGS, {
    args: JSON.stringify([]),
    next: (data: any) => {
      console.log({data})
    },
  });
}

const handleLoad = async () => {
  await invoke(IPC.GET_CONFIGS, {
    args: JSON.stringify([]),
    next: (data: any) => {
      console.log(JSON.parse(data.configs))
    },
  });

  let match = await checkForExistingConfig(parseIFSPage(filepath) ?? "")
  console.log({match})
  //setConfig()
}
  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
        <Helmet>
          <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Print`}</title>
        </Helmet>
        <Button onClick={handleLoad} variant="outlined" sx={{ mx: 10, my: "auto" }}>
        Load Configs
      </Button>
      <Button onClick={handleReset} variant="outlined" sx={{ mx: 10, my: "auto" }}>
        Reset Configs
      </Button>
    </Box>
  );
};

export default PrintPage;
