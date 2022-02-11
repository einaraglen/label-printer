import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage, parseFile } from "../utils/tools";
import { Helmet } from "react-helmet";
import LabelCarousel from "../components/print/carousel";
import TopBar from "../components/print/topbar";
import Controls from "../components/print/controls";
import LabelHandler from "../utils/handlers/labelhandler";

const PrintPage = () => {
  const [IFS, setIFS] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { filepath, adjustments, status } = ReduxAccessor();
  const [images, setImages] = useState<string[]>([]);
  const { getAdjustments, buildLabels, buildPreview } = LabelHandler();

  //const _getAdjustments = React.useCallback((_adjustments: Adjustment[]) => getAdjustments(_adjustments), [getAdjustments])
  //const _buildLabels = React.useCallback((ifs_lines: any, singles: boolean) => buildLabels(ifs_lines, singles), [buildLabels])
  //const _buildPreview = React.useCallback((_labels: string[] | undefined) => buildPreview(_labels), [buildPreview])

  useEffect(() => {
    setIFS(parseIFSPage(filepath) ?? "No File Found");
    const parse = async () => {
      setIsLoading(true);
      if (!filepath) return;
      let { singles, groups, maxlength } = getAdjustments(adjustments);
      let ifs_lines = await parseFile(filepath as string);
      let _labels = await buildLabels(ifs_lines, singles);
      let _images = await buildPreview(_labels);
      setImages(_images);
      setIsLoading(false);
    };
    parse();
  }, [filepath, adjustments]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Print`}</title>
      </Helmet>
      <TopBar />
      {status.isFile ? <>
        <Box sx={{ height: "9.3rem", mt: 2, display: "flex" }}>{isLoading ? <CircularProgress sx={{ mx: "auto", my: "auto" }} /> : <LabelCarousel {...{ images }} />}</Box>
        <Box sx={{ height: "2.9rem", display: "flex" }}>
          <Controls />
        </Box>
      </> : null}
    </Box>
  );
};

export default PrintPage;
