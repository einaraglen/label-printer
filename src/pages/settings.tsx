import SwipeableViews from "react-swipeable-views";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ConfigList from "../components/settings/configlist";
import ConfigEditor from "../components/settings/configeditor";
import { Helmet } from "react-helmet";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage } from "../utils/tools";
import KeyEditor from "../components/settings/keyeditor";
import ConfigHandler from "../utils/handlers/confighandler";

const SettingsPage = () => {
  const [index, setIndex] = useState(0);
  const [IFS, setIFS] = useState<string | null>(null);
  const { filepath, configs } = ReduxAccessor();
  const [selected, setSelected] = useState<Config | null>(null);
  const [key, setKey] = useState<ConfigKey | null>(null);
  const [objectkey, setObjectkey] = useState<string>("");
  const { updateAccessorOfKey } = ConfigHandler();

  const handleChangeIndex = (_index: number) => {
    setIndex(_index);
  };

  const next = (index: number = 1) => setIndex(index);
  const back = (index: number = 0) => setIndex(index);

  const handleUpdateAccessor = async (payload: any) => {
    if (!selected) return;
    await updateAccessorOfKey(selected.name, payload)
  }

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found");
  }, [filepath]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflow: "hidden" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Settings`}</title>
      </Helmet>
      <SwipeableViews axis={"x"} index={index} onChangeIndex={handleChangeIndex}>
        <ConfigList {...{ configs, next, setSelected }} />
        <ConfigEditor config={selected} {...{ back, next, setKey, setObjectkey }} />
        <KeyEditor configkey={key} selected={selected} back={back} handleUpdateAccessor={handleUpdateAccessor} objectkey={objectkey} />
      </SwipeableViews>
    </Box>
  );
};

export default SettingsPage;
