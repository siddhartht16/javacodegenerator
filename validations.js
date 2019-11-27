const fs = require("fs");
const utils = require("./utils");
const messages = require("./messages");
const { isEmpty } = require("lodash");

const validateClassName = className => (isEmpty(className) ? utils.handleError(messages.CLASS_NAME_REQUIRED) : ``);

const validateJSONFile = jsonFilePath => {
    try {
        const dataBuffer = fs.readFileSync(jsonFilePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        utils.handleError(e, messages.INVALID_JSON_FILE);
    }
};

module.exports = {
    validateClassName,
    validateJSONFile
};
