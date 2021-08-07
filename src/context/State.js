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
    //Initiate states here
    //style overriding Material UI components
    const theme = createTheme({
        overrides: {
            MuiTooltip: {
                tooltip: {
                    fontSize: "0.7rem",
                    color: "hsl(0, 0%, 86%)",
                    backgroundColor: "hsl(215, 28%, 18%)",
                },
            },
            MuiListItem: {
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

    //this will be accessable from all the components that import Context variablex
    state = {
        theme: theme,
    };

    return <Context.Provider value={state}>{children}</Context.Provider>;
};

//import and de-structure with React.useContext(-- context variable --)
export const Context = React.createContext(state);
//wrap Around App
export default State;
