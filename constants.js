const OUTPUT_DIRECTORY = `output`;
const MODELS_DIRECTORY = `${OUTPUT_DIRECTORY}/models`;
const CONTROLLERS_DIRECTORY = `${OUTPUT_DIRECTORY}/controllers`;
const REPOSITORIES_DIRECTORY = `${OUTPUT_DIRECTORY}/repositories`;
const SERVICES_DIRECTORY = `${OUTPUT_DIRECTORY}/services`;
const TEMPLATE_FILES_DIRECTORY = `templates`;

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

const JPA_RELATIONSHIP_MAPPING = {
    onetoone: "OneToOne",
    onetomany: "OneToMany",
    manytoone: "ManyToOne",
    manytomany: "ManyToMany"
};

const JSON_CONSTANTS = {
    CLASSES: "classes",
    ACCESS_MODIFIER: "accessModifier",
    NAME: "name",
    FIELDS: "fields",
    TYPE: "type",
    METHODS: "methods",
    RETURN_TYPE: "returnType",
    PARAMS: "params",
    RELATIONSHIPS: "relationShips",
    RELATIONSHIP: "relationShip",
    RELATED_CLASS: "relatedClass",
    RELATED_CLASS_FIELD: "relatedClassField",
    RELATED_FIELDS: "relatedFields",
    RELATED_FIELDS_METHODS: "relatedFieldsMethods",
    FIELDS_ACCESS_METHODS: "fieldsAccessMethods",
    DEFAULT_CONSTRUCTOR: "defaultConstructor",
    PARAM_CONSTRUCTOR: "paramConstructor",
    REPOSITORY_NAME: "repositoryName",
    SERVICE_NAME: "serviceName",
    REPOSITORY_VARIABLE: "repositoryVariable",
    CLASS_SINGULAR_NAME: "classSingularName",
    CLASS_PLURAL_NAME: "classPluralName"
};

const TEMPLATE_FILE_PATH_MAPPING = {
    MODEL: `${TEMPLATE_FILES_DIRECTORY}/Model.java`,
    REPOSITORY: `${TEMPLATE_FILES_DIRECTORY}/Repository.java`,
    CONTROLLER: `${TEMPLATE_FILES_DIRECTORY}/Controller.java`,
    SERVICE: `${TEMPLATE_FILES_DIRECTORY}/Service.java`
};

module.exports = {
    OUTPUT_DIRECTORY,
    MODELS_DIRECTORY,
    CONTROLLERS_DIRECTORY,
    REPOSITORIES_DIRECTORY,
    SERVICES_DIRECTORY,
    TYPE_MAPPING,
    ACCESS_MODIFIER_MAPPING,
    JSON_CONSTANTS,
    TEMPLATE_FILE_PATH_MAPPING,
    JPA_RELATIONSHIP_MAPPING
};
