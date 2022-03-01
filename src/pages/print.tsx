import { Box, Typography } from "@mui/material";
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
import UsernameModal from "../components/username";

interface Props {
  open: boolean;
  setOpen: Function;
}

const Print = ({ open, setOpen }: Props) => {
  const [IFS, setIFS] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { filepath, adjustments, config, status, printer, setState, username } = ReduxAccessor();
  const [labels, setLabels] = useState<string[] | undefined>([]);
  const [images, setImages] = useState<string[]>([]);
  const { getAdjustments, buildLabels, buildPreview, buildData } = LabelHandler();
  const [index, setIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const { invoke } = InvokeHandler();
  const { addArchive } = FirebaseHandler();

  const resetPrintState = () => {
    setIndex(0);
    setState(ProgramState.Ready);
    setProgress(0);
  };

  const handlePrint = async () => {
    if (!labels) return;
    setState(ProgramState.Printing);
    let flag = false;
    let i = 0;
    while (i < labels.length) {
      await invoke(IPC.PRINT_LABEL, {
        args: { printer, labels: cleanXMLString(labels[index]) },
        // eslint-disable-next-line no-loop-func
        next: (data: any) => {
          console.log(data);
          if (!data) i = labels.length;
        },
        // eslint-disable-next-line no-loop-func
        error: (data: any) => {
          flag = true;
          i = labels.length;
          console.warn(data);
        },
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      i++;
      setProgress((100 / labels.length) * i);
      setIndex(i);
    }
    if (!flag)
      addArchive({
        username: username || "USER_MISSING",
        ifs_page: IFS || "IFS_PAGE_MISSING",
        label_count: labels.length,
        label_images: images,
      });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    resetPrintState();
  };

  useEffect(() => {
    setIFS(parseIFSPage(filepath) ?? "No File Found");
    const parse = async () => {
      setIsLoading(true);
      if (!filepath) return;
      let _labels, _images;
      try {
        let { count, singles, additional, maxlength, bundle, merge } = getAdjustments(adjustments);
        let ifs_lines = await parseFile(filepath as string);
        let _data: any = await buildData(ifs_lines, count, singles, additional, maxlength, bundle, merge);
        _labels = await buildLabels(_data, singles, additional, maxlength);
        _images = await buildPreview(_labels);
      } catch (err: any) {
        console.warn(err)
      }
      setLabels(_labels || []);
      setImages(_images || []);
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
        <Box sx={{ height: "9.3rem", mt: 2, display: "flex" }}>{isLoading ? <CircularProgress sx={{ mx: "auto", my: "auto" }} /> : <LabelCarousel {...{ images, index }} />}</Box>
      ) : (
        <Box sx={{ height: "9.3rem", display: "flex", mt: 2 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 500, mx: "auto", my: "auto", opacity: 0.5 }}>No File Found</Typography>
        </Box>
      )}
      <Box sx={{ height: "2.9rem", display: "flex" }}>
        <Controls {...{ handlePrint, progress }} />
      </Box>
      <UsernameModal open={!status.isUsername} />
    </Box>
  );
};

export default Print;
