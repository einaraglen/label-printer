import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage, parseFile } from "../utils/tools";
import { Helmet } from 'react-helmet'

const PrintPage = () => {
    const [IFS, setIFS] = useState<string | null>(null);
    const { filepath } = ReduxAccessor();

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found")
    const parse = async () => {
      if (filepath) console.log(await parseFile(filepath));
    };
    parse();
  }, [filepath]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
        <Helmet>
          <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Print`}</title>
        </Helmet>
      <Button variant="outlined" sx={{ mx: 10 }}>
        Print
      </Button>
    </Box>
  );
};

export default PrintPage;
