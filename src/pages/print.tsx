import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReduxAccessor from "../store/accessor";
import { parseIFSPage, parseFile, readFile, cleanXMLString } from "../utils/tools";
import { Helmet } from "react-helmet";
import InvokeHandler from "../utils/invoke";
import { IPC } from "../utils/enums";
import ConfigHandler from "../utils/handlers/confighandler";
import LabelCarousel from "../components/print/carousel";

const PrintPage = () => {
  const [IFS, setIFS] = useState<string | null>(null);
  const { filepath, setConfigs, template, config, configs } = ReduxAccessor();
  const { invoke } = InvokeHandler();
  const { checkForExistingConfig } = ConfigHandler();
  const regex = (key: string) => new RegExp(key, "g");
  const [labels, setLabels] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const getConfig = React.useCallback(
    (name: string) => {
      return configs.find((entry: Config) => entry.name === name);
    },
    [configs]
  );

  const buildLabels = React.useCallback(
    async (ifs_lines) => {
      let template_xml = await readFile(template);
      if (!config) return;
      let _config = getConfig(config);
      if (!_config) return;
      let label_xml = template_xml;
      let _labels: string[] = [];
      for (let i = 0; i < ifs_lines.length; i++) {
        let line = ifs_lines[i];
        for (let j = 0; j < _config.keys.length; j++) {
          let key = _config.keys[j];
          let value = line[key.value];
          //(label_xml as XMLDocument).toString().replace(regex(key.key), value);
        }
        _labels.push((label_xml as XMLDocument).toString());
        label_xml = template_xml;
      }
      return _labels;
    },
    [config, getConfig, template]
  );

  const buildPreview = React.useCallback(async (_labels) => {
    if (!_labels) return []
    let images: string[] = [];
    for (let i = 0; i < _labels.length; i++) {
      //fix for xml error "Line 1 containes no data" removes all space between tags
      let xml = cleanXMLString(_labels[i]);
      console.log({xml})
      await invoke(IPC.IMAGE_PREVIEW, {
        args: xml,
        next: (data: any) => {
          let image = data.image.replace(/"/g, "");
          console.log({data});
          images.push(image);
        },
        error: (err: string) => console.log(err),
      });
    }
    return images;
  }, []);

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found");
    const parse = async () => {
      if (!filepath) return;
      let ifs_lines = await parseFile(filepath);
      let _labels = await buildLabels(ifs_lines);
      let _images = await buildPreview(_labels);
      setImages(_images);
    };
    parse();
  }, [filepath, buildLabels]);

  const handleReset = async () => {
    setConfigs([]);
    await invoke(IPC.SET_CONFIGS, {
      args: JSON.stringify([]),
      next: (data: any) => {
        console.log({ data });
      },
    });
  };

  const handleLoad = async () => {
    await invoke(IPC.GET_CONFIGS, {
      args: JSON.stringify([]),
      next: (data: any) => {
        console.log(JSON.parse(data.configs));
      },
    });

    let match = await checkForExistingConfig(parseIFSPage(filepath) ?? "");
    console.log({ match });
  };
  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Print`}</title>
      </Helmet>
      <img style={{ height: "8rem" }} alt="label preview" src={`data:image/png;base64,${images[0]}`} />
      <LabelCarousel {...{ images }} />
      <Button onClick={handleReset} variant="outlined" sx={{ mx: 10, my: "auto" }}>
        Reset Configs
      </Button>
    </Box>
  );
};

export default PrintPage;
