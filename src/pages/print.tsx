import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage, parseFile, cleanXMLString } from "../utils/tools";
import { Helmet } from "react-helmet";
import LabelCarousel from "../components/print/carousel";
import TopBar from "../components/print/topbar";
import Controls from "../components/print/controls";
import LabelHandler from "../utils/handlers/labelhandler";
import InvokeHandler from "../utils/invoke";
import { IPC, ProgramState } from "../utils/enums";

const PrintPage = () => {
  const [IFS, setIFS] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { filepath, adjustments, status, printer, setState } = ReduxAccessor();
  const [labels, setLabels] = useState<string[] | undefined>([]);
  const [images, setImages] = useState<string[]>([]);
  const { getAdjustments, buildLabels, buildPreview } = LabelHandler();
  const [index, setIndex] = useState<number>(0);
  const { invoke } = InvokeHandler();

  const handlePrint = async () => {
    if (!labels) return;
    setState(ProgramState.Printing);
    let i = 0;
    while (i  < labels.length) {
      await invoke(IPC.PRINT_LABEL, {
        args: { printer, labels: cleanXMLString(labels[index]) },
        error: (data: any) => console.warn(data),
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      i++;
      setIndex(i)
    }
    setIndex(0)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setState(ProgramState.Ready)
  };

  useEffect(() => {
    setIFS(parseIFSPage(filepath) ?? "No File Found");
    const parse = async () => {
      setIsLoading(true);
      if (!filepath) return;
      let { singles, groups, maxlength } = getAdjustments(adjustments);
      let ifs_lines = await parseFile(filepath as string);
      let _labels = await buildLabels(ifs_lines, singles, maxlength);
      let _images = await buildPreview(_labels);
      setLabels(_labels);
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
      {status.isFile ? (
        <>
          <Box sx={{ height: "9.3rem", mt: 2, display: "flex" }}>{isLoading ? <CircularProgress sx={{ mx: "auto", my: "auto" }} /> : <LabelCarousel {...{ images, index }} />}</Box>
          <Box sx={{ height: "2.9rem", display: "flex" }}>
            <Controls {...{ handlePrint }} />
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default PrintPage;
