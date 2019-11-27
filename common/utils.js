const fs = require("fs");
const rimraf = require("rimraf");
const chalk = require("chalk");
const ejs = require("ejs");
const { startCase, toLower, isEmpty } = require("lodash");
const constants = require("./constants");

const removeDirectory = dir_name => rimraf.sync(dir_name);

const cleanUp = () => removeDirectory(constants.OUTPUT_DIRECTORY);

const createDirectory = dir_name => {
    if (!fs.existsSync(dir_name)) {
        fs.mkdirSync(dir_name);
    }
};

const createFile = (path, contents) => {
    fs.writeFileSync(path, contents);
};

const generateFileUsingEJS = (templateFile, filename, filepath, data) => {
    logMessage(`Start processing for ${filename}`);
    const dataObj = {};
    dataObj[constants.TEMPLATE_PLACEHOLDERS.CLASS_OBJECT] = data;
    ejs.renderFile(templateFile, dataObj, {}, function(err, str) {
        // console.log(str);
        createFile(filepath, str);
        logSuccessMessage(`End processing for ${filename}`);
    });
};

const getJSONData = jsonFilePath => {
    const dataBuffer = fs.readFileSync(jsonFilePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
};

const getJavaFileName = filename => `${filename}.java`;

const getControllerFilesPath = packageName =>
    `${constants.OUTPUT_DIRECTORY}/${packageName}/${constants.CONTROLLERS_DIRECTORY}/`;

const getModelFilesPath = packageName => `${constants.OUTPUT_DIRECTORY}/${packageName}/${constants.MODELS_DIRECTORY}/`;

const getRepositoryFilesPath = packageName =>
    `${constants.OUTPUT_DIRECTORY}/${packageName}/${constants.REPOSITORIES_DIRECTORY}/`;

const getServiceFilesPath = packageName =>
    `${constants.OUTPUT_DIRECTORY}/${packageName}/${constants.SERVICES_DIRECTORY}/`;

const handleError = (error, message) => {
    logError(message);
    throw error;
};

const logMessage = message => console.log(chalk.blue(message));
const logSuccessMessage = message => console.log(chalk.green(message));
const logError = message => console.log(chalk.inverse.red(message));

const getKeyValueFromJSON = (jsonObject, key, defaultValue = ``) => {
    if (isEmpty(jsonObject)) return defaultValue;
    return key && key in jsonObject ? jsonObject[key] : defaultValue;
};

const getTypeValue = type => {
    return type && type.toUpperCase() in constants.TYPE_MAPPING ? constants.TYPE_MAPPING[type.toUpperCase()] : type;
};

const getBoxTypeValue = type => {
    return type && type.toUpperCase() in constants.BOX_TYPE_MAPPING
        ? constants.BOX_TYPE_MAPPING[type.toUpperCase()]
        : type;
};

const getDataTypeValue = type => {
    return type && type.toUpperCase() in constants.DATA_TYPE_MAPPING
        ? constants.DATA_TYPE_MAPPING[type.toUpperCase()]
        : type;
};

const getCollectionTypeValue = type => {
    return type && type.toUpperCase() in constants.COLLECTION_TYPE_MAPPING
        ? constants.COLLECTION_TYPE_MAPPING[type.toUpperCase()]
        : type;
};

const getMapTypeValue = type => {
    return type && type.toUpperCase() in constants.MAP_TYPE_MAPPING
        ? constants.MAP_TYPE_MAPPING[type.toUpperCase()]
        : type;
};

const getAccessModifierValue = accessModifier => {
    return accessModifier && accessModifier.toUpperCase() in constants.ACCESS_MODIFIER_MAPPING
        ? constants.ACCESS_MODIFIER_MAPPING[accessModifier.toUpperCase()]
        : accessModifier;
};

const capitalizeFirstLetter = input => startCase(toLower(input));

const getRelationShipsObject = (className, relationShips = {}) => {
    return className && className.toLowerCase() in relationShips ? relationShips[className.toLowerCase()] : [];
};

module.exports = {
    removeDirectory,
    createDirectory,
    cleanUp,
    createFile,
    generateFileUsingEJS,
    getJSONData,
    getJavaFileName,
    getControllerFilesPath,
    getModelFilesPath,
    getRepositoryFilesPath,
    getServiceFilesPath,
    handleError,
    logError,
    logMessage,
    logSuccessMessage,
    getKeyValueFromJSON,
    getTypeValue,
    getBoxTypeValue,
    getDataTypeValue,
    getCollectionTypeValue,
    getMapTypeValue,
    getAccessModifierValue,
    capitalizeFirstLetter,
    getRelationShipsObject
};
