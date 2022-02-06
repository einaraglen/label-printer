import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ReduxAccessor from "../store/accessor";

const PrintPage = () => {  
    const { status } = ReduxAccessor();
    
    useEffect(() => {
        console.log(status)
    }, [status]);
    
    return (<Box sx={{ display: 'flex', flexGrow: 1 }}><Link to="/settings">Settings</Link></Box>)
}

export default PrintPage;