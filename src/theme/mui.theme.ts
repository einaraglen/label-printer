import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";

const MuiTheme = () => {
  const theme: any = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          root: {
            position: "relative",
            marginTop: "100px",
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "#0288d1",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            colorTextSecondary: {
              //color: "#29b6f6",
              color: "hsl(0, 0%, 86%)",
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            padding: "0px",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
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
      },
      MuiAccordionSummary: {
        styleOverrides: {
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
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "0.7rem",
            color: "hsl(0, 0%, 86%)",
            backgroundColor: "hsl(215, 28%, 18%)",
            boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
          },
        },
      },
      MuiList: {
        styleOverrides: {
          padding: {
            paddingTop: "0px",
            paddingBottom: "0px",
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
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
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            color: "hsl(0, 0%, 96%)",
          },
          secondary: {
            color: "hsl(0, 0%, 66%)",
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: "hsl(0, 0%, 86%)",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: "hsl(0, 0%, 86%)",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: "hsl(215, 28%, 18%)",
            boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
            color: "hsl(0, 0%, 86%)",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&$selected, &$selected:hover, &$selected:focus": {
              backgroundColor: "primary.dark",
            },
          },
        },
      },
    },
    typography: {
      htmlFontSize: 20,
    },
    palette: {
      mode: 'dark',
      ...palette
    }
  });

  return { theme };
};

export default MuiTheme;
