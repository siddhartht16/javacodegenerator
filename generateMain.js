const fs = require("fs");
const utils = require("./utils");
const {
    CONTROLLERS_DIRECTORY,
    JSON_CONSTANTS,
    MODELS_DIRECTORY,
    OUTPUT_DIRECTORY,
    REPOSITORIES_DIRECTORY,
    SERVICES_DIRECTORY
} = require("./constants");
const templates = require("./templates");

const cleanUp = () => utils.removeDirectory(OUTPUT_DIRECTORY);

const createDirs = () => {
    utils.createDirectory(OUTPUT_DIRECTORY);
    utils.createDirectory(`${MODELS_DIRECTORY}`);
    utils.createDirectory(`${CONTROLLERS_DIRECTORY}`);
    utils.createDirectory(`${REPOSITORIES_DIRECTORY}`);
    utils.createDirectory(`${SERVICES_DIRECTORY}`);
};

const parseJSONFile = jsonFilePath => {
    try {
        const dataBuffer = fs.readFileSync(jsonFilePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        utils.handleError(e, `Input JSON File does not exists.`);
    }
};

const generateModelFile = itemJSON => {
    const className = itemJSON[JSON_CONSTANTS.NAME];
    utils.logMessage(`Start processing for ${className}`);
    const accessModifier = itemJSON[JSON_CONSTANTS.ACCESS_MODIFIER];
    const fields = itemJSON[JSON_CONSTANTS.FIELDS];

    const classNameCapitalized = utils.capitalizeFirstLetter(className);
    const classNameStr = templates.classNameTemplate(accessModifier, className);

    const fieldsStr = fields
        .map(field =>
            templates.fieldTemplate(
                field[JSON_CONSTANTS.ACCESS_MODIFIER],
                field[JSON_CONSTANTS.TYPE],
                field[JSON_CONSTANTS.NAME]
            )
        )
        .join("\n");

    const getsetStr = fields
        .map(field => {
            const res = [];
            res.push(templates.getMethodTemplate(field.type, field.name));
            res.push(templates.setMethodTemplate(field.type, field.name));
            return res.join("");
        })
        .join("\n");

    const result = [classNameStr];
    result.push(` { \n`);
    result.push(fieldsStr);
    result.push("\n");
    result.push(getsetStr);
    result.push("\n");
    result.push(" } ");

    const filePath = `${MODELS_DIRECTORY}/${classNameCapitalized}.java`;
    utils.createFile(filePath, result.join(""));
    utils.logSuccessMessage(`End processing for ${className}`);
    // return result.join("");
};

const processJSON = inputJson => {
    const classes = inputJson[JSON_CONSTANTS.CLASSES];

    // Generate respective files for each class
    classes.forEach(classItem => {
        generateModelFile(classItem);
    });
};

const generate = jsonFilePath => {
    const jsonObj = parseJSONFile(jsonFilePath);
    cleanUp();
    createDirs();
    processJSON(jsonObj);
};

module.exports = {
    generate
};
