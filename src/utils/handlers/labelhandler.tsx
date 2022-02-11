import React, { useState } from "react";
import ReduxAccessor from "../../store/accessor";
import { IPC } from "../enums";
import InvokeHandler from "../invoke";
import { clamp, cleanXMLString, readFile } from "../tools";

const LabelHandler = () => {
  const { template, config, configs } = ReduxAccessor();
  const { invoke } = InvokeHandler();
  const regex = (key: string) => new RegExp(key, "g");

  const getConfig = (name: string) => configs.find((entry: Config) => entry.name === name);

  const handleMultiple = (line: any, value: string[]) => {
    if (value.length === 0) return "";
    let result = "";
    for (let i = 0; i < value.length; i++) {
      let data = line[value[i]];
      result += i === value.length - 1 ? data : `${data}, `;
    }
    return result;
  };

  const getLimit = (line: any, _config: Config) => {
    let qty = _config.keys.find((key: ConfigKey) => key.name === "Quantity");
    if (!qty) return 1;
    try {
      let line_qty = line[qty.value];
      let limit = parseInt(line_qty);
      return clamp(limit, 1, 10);
    } catch (err: any) {
      console.warn(err);
      return 1;
    }
  };

  const buildLabels = async (ifs_lines: any, singles: boolean, maxlength: boolean) => {
    let template_xml: XMLDocument | null = await ((await readFile(template || "")) as Promise<XMLDocument>);
    if (!template_xml || !config) return;
    let _config = getConfig(config);
    if (!_config) return;
    let label_xml: string = template_xml.toString();
    let _labels: string[] = [];
    for (let i = 0; i < ifs_lines.length; i++) {
      let line = ifs_lines[i];
      let limit = !singles ? 1 : getLimit(line, _config);
      for (let q = 0; q < limit; q++) {
        for (let j = 0; j < _config.keys.length; j++) {
          let configkey: ConfigKey = _config.keys[j];
          let value = configkey.multiple ? handleMultiple(line, configkey.value) : line[configkey.value];
          if (value) {
            if (configkey.name === "Quantity" && singles) value = 1;
            if (configkey.unit) value += ` ${configkey.unit}`;
            if ((value || "").toString().length > 20 && maxlength) value = `${value.substring(0, 20)}..`;
            label_xml = label_xml.replace(regex(configkey.key), value);
          }
        }
        _labels.push(label_xml);
        label_xml = template_xml.toString();
      }
    }
    return _labels;
  };

  const buildPreview = async (_labels: string[] | undefined) => {
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
  };

  const getAdjustments = (_adjustments: Adjustment[]) => {
    let singles = _adjustments.find((a: Adjustment) => a.name === "Singles");
    let groups = _adjustments.find((a: Adjustment) => a.name === "Singles");
    let maxlength = _adjustments.find((a: Adjustment) => a.name === "Singles");

    return { singles: singles?.value, groups: groups?.value, maxlength: maxlength?.value };
  };

  return { getAdjustments, buildLabels, buildPreview }
};

export default LabelHandler;
