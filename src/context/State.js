import React from "react";
import { createTheme } from "@material-ui/core/styles";

//Inits state variable that we pass to the app
let state = {};

/**
 * Creates a usable Context that can be accessed from any component in the app
 * using const state = React.useContext(Context); where Context variable is imported
 * From /context/State
 */
const State = ({ children }) => {
    //style overriding Material UI components
    const theme = createTheme({
        overrides: {
            MuiDrawer: {
                root: {
                    position: "relative",
                    marginTop: "100px"
                }
            },
            MuiCheckbox: {
                root: {
                    color: "#0288d1",
                },
            },
            MuiTypography: {
                colorTextSecondary: {
                    //color: "#29b6f6",
                    color: "hsl(0, 0%, 86%)",
                },
            },
            MuiAccordionDetails: {
                root: {
                    padding: "0px",
                },
            },
            MuiAccordion: {
                root: {
                    color: "hsl(0, 0%, 86%)",
                    width: "100%",
                    backgroundColor: "hsl(215, 28%, 16%)",
                    boxShadow: "none",
                    "&:not(:last-child)": {
                        borderBottom: 0,
                    },
                    "&:before": {
                        display: "none",
                    },
                    "&$expanded": {
                        margin: "auto",
                    },
                },
                expanded: {},
            },
            MuiAccordionSummary: {
                root: {
                    padding: "0px",
                    cursor: "default",
                    backgroundColor: "hsl(215, 28%, 14%)",
                    borderBottom: "1px solid rgba(0, 0, 0, .2)",
                    marginBottom: -1,
                    minHeight: 30,
                    "&$expanded": {
                        minHeight: 30,
                    },
                },
                content: {
                    padding: "7px 9px",
                    cursor: "default",
                    margin: "0px",
                    "&$expanded": {
                        margin: "0px",
                    },
                },
                expanded: {},
            },
            MuiTooltip: {
                tooltip: {
                    fontSize: "0.7rem",
                    color: "hsl(0, 0%, 86%)",
                    backgroundColor: "hsl(215, 28%, 18%)",
                    boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
                },
            },
            MuiList: {
                padding: {
                    paddingTop: "0px",
                    paddingBottom: "0px",
                },
            },
            MuiListItem: {
                root: {
                    "&$selected, &$selected:hover, &$selected:focus": {
                        backgroundColor: "hsl(215, 28%, 15%)",
                    },
                    paddingTop: "0px",
                    paddingBottom: "0px",
                },
                button: {
                    "&:hover": {
                        backgroundColor: "	hsl(215, 28%, 24%)",
                    },
                },
            },
            MuiListItemText: {
                root: {
                    color: "hsl(0, 0%, 86%)",
                },
                secondary: {
                    color: "#29b6f6",
                },
            },
            MuiFormLabel: {
                root: {
                    color: "hsl(0, 0%, 86%)",
                },
            },
            MuiInputBase: {
                root: {
                    color: "hsl(0, 0%, 86%)",
                },
            },
            MuiMenu: {
                paper: {
                    backgroundColor: "hsl(215, 28%, 18%)",
                    boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
                    color: "hsl(0, 0%, 86%)",
                },
            },
            MuiMenuItem: {
                root: {
                    "&$selected, &$selected:hover, &$selected:focus": {
                        backgroundColor: "hsl(215, 28%, 15%)",
                    },
                },
            },
        },
        typography: {
            htmlFontSize: 20,
        },
        palette: {
            primary: {
                light: "#81d4fa",
                main: "#29b6f6",
                dark: "#0288d1",
                contrastText: "hsl(120, 4%, 91%)",
            },
            secondary: {
                light: "hsl(355, 52%, 82%)",
                main: "hsl(355, 92%, 62%)",
                dark: "hsl(355, 52%, 32%)",
                contrastText: "hsl(120, 4%, 91%)",
            },
        },
    });

    const testPaths = [
        "CustomerOrderS16112 210804-110500.xml",
        "InventoryPartInStock 210802-155209.xml",
        "PurchaseOrder629195 210803-141357.xml",
        "InventoryPartInStock 210812-124414.xml",
        "MaterialTransferRequisitions 210817-115842.xml",
        "MaterialTransferRequisitions 210824-100806.xml"
    ];

    //shared variables
    const [template, setTemplate] = React.useState("");
    const [config, setConfig] = React.useState({});
    const [currentPath, setCurrentPath] = React.useState("");
    //devtools
    const [output, setOutput] = React.useState([]);
    //extras
    const [printer, setPrinter] = React.useState("");
    const [isTemplateGood, setIsTemplateGood] = React.useState(true);
    const [buttonText, setButtonText] = React.useState("Print");
    const [allPicked, setAllPicked] = React.useState(true);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [dymoError, setDymoError] = React.useState(false);
    const [noFileFound, setNoFileFound] = React.useState(false);
    const [testPath, setTestPath] = React.useState(testPaths[2]);
    //set to false before build
    const inDevMode = true;

    const usableProperties = [
        "_Number",
        "_Description",
        "_Info",
        "_Extra",
        "_Quantity",
    ];

    const setTest = (index) => {
        setTestPath(testPaths[index]);
    };

    const handleFileResult = (result) => {
        if (!result) {
            if (inDevMode) 
                return result = !result
                    ? `./src/test/${testPath}`
                    : result;
            setNoFileFound(true);
            return null;
        }
    }

    //this will be accessable from all the components that import Context variablex
    state = {
        theme: theme,
        value: {
            template: template,
            printer: printer,
            isTemplateGood: isTemplateGood,
            buttonText: buttonText,
            currentPath: currentPath,
            test: testPath,
            allPicked: allPicked,
            settingsOpen: settingsOpen,
            config: config,
            dymoError: dymoError,
            noFileFound: noFileFound,
            inDevMode: inDevMode,
            usableProperties: usableProperties,
            output: output,
        },
        method: {
            setTemplate,
            setPrinter,
            isTemplateGood,
            setIsTemplateGood,
            setButtonText,
            setCurrentPath,
            setAllPicked,
            setSettingsOpen,
            setConfig,
            setDymoError,
            setNoFileFound,
            setTest,
            handleFileResult,
            setOutput,
        },
    };

    return <Context.Provider value={state}>{children}</Context.Provider>;
};

//import and de-structure with React.useContext(-- context variable --)
export const Context = React.createContext(state);
//wrap Around App
export default State;
