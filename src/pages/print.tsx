import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage, parseFile, readFile, cleanXMLString } from "../utils/tools";
import { Helmet } from "react-helmet";
import InvokeHandler from "../utils/invoke";
import { IPC } from "../utils/enums";
import LabelCarousel from "../components/print/carousel";
import TopBar from "../components/print/topbar";
import Controls from "../components/print/controls";

const PrintPage = () => {
  const [IFS, setIFS] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { filepath, template, config, configs } = ReduxAccessor();
  const { invoke } = InvokeHandler();
  const regex = (key: string) => new RegExp(key, "g");
  const [images, setImages] = useState<string[]>([]);

  const getConfig = React.useCallback((name: string) => configs.find((entry: Config) => entry.name === name), [configs]);

  const handleMultiple = React.useCallback((line: any, value: string[]) => {
    if (value.length === 0) return "";
    let result = "";
    for (let i = 0; i < value.length; i++) {
      let data = line[value[i]];
      result += i === value.length - 1 ? data : `${data}, `;
    }
    return result;
  }, []);

  const buildLabels = React.useCallback(
    async (ifs_lines) => {
      let template_xml: XMLDocument = await ((await readFile(template)) as Promise<XMLDocument>);
      if (!config) return;
      let _config = getConfig(config);
      if (!_config) return;
      let label_xml: string = template_xml.toString();
      let _labels: string[] = [];
      for (let i = 0; i < ifs_lines.length; i++) {
        let line = ifs_lines[i];
        for (let j = 0; j < _config.keys.length; j++) {
          let configkey: ConfigKey = _config.keys[j];
          let value = configkey.multiple ? handleMultiple(line, configkey.value) : line[configkey.value];
          if (configkey.unit) value += ` ${configkey.unit}`;
          if (value.toString().length > 20) value = `${value.substring(0,20)}..`
          label_xml = label_xml.replace(regex(configkey.key), value);
        }
        _labels.push(label_xml);
        label_xml = template_xml.toString();
      }
      return _labels;
    },
    [config, getConfig, template, handleMultiple]
  );

  const buildPreview = React.useCallback(async (_labels) => {
    if (!_labels) return [];
    let images: string[] = [];
    for (let i = 0; i < _labels.length; i++) {
      //fix for xml error "Line 1 containes no data" removes all space between tags
      let xml = cleanXMLString(_labels[i]);
      await invoke(IPC.IMAGE_PREVIEW, {
        args: xml,
        next: (data: any) => {
          let image = data.image.replace(/"/g, "");
          images.push(image);
        },
        error: (err: string) => console.log(err),
      });
    }
    return images;
  }, [invoke]);

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found");
    const parse = async () => {
      setIsLoading(true);
      if (!filepath) return;
      let ifs_lines = await parseFile(filepath);
      let _labels = await buildLabels(ifs_lines);
      let _images = await buildPreview(_labels);
      setImages(_images);
      setIsLoading(false);
    };
    parse();
  }, [filepath, buildLabels]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Print`}</title>
      </Helmet>
      <TopBar />
      <Box sx={{ height: "9.3rem", mt: 2, display: "flex" }}>{isLoading ? <CircularProgress sx={{ mx: "auto", my: "auto" }} /> : <LabelCarousel {...{ images }} />}</Box>
      <Box sx={{ height: "2.9rem", display: "flex" }}>
        <Controls />
      </Box>
    </Box>
  );
};

export default PrintPage;
