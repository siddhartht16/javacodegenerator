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
    return result.join(",");
};

const defaultConstructorTemplate = className => {
    const capitalizedName = utils.capitalizeFirstLetter(className);
    return `public ${capitalizedName}() {};`;
};

const paramConstructorBodyTemplate = fields => {
    const result = fields.map(item => `this.${item.name} = ${item.name};`);
    return result.join("\n");
};

const paramConstructorTemplate = (className, fields) => {
    const capitalizedName = utils.capitalizeFirstLetter(className);
    const fieldStr = paramsTemplate(fields);
    const bodyStr = paramConstructorBodyTemplate(fields);
    return `public ${capitalizedName}(${fieldStr}) { ${bodyStr} }`;
};

const classNameTemplate = (accessModifier, className) => {
    const accessModifierValue = utils.getAccessModifierValue(accessModifier);
    const capitalizedName = utils.capitalizeFirstLetter(className);
    return `${accessModifierValue} class ${capitalizedName}`;
};

module.exports = {
    fieldTemplate,
    getMethodTemplate,
    setMethodTemplate,
    defaultConstructorTemplate,
    paramConstructorTemplate,
    classNameTemplate
};
