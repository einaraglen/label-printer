import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const PrintPage = () => {   
    return (<Box sx={{ display: 'flex', flexGrow: 1 }}><Link to="/settings">Settings</Link></Box>)
}

export default PrintPage;