import React, { useEffect, useState } from "react";
import MuiTheme from "./theme/mui.theme";
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Print from "./pages/print";
import Settings from "./pages/settings";
import "./main.css";
import { Box, Container } from "@mui/material";
import Footer from "./components/footer";
import CssBaseline from "@mui/material/CssBaseline";
import { IPC, LogType, ProgramState } from "./utils/enums";
import Templates from "./pages/templates";
import InvokeHandler from "./utils/invoke";
import ReduxAccessor from "./store/accessor";
import ConfigHandler from "./utils/handlers/confighandler";
import { parseIFSPage } from "./utils/tools";
import LinearWithValueLabel from "./components/progress";
import Overlay from "./components/overlay";
import Updater from "./components/updater";

const { ipcRenderer } = window.require("electron");

const App = () => {
  const { theme } = MuiTheme();
  const { setState, state, setStatus, filepath, setFilePath, setConfigs, setConfig, setTemplates, setTemplate, setUsername, log } = ReduxAccessor();
  const { invoke } = InvokeHandler();
  const { checkForExistingConfig } = ConfigHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigSet, setIsConfigSet] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(10);
  const [open, setOpen] = useState(false);

  const checkConfig = (_config: Config) => {
    let flag = false;
    _config.keys.forEach((key: ConfigKey) => {
      if (key.value === "") flag = true;
    });
    return !flag;
  };

  //Handle cases where user opens new print file with program already running
  useEffect(() => {
    ipcRenderer.on("open-with", (event: any, file: any) => {
      setIsConfigSet(false);
      setFilePath(file);
      setStatus({ key: "isFile", value: true });
      log(LogType.Info, "New File", `LabelPrinter was re-opened with: ${file}`);
      setIsConfigSet(true);
    });
  }, []);

  useEffect((): any => {
    const load = async () => {
      await invoke(IPC.GET_FILE, {
        next: async (data: any) => {
          if (!data.filepath) return;
          setStatus({ key: "isFile", value: true });
          setFilePath(data.filepath);
        },
        error: () => setStatus({ key: "isConfig", value: true })
      });
      await invoke(IPC.DYMO_STATUS, {
        next: (data: any) => setStatus({ key: "isDYMO", value: JSON.parse(data) }),
      });
      await invoke(IPC.GET_TEMPLATES, {
        next: (data: any) => {
          setTemplates(JSON.parse(data.templates));
        },
      });
      await invoke(IPC.GET_USERNAME, {
        next: (data: any) => {
          setStatus({ key: "isUsername", value: data.username !== "" });
          setUsername(data.username);
        },
      });
      setProgress(65);
      await invoke(IPC.GET_TEMPLATE, {
        next: (data: any) => {
          setStatus({ key: "isTemplate", value: true });
          setTemplate(data.template);
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      await invoke(IPC.GET_CONFIGS, {
        next: (data: any) => {
          setConfigs(JSON.parse(data.configs));
          setIsConfigSet(true); // trigger load of config based on filepath
        },
        error: () => setIsConfigSet(true), // trigger load of config based on filepath
      });
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setState(ProgramState.Ready);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!isConfigSet) return;
    const config = async () => {
      let IFS = parseIFSPage(filepath);
      if (IFS) {
        if (IFS === "No File Found") return;
        let { created, config } = await checkForExistingConfig(IFS);
        if (created) setStatus({ key: "isConfig", value: false });
        setStatus({ key: "isConfig", value: checkConfig(config) });
        setConfig(config.name);
      }
    };
    config();
  }, [isConfigSet]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Updater />
      <Router>
            {isLoading ? (
              <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, display: "flex", bgcolor: "hsl(215, 28%, 14%)", zIndex: 40 }}>
                <LinearWithValueLabel progress={progress} />
              </Box>
            ) : null}
            {state !== ProgramState.Loading ? (
              <Box sx={{ height: "100vh", display: "flex", px: 0, flexDirection: "column", overflowX: "hidden" }} bgcolor="dark">
                <Overlay {...{ open, setOpen }} />
                <Container sx={{ flexGrow: 1, display: "flex", p: 0, overflowX: "hidden" }}>
                  <Routes>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/" element={<Print {...{ open, setOpen }} />} />
                  </Routes>
                </Container>
                <Footer />
              </Box>
            ) : null}
      </Router>
    </ThemeProvider>
  );
};

export default App;
