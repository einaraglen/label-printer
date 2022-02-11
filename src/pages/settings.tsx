import SwipeableViews from "react-swipeable-views";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ConfigList from "../components/settings/configlist";
import ConfigEditor from "../components/settings/configeditor";
import { Helmet } from "react-helmet";
import ReduxAccessor from "../store/accessor";
import { clamp, parseIFSPage } from "../utils/tools";
import KeyEditor from "../components/settings/keyeditor";
import ConfigHandler from "../utils/handlers/confighandler";

const SettingsPage = () => {
  const [index, setIndex] = useState(0);
  const [IFS, setIFS] = useState<string | null>(null);
  const { filepath } = ReduxAccessor();
  const [selected, setSelected] = useState<Config | null>(null);
  const [configkey, setConfigkey] = useState<ConfigKey | null>(null);
  const { updateAccessorOfKey } = ConfigHandler();

  const handleChangeIndex = (_index: number) => {
    setIndex(_index);
  };

  const navigate = (index: number = 1) => setIndex(index);

  const handleUpdateAccessor = async (payload: ConfigKey) => {
    if (!selected) return;
    await updateAccessorOfKey(selected.name, payload);
  };
  useEffect(() => {
    if (!selected || !configkey) return;
    let keys = [...selected.keys];
    let index = keys.findIndex((key: ConfigKey) => key.name === configkey.name);
    if (index === -1) return;
    keys[index] = configkey;
    let config = {
      ...selected,
      keys,
    };
    setSelected(config);
  }, [configkey]);

  useEffect(() => {
    setIFS(parseIFSPage(filepath) ?? "No File Found");
  }, [filepath]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflowX: "hidden" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Settings`}</title>
      </Helmet>
      <SwipeableViews axis={"x"} index={clamp(index, 0, 2)} threshold={2} onChangeIndex={handleChangeIndex}>
        <ConfigList {...{ navigate, setSelected }} />
        <ConfigEditor {...{ setConfigkey, navigate, selected }} />
        <KeyEditor {...{ configkey, selected, navigate, handleUpdateAccessor, setConfigkey }} />
      </SwipeableViews>
    </Box>
  );
};

export default SettingsPage;
