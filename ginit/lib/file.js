/**
 * get current working directory
 * check if .git is already initialized
 */

const fs = require("fs");
const path = require("path");

module.exports = {

    // get current working directory 
    getCurrentDirectoryBase : () => {
        return path.basename(process.cwd())
    }, 


    // check if a file exist by passing in the name
    // will be used to test if a file like '.git' exist
    directoryExists: (filePath) => {
        return fs.existsSync(filePath)
    }
}