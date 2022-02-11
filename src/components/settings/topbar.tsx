import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

interface Props {
    children: React.ReactNode
}

const TopBar = ({ children }: Props) => {
  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: "blur(5px)", borderBottomColor: "hsl(215, 28%, 14%)" }} elevation={4}>
      <Container>
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          {children}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
