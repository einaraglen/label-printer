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
import FirebaseHandler from "../utils/handlers/firebaseHandler";

interface Props {
  open: boolean;
  setOpen: Function;
}

const Print = ({ open, setOpen }: Props) => {
  const [IFS, setIFS] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { filepath, adjustments, config, status, printer, setState } = ReduxAccessor();
  const [labels, setLabels] = useState<string[] | undefined>([]);
  const [images, setImages] = useState<string[]>([]);
  const { getAdjustments, buildLabels, buildPreview } = LabelHandler();
  const [index, setIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const { invoke } = InvokeHandler();
  const { addArchive } = FirebaseHandler();

  const handlePrint = async () => {
    if (!labels) return;
    setState(ProgramState.Printing);
    addArchive("einar.aglen99@gmail.com", IFS || "Missing IFS Page", images.length, images)
    let i = 0;
    while (i  < labels.length) {
      await invoke(IPC.PRINT_LABEL, {
        args: { printer, labels: cleanXMLString(labels[index]) },
        // eslint-disable-next-line no-loop-func
        next: (data: any) => {
          if (!data) i = labels.length;
        },
        // eslint-disable-next-line no-loop-func
        error: (data: any) => {
          i = labels.length;
          console.warn(data)
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      i++;
      setProgress((100 / labels.length) * i)
      setIndex(i)
    }
    setIndex(0)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setState(ProgramState.Ready)
    setProgress(0)
  };

  useEffect(() => {
    setIFS(parseIFSPage(filepath) ?? "No File Found");
    const parse = async () => {
      setIsLoading(true);
      if (!filepath) return;
      let { count, singles, groups, additional, maxlength } = getAdjustments(adjustments);
      let ifs_lines = await parseFile(filepath as string);
      let _labels = await buildLabels(ifs_lines, count, singles, additional, maxlength);
      let _images = await buildPreview(_labels);
      setLabels(_labels);
      setImages(_images);
      setIsLoading(false);
    };
    parse();
  }, [adjustments, filepath, config]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Print`}</title>
      </Helmet>
      <TopBar {...{ setOpen }} />
      {status.isFile ? (
        <>
          <Box sx={{ height: "9.3rem", mt: 2, display: "flex" }}>{isLoading ? <CircularProgress sx={{ mx: "auto", my: "auto" }} /> : <LabelCarousel {...{ images, index }} />}</Box>
          <Box sx={{ height: "2.9rem", display: "flex" }}>
            <Controls {...{ handlePrint, progress }} />
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default Print;
