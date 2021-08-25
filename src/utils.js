/**
 * All multi-use helper methods here!
 */

const fs = window.require("fs");
const path = window.require("path");

//makes our file reading async and easy to use
export const readFile = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

export const isConfigGood = (config, usableProperties) => {
    //a blank config will work
    if (!config || !config[Object.keys(config)[0]]) return true;
    for (let property in config[Object.keys(config)[0]]) {
        if (usableProperties.indexOf(property) === -1) return false;
    }
    return true;
};

export const getConfigName = (filePath) => {
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

export const cleanXMLString = (xml) => {
    //remove all space between tags
    return xml.replace(/\s*</g, "<")
};

export const buildResponse = (valid = null, message, loading = false) => {
    let date = new Date();
    let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let text = loading ? "[Loading..] " : valid ? "[Success] " : "[Failure] ";
    return (
        <p>
            <span className={loading ? "loading" : valid ? "good" : "bad"}>
                {`${time} ${text}`}
            </span>
            {message}
        </p>
    );
};
