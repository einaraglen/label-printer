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

export const getConfigName = (filePath) => {
    //get our capital letter words into an array ["Customer", "Order"]
    let words = path.parse(filePath).base.toString().match(/[A-Z][a-z]+/g);
    let configName = "";
    //build the name
    for (let i = 0; i < words.length; i++) {
        configName += words[i];
    }
    return configName;
}

//this is gonna helt alot with settings
export const fasterIndexOf = (arr, value) => {
    let index = Object.keys(arr).find((key) => {
        return arr[key] === value;
    })
    return index !== undefined ? index : -1;
}
