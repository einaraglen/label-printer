import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import TemplatesList from "../components/templates/templatelist";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage } from "../utils/tools";

const Templates = () => {
  const [IFS, setIFS] = useState<string>("");
  const { filepath } = ReduxAccessor();

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found");
  }, []);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflow: "hidden" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS} | Templates`}</title>
      </Helmet>
      <TemplatesList />
    </Box>
  );
};

export default Templates;
