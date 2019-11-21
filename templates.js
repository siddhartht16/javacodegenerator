const utils = require("./utils");

const fieldTemplate = (accessIdentifier, type, name) => {
    const typeValue = utils.getTypeValue(type);
    return `${accessIdentifier} ${typeValue} ${name}; `;
};

const getMethodTemplate = (type, name) => {
    const capitalizedName = utils.capitalizeFirstLetter(name);
    const typeValue = utils.getTypeValue(type);
    return `public ${typeValue} get${capitalizedName}(){ return ${name}; } \n `;
};

const setMethodTemplate = (type, name) => {
    const capitalizedName = utils.capitalizeFirstLetter(name);
    const typeValue = utils.getTypeValue(type);
    const voidValue = utils.getTypeValue("void");
    return `public ${voidValue} set${capitalizedName}(${typeValue} ${name}){ this.${name} = ${name}; } \n `;
};

const paramsTemplate = fields => {
    const result = fields.map(item => {
        const typeValue = utils.getTypeValue(item.type);
        return `${typeValue} ${item.name}`;
    });
    return result.join(", ");
};

const defaultConstructorTemplate = className => {
    return `public ${className}() {};`;
};

const paramConstructorBodyTemplate = fields => {
    const result = fields.map(item => `this.${item.name} = ${item.name};`);
    return result.join("\n");
};

const paramConstructorTemplate = (className, fields) => {
    const paramStr = paramsTemplate(fields);
    const bodyStr = paramConstructorBodyTemplate(fields);
    return `public ${className}(${paramStr}) { \n ${bodyStr} \n }`;
};

const classNameTemplate = (accessModifier, className) => {
    const accessModifierValue = utils.getAccessModifierValue(accessModifier);
    const capitalizedName = utils.capitalizeFirstLetter(className);
    return `${accessModifierValue} class ${capitalizedName}`;
};

const methodTemplate = (name, accessModifier, returnType, params) => {
    const accessModifierValue = utils.getAccessModifierValue(accessModifier);
    const returnTypeValue = utils.getTypeValue(returnType);
    const paramStr = paramsTemplate(params);
    return `${accessModifierValue} ${returnTypeValue} ${name}(${paramStr}) { }`;
};

const repositoryNameTemplate = name => `${name}Repository`;
const serviceNameTemplate = name => `${name}Service`;
const repositoryVariableNameTemplate = name => `${name}Repository`;

const relationShipTemplate = (accessModifier, relationShip, relatedClass, relatedClassField) => {
    const accessModifierValue = utils.getAccessModifierValue(accessModifier);
    const returnTypeValue = utils.capitalizeFirstLetter(relatedClass);
    const field = relatedClassField.toLowerCase();
    const relationShipValue = utils.getJPARelationshipValue(relationShip);

    return `@${relationShipValue} \n ${accessModifierValue} ${returnTypeValue} ${field};`;
};

module.exports = {
    fieldTemplate,
    getMethodTemplate,
    setMethodTemplate,
    defaultConstructorTemplate,
    paramConstructorTemplate,
    classNameTemplate,
    methodTemplate,
    repositoryNameTemplate,
    serviceNameTemplate,
    repositoryVariableNameTemplate,
    relationShipTemplate
};
