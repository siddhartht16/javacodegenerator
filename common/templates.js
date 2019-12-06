const utils = require("./utils");
const constants = require("./constants");
const { isArray, isEmpty, isBoolean } = require("lodash");

const primitiveFieldTemplate = (accessModifier, type, name) => `${accessModifier} ${type} ${name}; `;

const collectionFieldTemplate = (accessModifier, type, interfaceType, implementationType, name) =>
    `${accessModifier} ${interfaceType}<${type}> ${name} = new ${implementationType}<>(); `;

const mapFieldTemplate = (accessModifier, interfaceType, implementationType, keyType, valueType, name) =>
    `${accessModifier} ${interfaceType}<${keyType}, ${valueType}> ${name} = new ${implementationType}<>(); `;

const fieldColumnTemplate = column_name => `@Column(name="${column_name}") `;
const fieldJSONIgnoreTemplate = () => `@JsonIgnore `;

const getFieldTemplateVal = fieldInfo => {
    let result = ``;

    const data_type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.DATA_TYPE);
    const accessModifier = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.ACCESS_MODIFIER);
    const name = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.NAME);
    const column_name = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.COLUMN_NAME);
    const jsonIgnore = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.JSON_IGNORE, false);

    if (isEmpty(accessModifier) || isEmpty(name) || isEmpty(data_type)) return result;

    result = [];
    const dataTypeVal = utils.getDataTypeValue(data_type);

    if (isBoolean(jsonIgnore) && jsonIgnore) result.push(fieldJSONIgnoreTemplate());

    if (!isEmpty(column_name)) result.push(fieldColumnTemplate(column_name));

    const accessModifierVal = utils.getAccessModifierValue(accessModifier);

    let type = ``,
        typeVal = ``,
        boxTypeVal,
        fieldVal = ``,
        interfaceType = ``,
        implementationType = ``,
        keyType = ``,
        valueType = ``,
        interfaceTypeVal = ``,
        implementationTypeVal = ``,
        keyTypeVal = ``,
        valueTypeVal = ``;

    switch (dataTypeVal) {
        case constants.DATA_TYPE_MAPPING.PRIMITIVE:
            type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.TYPE);
            typeVal = utils.getTypeValue(type);
            fieldVal = primitiveFieldTemplate(accessModifierVal, typeVal, name);
            break;
        case constants.DATA_TYPE_MAPPING.COLLECTION:
            type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.TYPE);
            boxTypeVal = utils.getBoxTypeValue(type);
            interfaceType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
            implementationType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.IMPLEMENTATION_TYPE);
            interfaceTypeVal = utils.getCollectionTypeValue(interfaceType);
            implementationTypeVal = utils.getCollectionTypeValue(implementationType);
            fieldVal = collectionFieldTemplate(
                accessModifierVal,
                boxTypeVal,
                interfaceTypeVal,
                implementationTypeVal,
                name
            );
            break;
        case constants.DATA_TYPE_MAPPING.MAP:
            interfaceType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
            implementationType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.IMPLEMENTATION_TYPE);
            keyType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.KEY_TYPE);
            valueType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.VALUE_TYPE);
            interfaceTypeVal = utils.getMapTypeValue(interfaceType);
            implementationTypeVal = utils.getMapTypeValue(implementationType);
            keyTypeVal = utils.getBoxTypeValue(keyType);
            valueTypeVal = utils.getBoxTypeValue(valueType);
            fieldVal = mapFieldTemplate(
                accessModifierVal,
                interfaceTypeVal,
                implementationTypeVal,
                keyTypeVal,
                valueTypeVal,
                name
            );

            break;
        default:
            break;
    }

    if (!isEmpty(fieldVal)) {
        result.push(fieldVal);
        return result.join("\n");
    }

    return ``;
};

const getMethodTemplate = (accessModifier, type, capitalizedName, name) => {
    return `${accessModifier} ${type} get${capitalizedName}(){ return ${name}; } \n `;
};

const setMethodTemplate = (accessModifier, type, capitalizedName, name) => {
    const voidValue = utils.getTypeValue("void");
    return `${accessModifier} ${voidValue} set${capitalizedName}(${type} ${name}){ this.${name} = ${name}; } \n `;
};

const getGetSetMethodVal = fieldInfo => {
    let result = ``;

    const data_type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.DATA_TYPE);
    // const accessModifier = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.ACCESS_MODIFIER);
    const name = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.NAME);

    if (isEmpty(name) || isEmpty(data_type)) return result;

    const dataTypeVal = utils.getDataTypeValue(data_type);

    const accessModifierVal = utils.getAccessModifierValue(constants.ACCESS_MODIFIER_MAPPING.PUBLIC);
    const capitalizedName = utils.capitalizeFirstLetter(name);

    let type = ``,
        typeVal = ``,
        boxTypeVal = ``,
        interfaceType = ``,
        keyType = ``,
        valueType = ``,
        interfaceTypeVal = ``,
        keyTypeVal = ``,
        valueTypeVal = ``;

    switch (dataTypeVal) {
        case constants.DATA_TYPE_MAPPING.PRIMITIVE:
            type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.TYPE);
            typeVal = utils.getTypeValue(type);
            break;
        case constants.DATA_TYPE_MAPPING.COLLECTION:
            type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.TYPE);
            boxTypeVal = utils.getBoxTypeValue(type);
            interfaceType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
            interfaceTypeVal = utils.getCollectionTypeValue(interfaceType);
            typeVal = `${interfaceTypeVal}<${boxTypeVal}>`;
            break;
        case constants.DATA_TYPE_MAPPING.MAP:
            interfaceType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
            keyType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.KEY_TYPE);
            valueType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.VALUE_TYPE);
            interfaceTypeVal = utils.getMapTypeValue(interfaceType);
            keyTypeVal = utils.getBoxTypeValue(keyType);
            valueTypeVal = utils.getBoxTypeValue(valueType);
            typeVal = `${interfaceTypeVal}<${keyTypeVal}, ${valueTypeVal}>`;
            break;
        default:
            break;
    }

    if (!isEmpty(typeVal)) {
        result = [];
        result.push(getMethodTemplate(accessModifierVal, typeVal, capitalizedName, name));
        result.push(setMethodTemplate(accessModifierVal, typeVal, capitalizedName, name));
        result = result.join("\n");
    }

    return result;
};

const paramsTemplate = fields => {
    if (isEmpty(fields)) return ``;

    const result = fields.map(fieldInfo => {
        const data_type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.DATA_TYPE);
        const dataTypeVal = utils.getDataTypeValue(data_type);
        const name = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.NAME);

        let type = ``,
            typeVal = ``,
            boxTypeVal = ``,
            interfaceType = ``,
            keyType = ``,
            valueType = ``,
            interfaceTypeVal = ``,
            keyTypeVal = ``,
            valueTypeVal = ``,
            fieldVal = ``;

        switch (dataTypeVal) {
            case constants.DATA_TYPE_MAPPING.PRIMITIVE:
                type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.TYPE);
                typeVal = utils.getTypeValue(type);
                break;
            case constants.DATA_TYPE_MAPPING.COLLECTION:
                type = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.TYPE);
                boxTypeVal = utils.getBoxTypeValue(type);
                interfaceType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
                interfaceTypeVal = utils.getCollectionTypeValue(interfaceType);
                typeVal = `${interfaceTypeVal}<${boxTypeVal}>`;
                break;
            case constants.DATA_TYPE_MAPPING.MAP:
                interfaceType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
                keyType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.KEY_TYPE);
                valueType = utils.getKeyValueFromJSON(fieldInfo, constants.JSON_CONSTANTS.VALUE_TYPE);
                interfaceTypeVal = utils.getMapTypeValue(interfaceType);
                keyTypeVal = utils.getBoxTypeValue(keyType);
                valueTypeVal = utils.getBoxTypeValue(valueType);
                typeVal = `${interfaceTypeVal}<${keyTypeVal}, ${valueTypeVal}>`;
                break;
            default:
                break;
        }

        if (!isEmpty(typeVal)) {
            fieldVal = `${typeVal} ${name}`;
        }
        return fieldVal;
    });
    return result.join(", ");
};

const defaultConstructorTemplate = className => {
    return `public ${className}() {}`;
};

const getDefaultConstructorVal = className => defaultConstructorTemplate(className);

const paramConstructorBodyTemplate = fields => {
    if (isEmpty(fields)) return ``;
    const result = fields.map(item => `this.${item.name} = ${item.name};`);
    return result.join("\n");
};

const paramConstructorTemplate = (className, fields) => {
    const paramStr = paramsTemplate(fields);
    const bodyStr = paramConstructorBodyTemplate(fields);
    return `public ${className}(${paramStr}) { \n ${bodyStr} \n }`;
};

const getParametrizedConstructorVal = (className, fields) => paramConstructorTemplate(className, fields);

const getClassNameVal = (accessModifier, className) => className(accessModifier, className);

const methodTemplate = (accessModifier, returnType, name, params, methodBody) => {
    return `${accessModifier} ${returnType} ${name}(${params}) { ${methodBody} \n }`;
};

const getMethodVal = methodInfo => {
    const data_type = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.DATA_TYPE);
    const name = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.NAME);
    const accessModifier = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.ACCESS_MODIFIER);
    const params = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.PARAMS);

    const dataTypeVal = utils.getDataTypeValue(data_type);
    const accessModifierVal = utils.getAccessModifierValue(accessModifier);
    const paramsVal = paramsTemplate(params);

    let type = ``,
        typeVal = ``,
        boxTypeVal = ``,
        interfaceType = ``,
        keyType = ``,
        valueType = ``,
        interfaceTypeVal = ``,
        keyTypeVal = ``,
        valueTypeVal = ``,
        methodBodyVal = ``,
        result = ``;

    switch (dataTypeVal) {
        case constants.DATA_TYPE_MAPPING.PRIMITIVE:
            type = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.TYPE);
            typeVal = utils.getTypeValue(type);
            methodBodyVal = utils.getMethodReturnStatementByType(type);
            break;
        case constants.DATA_TYPE_MAPPING.COLLECTION:
            type = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.TYPE);
            boxTypeVal = utils.getBoxTypeValue(type);
            interfaceType = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
            interfaceTypeVal = utils.getCollectionTypeValue(interfaceType);
            typeVal = `${interfaceTypeVal}<${boxTypeVal}>`;
            methodBodyVal = utils.getMethodReturnStatementByType("");
            break;
        case constants.DATA_TYPE_MAPPING.MAP:
            interfaceType = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
            keyType = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.KEY_TYPE);
            valueType = utils.getKeyValueFromJSON(methodInfo, constants.JSON_CONSTANTS.VALUE_TYPE);
            interfaceTypeVal = utils.getMapTypeValue(interfaceType);
            keyTypeVal = utils.getBoxTypeValue(keyType);
            valueTypeVal = utils.getBoxTypeValue(valueType);
            typeVal = `${interfaceTypeVal}<${keyTypeVal}, ${valueTypeVal}>`;
            methodBodyVal = utils.getMethodReturnStatementByType("");
            break;
        default:
            break;
    }

    if (!isEmpty(typeVal)) {
        result = methodTemplate(accessModifierVal, typeVal, name, paramsVal, methodBodyVal);
    }
    return result;
};

const repositoryNameTemplate = name => `${name}Repository`;
const serviceNameTemplate = name => `${name}Service`;
const repositoryVariableNameTemplate = name => `${name}Repository`;

const getRepositoryNameVal = name => repositoryNameTemplate(name);
const getServiceNameVal = name => serviceNameTemplate(name);
const getRepositoryVariableNameVal = name => repositoryVariableNameTemplate(name);

const getFetchTypeTemplate = fetch_type =>
    `fetch=FetchType.${
        fetch_type in constants.FETCH_TYPES ? constants.FETCH_TYPES[fetch_type] : constants.FETCH_TYPES.LAZY
    }`;

const getMappedByTemplate = mappedBy => `mappedBy = "${mappedBy}"`;
const getOrphanRemovalTemplate = orphanRemoval => `orphanRemoval = ${!!orphanRemoval}`;

const getCascadeTemplate = cascade_type =>
    `cascade=CascadeType.${
        cascade_type in constants.CASCADE_TYPES ? constants.CASCADE_TYPES[cascade_type] : constants.CASCADE_TYPES.ALL
    }`;

const getJoinColumnsTemplate = join_columns => {
    let result = ``;
    if (isArray(join_columns)) {
        result = join_columns.map(join_column => ` @JoinColumn(name = "${join_columns}") `).join(",");
    } else {
        result = `@JoinColumn(name = "${join_columns}") \n`;
    }
    return result;
};

const getJoinColumnsListTemplate = join_columns => {
    let result = [];
    result.push(`@JoinColumns({ \n`);
    result.push(`${getJoinColumnsTemplate(join_columns)}`);
    result.push(`}) \n`);
    return result.join("");
};

const getJoinTableTemplate = (join_table, join_columns, inverse_join_columns) => {
    const joinColumnsVal = getJoinColumnsTemplate(join_columns);
    const inverseJoinColumnsVal = getJoinColumnsTemplate(inverse_join_columns);
    return `@JoinTable( 
        name="${join_table}", \n
        joinColumns={${joinColumnsVal}}, \n
        inverseJoinColumns={${inverseJoinColumnsVal}}) \n`;
};

const getRelationShipAttributeTemplate = (mappedBy, fetchType, cascade, orphanRemoval) => {
    const result = [];

    if (!isEmpty(mappedBy)) result.push(getMappedByTemplate(mappedBy));

    if (!isEmpty(fetchType)) result.push(getFetchTypeTemplate(fetchType));

    if (!isEmpty(cascade)) result.push(getCascadeTemplate(cascade));

    if (!isEmpty(orphanRemoval)) result.push(getOrphanRemovalTemplate(orphanRemoval));

    return !isEmpty(result) ? `(${result.join(",")})` : ``;
};

const getRelationShipField = (
    relationShipValue,
    relationShipAttributes,
    jsonIgnore,
    joinClause,
    accessModifier,
    interfaceType,
    name,
    implementationType
) => {
    const result = [];

    if (!isEmpty(jsonIgnore)) result.push(`${jsonIgnore} \n`);

    if (!isEmpty(joinClause)) result.push(`${joinClause} \n`);

    result.push(`@${relationShipValue}${relationShipAttributes} \n`);
    result.push(`${accessModifier} ${interfaceType} ${name}`);

    if (!isEmpty(implementationType)) {
        result.push(` = new ${implementationType}<>(); \n`);
    } else {
        result.push(`;`);
    }

    return result.join("\n");
};

const getOneToOneVal = (direction, accessModifier, relationShipInfo) => {
    const accessModifierVal = utils.getAccessModifierValue(accessModifier);
    const field = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.FIELD);
    const jsonIgnore = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.JSON_IGNORE);
    const mappedBy = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_MAPPED_BY);
    const cascade = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_CASCADE);
    const fetch = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_FETCH);
    const orphanRemoval = utils.getKeyValueFromJSON(
        relationShipInfo,
        constants.JSON_CONSTANTS.RELATIONSHIP_ORPHAN_REMOVAL
    );
    const relationShipAttributesVal = getRelationShipAttributeTemplate(mappedBy, fetch, cascade, orphanRemoval);
    const relationShip = constants.JPA_RELATIONSHIP_ANNOTATION_MAPPING.ONETOONE;

    let className = ``,
        joinClause = ``;

    if (direction === constants.JSON_CONSTANTS.RELATIONSHIP_FROM) {
        className = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_TO_CLASS);
        const join_table = utils.getKeyValueFromJSON(
            relationShipInfo,
            constants.JSON_CONSTANTS.RELATIONSHIP_JOIN_TABLE
        );
        const join_columns = utils.getKeyValueFromJSON(
            relationShipInfo,
            constants.JSON_CONSTANTS.RELATIONSHIP_JOIN_COLUMNS
        );
        const inverse_join_columns = utils.getKeyValueFromJSON(
            relationShipInfo,
            constants.JSON_CONSTANTS.RELATIONSHIP_INVERSE_JOIN_COLUMNS
        );

        if (!isEmpty(join_table)) {
            joinClause = getJoinTableTemplate(join_table, join_columns, inverse_join_columns);
        } else {
            const strVal = isArray(join_columns)
                ? getJoinColumnsListTemplate(join_columns)
                : getJoinColumnsTemplate(join_columns);
            joinClause = getJoinColumnsTemplate(strVal);
        }
    } else {
        className = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_FROM_CLASS);
    }

    return getRelationShipField(
        relationShip,
        relationShipAttributesVal,
        jsonIgnore,
        joinClause,
        accessModifierVal,
        className,
        field,
        ``
    );
};

const getManyToOneVal = (direction, accessModifier, relationShipInfo) => {
    const accessModifierVal = utils.getAccessModifierValue(accessModifier);
    const field = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.FIELD);
    const jsonIgnore = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.JSON_IGNORE);
    const interfaceType = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
    const implementationType = utils.getKeyValueFromJSON(
        relationShipInfo,
        constants.JSON_CONSTANTS.IMPLEMENTATION_TYPE
    );
    const mappedBy = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_MAPPED_BY);
    const cascade = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_CASCADE);
    const fetch = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_FETCH);
    const orphanRemoval = utils.getKeyValueFromJSON(
        relationShipInfo,
        constants.JSON_CONSTANTS.RELATIONSHIP_ORPHAN_REMOVAL
    );

    let relationShip = ``,
        className = ``,
        joinClause = ``;
    if (direction === constants.JSON_CONSTANTS.RELATIONSHIP_FROM) {
        relationShip = constants.JPA_RELATIONSHIP_ANNOTATION_MAPPING.ONETOMANY;
        className = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_TO_CLASS);
    } else {
        relationShip = constants.JPA_RELATIONSHIP_ANNOTATION_MAPPING.MANYTOONE;
        className = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_FROM_CLASS);
        const joinColumn = utils.getKeyValueFromJSON(
            relationShipInfo,
            constants.JSON_CONSTANTS.RELATIONSHIP_JOIN_COLUMN
        );
        joinClause = getJoinColumnsTemplate(joinColumn);
    }

    const relationShipAttributesVal = getRelationShipAttributeTemplate(mappedBy, fetch, cascade, orphanRemoval);

    const interfaceTypeVal = !isEmpty(interfaceType)
        ? `${utils.getCollectionTypeValue(interfaceType)}<${className}>`
        : className;
    let implementationTypeVal = !isEmpty(implementationType) ? utils.getCollectionTypeValue(implementationType) : ``;

    return getRelationShipField(
        relationShip,
        relationShipAttributesVal,
        jsonIgnore,
        joinClause,
        accessModifierVal,
        interfaceTypeVal,
        field,
        implementationTypeVal
    );
};

const getManyToManyVal = (direction, accessModifier, relationShipInfo) => {
    const accessModifierVal = utils.getAccessModifierValue(accessModifier);
    const field = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.FIELD);
    const jsonIgnore = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.JSON_IGNORE);
    const mappedBy = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_MAPPED_BY);
    const cascade = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_CASCADE);
    const fetch = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_FETCH);
    const orphanRemoval = utils.getKeyValueFromJSON(
        relationShipInfo,
        constants.JSON_CONSTANTS.RELATIONSHIP_ORPHAN_REMOVAL
    );
    const interfaceType = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.INTERFACE_TYPE);
    const implementationType = utils.getKeyValueFromJSON(
        relationShipInfo,
        constants.JSON_CONSTANTS.IMPLEMENTATION_TYPE
    );
    const relationShipAttributesVal = getRelationShipAttributeTemplate(mappedBy, fetch, cascade, orphanRemoval);
    const relationShip = constants.JPA_RELATIONSHIP_ANNOTATION_MAPPING.MANYTOMANY;

    let className = ``,
        joinClause = ``;

    if (direction === constants.JSON_CONSTANTS.RELATIONSHIP_FROM) {
        className = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_TO_CLASS);
        const join_table = utils.getKeyValueFromJSON(
            relationShipInfo,
            constants.JSON_CONSTANTS.RELATIONSHIP_JOIN_TABLE
        );
        const join_columns = utils.getKeyValueFromJSON(
            relationShipInfo,
            constants.JSON_CONSTANTS.RELATIONSHIP_JOIN_COLUMNS
        );
        const inverse_join_columns = utils.getKeyValueFromJSON(
            relationShipInfo,
            constants.JSON_CONSTANTS.RELATIONSHIP_INVERSE_JOIN_COLUMNS
        );

        if (!isEmpty(join_table)) {
            joinClause = getJoinTableTemplate(join_table, join_columns, inverse_join_columns);
        } else {
            const strVal = isArray(join_columns)
                ? getJoinColumnsListTemplate(join_columns)
                : getJoinColumnsTemplate(join_columns);
            joinClause = getJoinColumnsTemplate(strVal);
        }
    } else {
        className = utils.getKeyValueFromJSON(relationShipInfo, constants.JSON_CONSTANTS.RELATIONSHIP_FROM_CLASS);
    }

    const interfaceTypeVal = !isEmpty(interfaceType)
        ? `${utils.getCollectionTypeValue(interfaceType)}<${className}>`
        : className;
    let implementationTypeVal = !isEmpty(implementationType) ? utils.getCollectionTypeValue(implementationType) : ``;

    return getRelationShipField(
        relationShip,
        relationShipAttributesVal,
        jsonIgnore,
        joinClause,
        accessModifierVal,
        interfaceTypeVal,
        field,
        implementationTypeVal
    );
};

module.exports = {
    getClassNameVal,
    getFieldTemplateVal,
    getMethodTemplate,
    setMethodTemplate,
    getGetSetMethodVal,
    getDefaultConstructorVal,
    getParametrizedConstructorVal,
    getRepositoryNameVal,
    getServiceNameVal,
    getRepositoryVariableNameVal,
    getMethodVal,
    getOneToOneVal,
    getManyToOneVal,
    getManyToManyVal
};
