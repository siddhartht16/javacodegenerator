const fs = require("fs");
const ejs = require("ejs");
const utils = require("./utils");
const {
    CONTROLLERS_DIRECTORY,
    JSON_CONSTANTS,
    MODELS_DIRECTORY,
    OUTPUT_DIRECTORY,
    REPOSITORIES_DIRECTORY,
    SERVICES_DIRECTORY,
    TEMPLATE_FILE_PATH_MAPPING
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

const generateModelFileUsingStringTemplates = itemJSON => {
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

const generateModelFile = itemJSON => {
    const className = itemJSON[JSON_CONSTANTS.NAME];
    const accessModifier = itemJSON[JSON_CONSTANTS.ACCESS_MODIFIER];
    const fields = itemJSON[JSON_CONSTANTS.FIELDS];
    const methods = itemJSON[JSON_CONSTANTS.METHODS];

    const classNameCapitalized = utils.capitalizeFirstLetter(className);
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

    const defaultConstructorStr = templates.defaultConstructorTemplate(classNameCapitalized);
    const paramConstructorStr = templates.paramConstructorTemplate(classNameCapitalized, fields);

    const methodsStr = methods
        .map(method =>
            templates.methodTemplate(
                method[JSON_CONSTANTS.NAME],
                method[JSON_CONSTANTS.ACCESS_MODIFIER],
                method[JSON_CONSTANTS.RETURN_TYPE],
                method[JSON_CONSTANTS.PARAMS]
            )
        )
        .join("\n");

    const classInfo = {};
    classInfo[JSON_CONSTANTS.NAME] = classNameCapitalized;
    classInfo[JSON_CONSTANTS.ACCESS_MODIFIER] = accessModifier;
    classInfo[JSON_CONSTANTS.FIELDS] = fieldsStr;
    classInfo[JSON_CONSTANTS.DEFAULT_CONSTRUCTOR] = defaultConstructorStr;
    classInfo[JSON_CONSTANTS.PARAM_CONSTRUCTOR] = paramConstructorStr;
    classInfo[JSON_CONSTANTS.FIELDS_ACCESS_METHODS] = getsetStr;
    classInfo[JSON_CONSTANTS.METHODS] = methodsStr;

    generateFileUsingEJS(
        TEMPLATE_FILE_PATH_MAPPING.MODEL,
        classNameCapitalized,
        `${MODELS_DIRECTORY}/${classNameCapitalized}.java`,
        classInfo
    );
};

const generateRepositoryFile = itemJSON => {
    const className = itemJSON[JSON_CONSTANTS.NAME];
    const classNameCapitalized = utils.capitalizeFirstLetter(className);
    const classRepositoryName = templates.repositoryNameTemplate(classNameCapitalized);

    const classInfo = {};
    classInfo[JSON_CONSTANTS.NAME] = classNameCapitalized;
    classInfo[JSON_CONSTANTS.REPOSITORY_NAME] = classRepositoryName;

    generateFileUsingEJS(
        TEMPLATE_FILE_PATH_MAPPING.REPOSITORY,
        classRepositoryName,
        `${REPOSITORIES_DIRECTORY}/${classRepositoryName}.java`,
        classInfo
    );
};

const generateServiceFile = itemJSON => {
    const className = itemJSON[JSON_CONSTANTS.NAME];
    const classNameCapitalized = utils.capitalizeFirstLetter(className);
    const classNameSingular = utils.singularizeClassName(className).toLowerCase();
    const classNamePlural = utils.pluralizeClassName(className).toLowerCase();
    const classRepositoryName = templates.repositoryNameTemplate(classNameCapitalized);
    const classServiceName = templates.serviceNameTemplate(classNameCapitalized);
    const classRepositoryVariable = templates.repositoryVariableNameTemplate(classNameSingular);

    const classInfo = {};
    classInfo[JSON_CONSTANTS.NAME] = classNameCapitalized;
    classInfo[JSON_CONSTANTS.REPOSITORY_NAME] = classRepositoryName;
    classInfo[JSON_CONSTANTS.SERVICE_NAME] = classServiceName;
    classInfo[JSON_CONSTANTS.REPOSITORY_VARIABLE] = classRepositoryVariable;
    classInfo[JSON_CONSTANTS.CLASS_SINGULAR_NAME] = classNameSingular.toLowerCase();
    classInfo[JSON_CONSTANTS.CLASS_PLURAL_NAME] = classNamePlural.toLowerCase();

    generateFileUsingEJS(
        TEMPLATE_FILE_PATH_MAPPING.SERVICE,
        classServiceName,
        `${SERVICES_DIRECTORY}/${classServiceName}.java`,
        classInfo
    );
};

const generateFileUsingEJS = (templateFile, filename, filepath, data) => {
    utils.logMessage(`Start processing for ${filename}`);
    ejs.renderFile(templateFile, { classObject: data }, {}, function(err, str) {
        // console.log(str);
        utils.createFile(filepath, str);
        utils.logSuccessMessage(`End processing for ${filename}`);
    });
};

const generateFiles = classJSON => {
    generateModelFile(classJSON);
    generateRepositoryFile(classJSON);
    generateServiceFile(classJSON);
};

const processJSON = inputJson => {
    const classes = inputJson[JSON_CONSTANTS.CLASSES];

    // Generate respective files for each class
    classes.forEach(classItem => generateFiles(classItem));
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
