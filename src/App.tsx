import React, { useEffect } from "react";
import MuiTheme from "./theme/mui.theme";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "./store/store";
import PrintPage from "./pages/print";
import SettingsPage from "./pages/settings";
import "./app.css";
import TopBar from "./components/topbar";
import { Box, Container } from "@mui/material";
import Footer from "./components/footer";
import { IPC } from "./utils/handletypes";
import CssBaseline from '@mui/material/CssBaseline';

const { ipcRenderer } = window.require("electron");

const App = () => {
  const { theme } = MuiTheme();

  /*React.useEffect(() => {
    //guard setup
    let isMounted = true;
    //check to see if DYMO is connected, and that the endpoint 127.0.0.1 is working
    const getDYMOStatus = async () => {
      let result = await ipcRenderer.invoke(IPC.DYMO_STATUS);
      console.log({ dymostatus: result });
    };

    //loads in the template file and stores it into state
    const getTemplate = async () => {
      let template = await ipcRenderer.invoke("get-template");
      console.log({ template });
    };

    //loads in the file-path and stores it into state
    const getFilePatha = async () => {
      let filePath = await ipcRenderer.invoke("get-file");
      console.log({ filePath });
    };

    //loads in the config and stores it into state
    const getConfig = async () => {
      let config = await ipcRenderer.invoke("get-config");
      console.log({ config });
    };

    //loads in the printers and printer-in-use, then stores it into state
    const getPrinters = async () => {
      //get all printers
      let result = await ipcRenderer.invoke("get-printers");
      console.log({ result });
      let printers = !result.Printers.length ? [result.Printers] : [...result.Printers];
      let printer = await ipcRenderer.invoke("get-printer");
      console.log({ printer });
    };

    //full useEffect execution!
    getDYMOStatus();
    getTemplate();
    getConfig();
    getPrinters();
    //prevent memory leak
    return () => {
      isMounted = false;
    };
  }, []);*/

  useEffect(() => {
    const getPrinters = async () => {
      //get all printers
      let result = await ipcRenderer.invoke(IPC.GET_PRINTERS);
      console.log({ result });
    };
    getPrinters()
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
          <Box sx={{ height: "100vh", display: "flex", px: 0, flexDirection: "column" }} bgcolor="dark">
            <TopBar />
            <Container sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<PrintPage />} />
              </Routes>
            </Container>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
