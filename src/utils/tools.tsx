const { XMLParser } = window.require("fast-xml-parser");
const parser = new XMLParser();

const fs = window.require("fs");
const path = window.require("path");

export const parseFile = async (filepath: string) => {
  try {
    let raw = await readFile(filepath);
    let parsed = parser.parse(raw);
    let rows = parsed.Table.Row;
    return !rows.length ? [rows] : [...rows];
  } catch (err: any) {
    console.warn(err);
    return null;
  }
};

//makes our file reading async and easy to use
export const readFile = async (path: string) => {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (err: any) {
    console.warn(path, err);
    return null;
  }
};

export const parseFilename = (filepath: string) => {
  return path.parse(filepath).base;
};

export const parseIFSPage = (filePath: any) => {
  //get our capital letter words into an array ["Customer", "Order"]
  let words = path
    .parse(filePath)
    .base.toString()
    .match(/[A-Z][a-z]+/g);
  if (!words) return null;
  let configName = "";
  //build the name
  for (let i = 0; i < words.length; i++) {
    configName += words[i];
  }
  return configName;
};

export const clamp = (value: number, min: number = -Infinity, max: number = Infinity) => {
  return Math.min(Math.max(value, min), max);
};

export const cleanXMLString = (xml: any) => {
  //remove all space between tags
  return xml.replace(/\s*</g, "<");
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
