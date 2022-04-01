import { Grid, Typography, Box } from "@mui/material";
import React from "react";
import packageJson from "../../package.json";
import ReduxAccessor from "../store/accessor";
import PersonIcon from '@mui/icons-material/Person';

const Footer = () => {
  const { username } = ReduxAccessor();
  
  return (
    <Grid container columns={3} className="unselectable" sx={{ position: "fixed", bottom: 0, left: 0, right: 0, backdropFilter: "blur(5px)", py: 0.5, px: 2 }}>
      <Grid item xs={1}>
        <Typography variant="subtitle1" display="block" textAlign="left" gutterBottom fontWeight={600} color="gray">
          {`Created by ${packageJson.author}`}
        </Typography>
      </Grid>
      <Grid item xs={1} >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
        <PersonIcon sx={{ mr: 0.5 }} />
        <Typography variant="subtitle1" display="block" gutterBottom fontWeight={600} color="white">
          {`${username || ""}`}
        </Typography>
        </Box>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="subtitle1" display="block" textAlign="right" gutterBottom fontWeight={600} color="gray">
          {`v${packageJson.version}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
