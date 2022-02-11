import { Container, Typography } from "@mui/material";
import React from "react";
import packageJson from "../../package.json";

const Footer = () => {
  return (
    <Container sx={{ position: "fixed", bottom: 0, backdropFilter: "blur(5px)", display: "flex", justifyContent: "space-between", py: 0.5 }}>
      <Typography variant="body1" display="block" gutterBottom fontWeight={600} color="gray">
        {`Created by ${packageJson.author}`}
      </Typography>
      <Typography variant="body1" display="block" gutterBottom fontWeight={600} color="gray">
        {`Version ${packageJson.version}`}
      </Typography>
    </Container>
  );
};

export default Footer;
