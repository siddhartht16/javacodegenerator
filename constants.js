const OUTPUT_DIRECTORY = `output`;
const MODELS_DIRECTORY = `${OUTPUT_DIRECTORY}/models`;
const CONTROLLERS_DIRECTORY = `${OUTPUT_DIRECTORY}/controllers`;
const REPOSITORIES_DIRECTORY = `${OUTPUT_DIRECTORY}/repositories`;
const SERVICES_DIRECTORY = `${OUTPUT_DIRECTORY}/services`;

const TYPE_MAPPING = {
    void: "void",
    byte: "byte",
    short: "short",
    int: "int",
    long: "long",
    float: "float",
    double: "double",
    boolean: "boolean",
    char: "char",
    string: "String"
};

const ACCESS_MODIFIER_MAPPING = {
    private: "private",
    public: "public",
    protected: "protected"
};

const JSON_CONSTANTS = {
    CLASSES: "classes",
    ACCESS_MODIFIER: "accessModifier",
    NAME: "name",
    FIELDS: "fields",
    TYPE: "type",
    METHODS: "methods",
    RETURN_TYPE: "returnType",
    PARAMS: "params"
};

module.exports = {
    OUTPUT_DIRECTORY,
    MODELS_DIRECTORY,
    CONTROLLERS_DIRECTORY,
    REPOSITORIES_DIRECTORY,
    SERVICES_DIRECTORY,
    TYPE_MAPPING,
    ACCESS_MODIFIER_MAPPING,
    JSON_CONSTANTS
};
