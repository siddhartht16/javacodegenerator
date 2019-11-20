const fs = require("fs");
const rimraf = require("rimraf");
const chalk = require("chalk");
const pluralize = require("pluralize");
const _ = require("lodash");
const constants = require("./constants");

const removeDirectory = dir_name => rimraf.sync(dir_name);

const createDirectory = dir_name => {
    if (!fs.existsSync(dir_name)) {
        fs.mkdirSync(dir_name);
    }
};

const createFile = (path, contents) => {
    fs.writeFileSync(path, contents);
};

const handleError = (error, message) => {
    logError(message);
    throw error;
};

const logMessage = message => console.log(chalk.blue(message));
const logSuccessMessage = message => console.log(chalk.green(message));
const logError = message => console.log(chalk.inverse.red(message));

const getTypeValue = type => {
    return constants.TYPE_MAPPING[type.toLowerCase()];
};

const getAccessModifierValue = accessModifier => {
    return constants.ACCESS_MODIFIER_MAPPING[accessModifier.toLowerCase()];
};

const capitalizeFirstLetter = input => _.startCase(_.toLower(input));

const singularizeClassName = className => pluralize.singular(className);
const pluralizeClassName = className => pluralize.plural(className);

module.exports = {
    removeDirectory,
    createDirectory,
    createFile,
    handleError,
    logError,
    logMessage,
    logSuccessMessage,
    getTypeValue,
    getAccessModifierValue,
    capitalizeFirstLetter,
    singularizeClassName,
    pluralizeClassName
};
