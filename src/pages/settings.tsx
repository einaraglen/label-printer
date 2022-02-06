import SwipeableViews from "react-swipeable-views";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import ConfigList from "../components/settings/configlist";
import ConfigEditor from "../components/settings/configeditor";
import { Helmet } from "react-helmet";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage } from "../utils/tools";
import KeyEditor from "../components/settings/keyeditor";

const config: Config[] = [
  {
    name: "Test1",
    number: {
      key: "_number",
      accessor: "PartNo",
    },
    description: {
      key: "_description",
      accessor: "PartNo",
    },
    info: {
      key: "_info",
      accessor: "PartNo",
    },
    quantity: {
      key: "_quantity",
      accessor: "PartNo",
    },
  },
  {
    name: "Test2",
    number: {
      key: "_number",
      accessor: "PartNo",
    },
  },
  {
    name: "Test3",
    number: {
      key: "_number",
      accessor: "PartNo",
    },
  },
  {
    name: "Test3",
    number: {
      key: "_number",
      accessor: "PartNo",
    },
  },
  {
    name: "Test3",
    number: {
      key: "_number",
      accessor: "PartNo",
    },
  },
];

const SettingsPage = () => {
  const [index, setIndex] = useState(0);
  const [IFS, setIFS] = useState<string>("");
  const { filepath } = ReduxAccessor();

  const handleChangeIndex = (_index: number) => {
    setIndex(_index);
  };

  const next = (index: number = 1) => setIndex(index);
  const back = (index: number = 0) => setIndex(index);

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found");
  }, []);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflow: "hidden" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS} | Settings`}</title>
      </Helmet>
      <SwipeableViews axis={"x"} index={index} onChangeIndex={handleChangeIndex}>
        <ConfigList {...{ config, next }} />
        <ConfigEditor config={config[0]} {...{ back, next }} />
        <KeyEditor configkey={config[0].number!} back={back} />
      </SwipeableViews>
    </Box>
  );
};

export default SettingsPage;
