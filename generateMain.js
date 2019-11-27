const { isEmpty, cloneDeep } = require("lodash");
const utils = require("./common/utils");
const templates = require("./common/templates");
const validations = require("./common/validations");
const {
    CONTROLLERS_DIRECTORY,
    JSON_CONSTANTS,
    MODELS_DIRECTORY,
    OUTPUT_DIRECTORY,
    REPOSITORIES_DIRECTORY,
    SERVICES_DIRECTORY,
    TEMPLATE_FILE_PATH_MAPPING,
    JPA_RELATIONSHIP_CONSTANTS,
    TEMPLATE_PLACEHOLDERS,
    ACCESS_MODIFIER_MAPPING,
    DEFAULT_MAPPINGS
} = require("./common/constants");

const createDirs = packageName => {
    const packageDir = `${OUTPUT_DIRECTORY}/${packageName}`;
    utils.createDirectory(OUTPUT_DIRECTORY);
    utils.createDirectory(`${packageDir}`);
    utils.createDirectory(`${packageDir}/${MODELS_DIRECTORY}`);
    utils.createDirectory(`${packageDir}/${CONTROLLERS_DIRECTORY}`);
    utils.createDirectory(`${packageDir}/${REPOSITORIES_DIRECTORY}`);
    utils.createDirectory(`${packageDir}/${SERVICES_DIRECTORY}`);
};

const getRelationShipFieldVal = relationShipObj => {
    let result = ``;
    const direction = utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP_DIRECTION);

    if (isEmpty(direction)) return result;

    const relationShip = utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP);

    if (isEmpty(relationShip)) return result;

    const accessModifier = utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.ACCESS_MODIFIER);

    const relationShipInfo =
        direction === JSON_CONSTANTS.RELATIONSHIP_FROM
            ? utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP_FROM)
            : utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP_TO);

    switch (relationShip.toLowerCase()) {
        case JPA_RELATIONSHIP_CONSTANTS.ONE_TO_ONE:
            result = templates.getOneToOneVal(direction, accessModifier, relationShipInfo);
            break;
        case JPA_RELATIONSHIP_CONSTANTS.MANY_TO_ONE:
            result = templates.getManyToOneVal(direction, accessModifier, relationShipInfo);
            break;
        case JPA_RELATIONSHIP_CONSTANTS.MANY_TO_MANY:
            result = templates.getManyToManyVal(direction, accessModifier, relationShipInfo);
            break;
        default:
            break;
    }
    return result;
};

const getRelationShipFieldsGetSetMethodsVal = relationShipObj => {
    let result = ``;
    const direction = utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP_DIRECTION);

    if (isEmpty(direction)) return result;

    const relationShip = utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP);

    if (isEmpty(relationShip)) return result;

    const accessModifierVal = utils.getAccessModifierValue(ACCESS_MODIFIER_MAPPING.PUBLIC);
    let relDataObj = {},
        className = ``;

    if (direction === JSON_CONSTANTS.RELATIONSHIP_FROM) {
        relDataObj = utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP_FROM);
        className = utils.getKeyValueFromJSON(relDataObj, JSON_CONSTANTS.RELATIONSHIP_TO_CLASS);
    } else if (direction === JSON_CONSTANTS.RELATIONSHIP_TO) {
        relDataObj = utils.getKeyValueFromJSON(relationShipObj, JSON_CONSTANTS.RELATIONSHIP_TO);
        className = utils.getKeyValueFromJSON(relDataObj, JSON_CONSTANTS.RELATIONSHIP_FROM_CLASS);
    }

    const interfaceType = utils.getKeyValueFromJSON(relDataObj, JSON_CONSTANTS.INTERFACE_TYPE);
    const field = utils.getKeyValueFromJSON(relDataObj, JSON_CONSTANTS.FIELD);
    const interfaceTypeVal = utils.getCollectionTypeValue(interfaceType);
    const fieldCapitalizedName = utils.capitalizeFirstLetter(field);
    const typeVal = !isEmpty(interfaceTypeVal) ? `${interfaceTypeVal}<${className}>` : className;

    const res = [];
    res.push(templates.getMethodTemplate(accessModifierVal, typeVal, fieldCapitalizedName, field));
    res.push(templates.setMethodTemplate(accessModifierVal, typeVal, fieldCapitalizedName, field));
    return res.join("");
};

const generateModelFile = (packageName, classJSON, relationShipsMapping) => {
    const className = utils.getKeyValueFromJSON(classJSON, JSON_CONSTANTS.NAME);

    validations.validateClassName(className);

    const accessModifier = utils.getKeyValueFromJSON(classJSON, JSON_CONSTANTS.ACCESS_MODIFIER);
    const fields = utils.getKeyValueFromJSON(classJSON, JSON_CONSTANTS.FIELDS);
    const methods = utils.getKeyValueFromJSON(classJSON, JSON_CONSTANTS.METHODS);

    let fileName = ``,
        accessModifierVal = ``,
        fieldsVal = ``,
        getSetMethodsVal = ``,
        defaultConstructorVal = ``,
        paramConstructorVal = ``,
        methodsVal = ``,
        relationShipsFieldsVal = "",
        relationShipsFieldsGetSetMethodsVal = "";

    // Get the entity name
    fileName = utils.getJavaFileName(className);

    accessModifierVal = utils.getAccessModifierValue(accessModifier);

    // Generate the field definitions
    fieldsVal = fields ? fields.map(field => templates.getFieldTemplateVal(field)).join("\n\n") : ``;

    // Generate the field getter and setter methods
    getSetMethodsVal = fields ? fields.map(field => templates.getGetSetMethodVal(field)).join("\n") : "";

    // Generate the default constructor
    defaultConstructorVal = templates.getDefaultConstructorVal(className);

    // // Generate the parametrized constructor
    paramConstructorVal = templates.getParametrizedConstructorVal(className, fields);

    // Generate the methods
    methodsVal = methods ? methods.map(method => templates.getMethodVal(method)).join("\n") : "";

    const relationShipsArray =
        className.toLowerCase() in relationShipsMapping ? relationShipsMapping[className.toLowerCase()] : [];

    if (relationShipsArray.length > 0) {
        // Generate the relationship fields
        relationShipsFieldsVal = relationShipsArray
            ? relationShipsArray.map(relationShip => getRelationShipFieldVal(relationShip)).join("\n")
            : "";

        // Generate the relationship fields get set methods
        relationShipsFieldsGetSetMethodsVal = relationShipsArray
            ? relationShipsArray.map(relationShip => getRelationShipFieldsGetSetMethodsVal(relationShip)).join("\n")
            : "";
    }

    // Populate the class info object for the template
    const classInfo = {};
    classInfo[TEMPLATE_PLACEHOLDERS.PACKAGE_NAME] = packageName;
    classInfo[TEMPLATE_PLACEHOLDERS.CLASS_NAME] = className;
    classInfo[TEMPLATE_PLACEHOLDERS.ACCESS_MODIFIER] = accessModifierVal;
    classInfo[TEMPLATE_PLACEHOLDERS.FIELDS] = fieldsVal;
    classInfo[TEMPLATE_PLACEHOLDERS.DEFAULT_CONSTRUCTOR] = defaultConstructorVal;
    classInfo[TEMPLATE_PLACEHOLDERS.PARAM_CONSTRUCTOR] = paramConstructorVal;
    classInfo[TEMPLATE_PLACEHOLDERS.FIELDS_GET_SET_METHODS] = getSetMethodsVal;
    classInfo[TEMPLATE_PLACEHOLDERS.METHODS] = methodsVal;
    classInfo[TEMPLATE_PLACEHOLDERS.RELATED_FIELDS] = relationShipsFieldsVal;
    classInfo[TEMPLATE_PLACEHOLDERS.RELATED_FIELDS_METHODS] = relationShipsFieldsGetSetMethodsVal;

    // Generate the file
    utils.generateFileUsingEJS(
        TEMPLATE_FILE_PATH_MAPPING.MODEL,
        fileName,
        `${utils.getModelFilesPath(packageName)}${fileName}`,
        classInfo
    );
};

const generateRepositoryFile = (packageName, classJSON) => {
    const className = utils.getKeyValueFromJSON(classJSON, JSON_CONSTANTS.NAME);

    validations.validateClassName(className);

    const classRepositoryName = templates.getRepositoryNameVal(className);
    const fileName = utils.getJavaFileName(classRepositoryName);

    // Populate the class info object for the template
    const classInfo = {};
    classInfo[TEMPLATE_PLACEHOLDERS.PACKAGE_NAME] = packageName;
    classInfo[TEMPLATE_PLACEHOLDERS.CLASS_NAME] = className;
    classInfo[TEMPLATE_PLACEHOLDERS.REPOSITORY_NAME] = classRepositoryName;

    // Generate the file
    utils.generateFileUsingEJS(
        TEMPLATE_FILE_PATH_MAPPING.REPOSITORY,
        fileName,
        `${utils.getRepositoryFilesPath(packageName)}${fileName}`,
        classInfo
    );
};

const generateServiceFile = (packageName, classJSON) => {
    const className = utils.getKeyValueFromJSON(classJSON, JSON_CONSTANTS.NAME);

    validations.validateClassName(className);

    const classRepositoryName = templates.getRepositoryNameVal(className);
    const classServiceName = templates.getServiceNameVal(className);
    const classRepositoryVariable = templates.getRepositoryVariableNameVal(className.toLowerCase());
    const fileName = utils.getJavaFileName(classServiceName);

    // Populate the class info object for the template
    const classInfo = {};
    classInfo[TEMPLATE_PLACEHOLDERS.PACKAGE_NAME] = packageName;
    classInfo[TEMPLATE_PLACEHOLDERS.CLASS_NAME] = className;
    classInfo[TEMPLATE_PLACEHOLDERS.REPOSITORY_NAME] = classRepositoryName;
    classInfo[TEMPLATE_PLACEHOLDERS.SERVICE_NAME] = classServiceName;
    classInfo[TEMPLATE_PLACEHOLDERS.REPOSITORY_VARIABLE] = classRepositoryVariable;
    classInfo[TEMPLATE_PLACEHOLDERS.CLASS_LOWERCASE_NAME] = className.toLowerCase();

    // Generate the file
    utils.generateFileUsingEJS(
        TEMPLATE_FILE_PATH_MAPPING.SERVICE,
        fileName,
        `${utils.getServiceFilesPath(packageName)}${fileName}`,
        classInfo
    );
};

const getRelationShipsMapping = relationShips => {
    const result = {};

    if (isEmpty(relationShips)) return result;

    relationShips.map(relationShip => {
        const accessModifier = utils.getKeyValueFromJSON(relationShip, JSON_CONSTANTS.ACCESS_MODIFIER);
        const relation = utils.getKeyValueFromJSON(relationShip, JSON_CONSTANTS.RELATIONSHIP);
        const from = utils.getKeyValueFromJSON(relationShip, JSON_CONSTANTS.RELATIONSHIP_FROM);
        const to = utils.getKeyValueFromJSON(relationShip, JSON_CONSTANTS.RELATIONSHIP_TO);
        const fromClass = utils.getKeyValueFromJSON(from, JSON_CONSTANTS.CLASS);
        const toClass = utils.getKeyValueFromJSON(to, JSON_CONSTANTS.CLASS);

        const classArray = [fromClass.toLowerCase(), toClass.toLowerCase()];

        classArray.forEach((className, index) => {
            const direction =
                className === fromClass.toLowerCase()
                    ? JSON_CONSTANTS.RELATIONSHIP_FROM
                    : JSON_CONSTANTS.RELATIONSHIP_TO;

            const newRelObj = {};
            newRelObj[JSON_CONSTANTS.RELATIONSHIP] = relation;
            newRelObj[JSON_CONSTANTS.ACCESS_MODIFIER] = accessModifier;
            newRelObj[JSON_CONSTANTS.RELATIONSHIP_DIRECTION] = direction;
            if (direction === JSON_CONSTANTS.RELATIONSHIP_FROM) {
                newRelObj[JSON_CONSTANTS.RELATIONSHIP_FROM] = cloneDeep(from);
                newRelObj[JSON_CONSTANTS.RELATIONSHIP_FROM][JSON_CONSTANTS.RELATIONSHIP_TO_CLASS] = toClass;
            } else {
                newRelObj[JSON_CONSTANTS.RELATIONSHIP_TO] = cloneDeep(to);
                newRelObj[JSON_CONSTANTS.RELATIONSHIP_TO][JSON_CONSTANTS.RELATIONSHIP_FROM_CLASS] = fromClass;
            }

            const relationShipsArray = className in result ? result[className] : [];
            relationShipsArray.push(newRelObj);
            result[className] = relationShipsArray;
        });
    });

    return result;
};

const generateFiles = (packageName, classJSON, relationShipsMapping) => {
    generateModelFile(packageName, classJSON, relationShipsMapping);
    generateRepositoryFile(packageName, classJSON, relationShipsMapping);
    generateServiceFile(packageName, classJSON, relationShipsMapping);
};

const processJSON = jsonFilePath => {
    // Get the json data
    const jsonObj = utils.getJSONData(jsonFilePath);

    const classes = utils.getKeyValueFromJSON(jsonObj, JSON_CONSTANTS.CLASSES, {});
    const relationShips = utils.getKeyValueFromJSON(jsonObj, JSON_CONSTANTS.RELATIONSHIPS, {});

    // Return if no classes defined
    if (isEmpty(classes)) return;

    const packageName = utils.getKeyValueFromJSON(jsonObj, JSON_CONSTANTS.PACKAGE_NAME, DEFAULT_MAPPINGS.PACKAGE_NAME);
    const relationShipsMapping = getRelationShipsMapping(relationShips);

    // Create all the directories
    createDirs(packageName);

    // Generate respective files for each class in respective directories
    classes.forEach(classItem => generateFiles(packageName, classItem, relationShipsMapping));
};

const generate = jsonFilePath => {
    // Validate the input json file
    validations.validateJSONFile(jsonFilePath);
    utils.cleanUp();
    processJSON(jsonFilePath);
};

module.exports = {
    generate
};
