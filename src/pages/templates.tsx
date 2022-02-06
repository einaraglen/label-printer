import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import TemplatesList from "../components/templates/templatelist";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage } from "../utils/tools";

const Templates = () => {
  const [IFS, setIFS] = useState<string | null>(null);
  const { filepath } = ReduxAccessor();

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found");
  }, [filepath]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflow: "hidden" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Templates`}</title>
      </Helmet>
      <TemplatesList />
    </Box>
  );
};

export default Templates;
