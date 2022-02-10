import React, { useEffect, useState } from "react";
import MuiTheme from "./theme/mui.theme";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import PrintPage from "./pages/print";
import SettingsPage from "./pages/settings";
import "./main.css";
import { Box, Container } from "@mui/material";
import Footer from "./components/footer";
import CssBaseline from "@mui/material/CssBaseline";
import { IPC, ProgramState } from "./utils/enums";
import Templates from "./pages/templates";
import InvokeHandler from "./utils/invoke";
import ReduxAccessor from "./store/accessor";
import ConfigHandler from "./utils/handlers/confighandler";
import { parseIFSPage } from "./utils/tools";
import LinearWithValueLabel from "./components/progress";

const App = () => {
  const { theme } = MuiTheme();
  const { setState, state, setStatus, filepath, setFilePath, setConfigs, setConfig, setTemplates, setTemplate } = ReduxAccessor();
  const { invoke } = InvokeHandler();
  const { checkForExistingConfig } = ConfigHandler();
  const [isConfigSet, setIsConfigSet] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(10);

  useEffect((): any => {
    const setup = async () => {
      await invoke(IPC.GET_FILE, {
        next: async (data: any) => {
          if (!data.filepath) return;
          setStatus({ key: "isFile", value: true });
          setFilePath(data.filepath);
        },
      });
      await invoke(IPC.DYMO_STATUS, {
        next: (data: any) => setStatus({ key: "isDYMO", value: JSON.parse(data) }),
      });
      await invoke(IPC.GET_PRINTERS, {
        next: (data: any) => console.log("printers", data),
      });
      await invoke(IPC.GET_TEMPLATES, {
        next: (data: any) => {
          setTemplates(JSON.parse(data.templates));
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
      });
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 200));
      setState(ProgramState.Ready);
    };
    setup();
  }, []);

  useEffect(() => {
    if (!isConfigSet) return;
    const config = async () => {
      let IFS = parseIFSPage(filepath);
      if (IFS) {
        let { created, config } = await checkForExistingConfig(IFS);
        setStatus({ key: "isConfig", value: !created });
        setConfig(config.name);
      }
    };
    config();
  }, [isConfigSet]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {state === ProgramState.Loading ? ( 
            <Box sx={{ height: "100vh", display: "flex" }}>
              <LinearWithValueLabel progress={progress} />
            </Box>
        ) : (
          <Box sx={{ height: "100vh", display: "flex", px: 0, flexDirection: "column", overflowX: "hidden" }} bgcolor="dark">
            <Container sx={{ flexGrow: 1, display: "flex", p: 0, overflowX: "hidden" }}>
              <Routes>
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/" element={<PrintPage />} />
              </Routes>
            </Container>
            <Footer />
          </Box>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
