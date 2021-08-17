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
            MuiCheckbox: {
                root: {
                    color: "#0288d1"
                }
            },
            MuiTypography: {
                colorTextSecondary: {
                    color: "#29b6f6",
                },
            },
            MuiAccordionDetails: {
                root: {
                    padding: "0px"
                }
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
            MuiButtonBase: {
                root: {
                    curson: "default",
                }
            },
            MuiAccordionSummary: {
                root: {
                    curson: "default",
                    backgroundColor: "hsl(215, 28%, 14%)",
                    borderBottom: "1px solid rgba(0, 0, 0, .2)",
                    marginBottom: -1,
                    minHeight: 30,
                   "&$expanded": {
                        minHeight: 30,
                    },
                },
                content: {
                    curson: "default",
                    margin: "7px 0",
                    "&$expanded": {
                        margin: "7px 0",
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
                    paddingBottom: "0px"
                }
            },
            MuiListItem: {
                root: {
                    paddingTop: "0px",
                    paddingBottom: "0px"
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

    const [template, setTemplate] = React.useState("");
    const [printer, setPrinter] = React.useState("");
    const [isTemplateGood, setIsTemplateGood] = React.useState(true);
    const [buttonText, setButtonText] = React.useState("Print");
    const [currentPath, setCurrentPath] = React.useState("");

    const testPaths = [
        "CustomerOrderS16112 210804-110500.xml",
        "InventoryPartInStock 210802-155209.xml",
        "PurchaseOrder629195 210803-141357.xml",
        "InventoryPartInStock 210812-124414.xml",
        "MaterialTransferRequisitions 210817-115842.xml"
    ];

    //this will be accessable from all the components that import Context variablex
    state = {
        theme: theme,
        value: {
            template: template,
            printer: printer,
            isTemplateGood: isTemplateGood,
            buttonText: buttonText,
            currentPath: currentPath,
            test: testPaths[3],
        },
        method: {
            setTemplate,
            setPrinter,
            isTemplateGood,
            setIsTemplateGood,
            setButtonText,
            setCurrentPath,
        },
    };

    return <Context.Provider value={state}>{children}</Context.Provider>;
};

//import and de-structure with React.useContext(-- context variable --)
export const Context = React.createContext(state);
//wrap Around App
export default State;
