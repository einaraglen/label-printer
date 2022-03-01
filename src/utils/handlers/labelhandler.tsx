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
      result += i === value.length - 1 ? data : `${data} `;
    }
    return result;
  };

  const getLimit = (line: any, _config: Config) => {
    let qty = _config.keys.find((key: ConfigKey) => key.name === "Quantity");
    if (!qty) return 1;
    try {
      let key = Array.isArray(qty.value) ? qty.value[0] : qty.value;
      let line_qty = line[key];
      let limit = parseInt(line_qty);
      return clamp(limit, 1, 10);
    } catch (err: any) {
      console.warn(err);
      return 1;
    }
  };

  const handleValue = (value: any, configkey: ConfigKey | undefined, singles: boolean, additional: string, maxlength: boolean) => {
    if (!value) return "";
    if (!configkey) return value;
    if (configkey.name === "Quantity" && singles) value = 1;
    if (configkey.name === "Info" && additional) value = `${additional} - ${value}`;
    if (configkey.unit) value += ` ${configkey.unit}`;
    if (value.toString().length > 20 && maxlength) value = `${value.substring(0, 20)}..`;
    return value;
  };

  const buildLabels = async (data: any[], singles: boolean, additional: string, maxlength: boolean) => {
    if (!config) return;
    let _config = getConfig(config);
    if (!_config) return;
    let template_xml: XMLDocument | null = await ((await readFile(template || "")) as Promise<XMLDocument>);
    if (!template_xml || !config) return;
    let label_xml: string = template_xml.toString();
    let _labels: string[] = [];
    for (let i = 0; i < data.length; i++) {
      let keys = Object.keys(data[i]);
      for (let j = 0; j < keys.length; j++) {
        let configkey = _config.keys.find((c: ConfigKey) => c.key === keys[j]);
        label_xml = label_xml.replace(regex(keys[j]), handleValue(data[i][keys[j]], configkey, singles, additional, maxlength));
      }
      _labels.push(label_xml);
      label_xml = template_xml.toString();
    }
    return _labels;
  };

  const buildData = async (ifs_lines: any, count: number, singles: boolean, additional: string, maxlength: boolean, bundle: boolean, merge: boolean) => {
    if (!config) return;
    let _config = getConfig(config);
    if (!_config) return;
    let data = [];
    for (let i = 0; i < ifs_lines.length; i++) {
      let line = ifs_lines[i];
      let limit = !singles || !bundle ? count : getLimit(line, _config);
      let entry: any = {};
      for (let q = 0; q < limit; q++) {
        for (let j = 0; j < _config.keys.length; j++) {
          let configkey: ConfigKey = _config.keys[j];
          let value = configkey.multiple ? handleMultiple(line, configkey.value) : line[configkey.value];
          entry = { ...entry, [configkey.key]: value };
        }
        data.push(entry);
      }
    }
    if (bundle) return handleData(data, merge);
    return data;
  };

  interface IData {
    _Number: any;
    _Description: any;
    _Info: any;
    _Quantity: any;
  }

  const handleData = (data: IData[], merge: boolean) => {
    let result: IData[] = [];
    for (let i = 0; i < data.length; i++) {
      //advanced index search for mathing entry
      let index = result.findIndex((r: IData) => {
        let numbers = r._Number === data[i]._Number;
        let info1 = r._Info.toString();
        let info2 = data[i]._Info.toString();
        let projects = info1.split(" ")[0] === info2.split(" ")[0];
        return numbers && projects;
      });
      //build existing entry
      if (index > -1) {
        let match: IData = result[index];
        result[index] = {
          ...match,
          _Info: (match._Info += ` ${sliceInfo(data[i]._Info, 1, Infinity)}`),
          _Quantity: handleQuantities(match._Quantity, data[i]._Quantity, merge),
        };
      }
      //add new stem-entry
      else {
        let entry = data[i];
        result.push({
          ...entry,
        });
      }
    }
    return result;
  };

  const handleQuantities = (qty1: any, qty2: any, merge: boolean) => {
    if (!merge) return (qty1 += " " + qty2.toString());

    if (typeof qty1 === "string" || typeof qty2 === "string") {
      let temp = qty1.toString().split(" ");
      temp.pop();
      let result = temp.toString().replace(regex(","), " ");
      return `${result} ${qty2}`;
    }

    if (Number.isInteger(qty1) && Number.isInteger(qty2)) {
      return qty1 + qty2;
    }

    return `${qty1} ${qty2}`;
  };

  const sliceInfo = (info: any, from: number, to: number) => {
    let _info = info.toString().split(" ");
    if (_info.length < 2) return info;
    let temp = _info.slice(from, to);
    return temp.toString().replace(regex(","), " ");
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
      });
    }
    return images;
  };

  const getAdjustments = (_adjustments: Adjustment[]) => {
    let count = _adjustments.find((a: Adjustment) => a.name === "Label Count");
    let singles = _adjustments.find((a: Adjustment) => a.name === "Singles");
    let additional = _adjustments.find((a: Adjustment) => a.name === "Additional Info");
    let maxlength = _adjustments.find((a: Adjustment) => a.name === "Max Length");
    let bundle = _adjustments.find((a: Adjustment) => a.name === "Bundle");
    let merge = _adjustments.find((a: Adjustment) => a.name === "Merge Qty");

    return { count: count?.value, singles: singles?.value, additional: additional?.value, maxlength: maxlength?.value, bundle: bundle?.value, merge: merge?.value };
  };

  return { getAdjustments, buildLabels, buildPreview, buildData };
};

export default LabelHandler;
