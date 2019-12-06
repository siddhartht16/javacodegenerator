const OUTPUT_DIRECTORY = `output`;
const MODELS_DIRECTORY = `models`;
const CONTROLLERS_DIRECTORY = `controllers`;
const REPOSITORIES_DIRECTORY = `repositories`;
const SERVICES_DIRECTORY = `services`;
const TEMPLATE_FILES_DIRECTORY = `templates`;

const TYPE_MAPPING = {
    VOID: "void",
    SHORT: "short",
    INT: "int",
    LONG: "long",
    FLOAT: "float",
    DOUBLE: "double",
    BOOLEAN: "boolean",
    BYTE: "byte",
    CHAR: "char",
    STRING: "String"
};

const BOX_TYPE_MAPPING = {
    SHORT: "Short",
    INTEGER: "Integer",
    LONG: "Long",
    FLOAT: "Float",
    DOUBLE: "Double",
    BOOLEAN: "Boolean",
    BYTE: "Byte",
    CHARACTER: "Character",
    STRING: "String"
};

const DATA_TYPE_MAPPING = {
    PRIMITIVE: "primitive",
    COLLECTION: "collection",
    MAP: "map"
};

const COLLECTION_TYPE_MAPPING = {
    SET: "Set",
    LIST: "List",
    QUEUE: "Queue",
    DEQUE: "Deque",
    ARRAYLIST: "ArrayList",
    VECTOR: "Vector",
    LINKEDLIST: "LinkedList",
    PRIORITYQUEUE: "PriorityQueue",
    HASHSET: "HashSet",
    LINKEDHASH_SET: "LinkedHashSet",
    TREESET: "TreeSet"
};

const MAP_TYPE_MAPPING = {
    MAP: "Map",
    SORTED_MAP: "SortedMap",
    HASHMAP: "HashMap",
    TREEMAP: "TreeMap",
    LINKEDHASHMAP: "LinkedHashMap"
};

const ACCESS_MODIFIER_MAPPING = {
    PRIVATE: "private",
    PUBLIC: "public",
    PROTECTED: "protected"
};

const JSON_CONSTANTS = {
    CLASSES: "classes",
    CLASS: "class",
    ACCESS_MODIFIER: "accessModifier",
    NAME: "name",
    COLUMN_NAME: "columnName",
    FIELDS: "fields",
    TYPE: "type",
    FIELD: "field",
    DATA_TYPE: "dataType",
    INTERFACE_TYPE: "interfaceType",
    IMPLEMENTATION_TYPE: "implementationType",
    KEY_TYPE: "keyType",
    VALUE_TYPE: "valueType",
    JSON_IGNORE: "jsonIgnore",
    METHODS: "methods",
    RETURN_TYPE: "returnType",
    PARAMS: "params",
    RELATIONSHIPS: "relationShips",
    RELATIONSHIP: "relationShip",
    RELATED_CLASS: "relatedClass",
    RELATED_CLASS_FIELD: "relatedClassField",
    RELATIONSHIP_DIRECTION: "relationship_direction",
    RELATIONSHIP_FROM: "from",
    RELATIONSHIP_FROM_CLASS: "fromClass",
    RELATIONSHIP_TO: "to",
    RELATIONSHIP_TO_CLASS: "toClass",
    RELATIONSHIP_JOIN_COLUMN: "joinColumn",
    RELATIONSHIP_JOIN_COLUMNS: "joinColumns",
    RELATIONSHIP_JOIN_TABLE: "joinTable",
    RELATIONSHIP_INVERSE_JOIN_COLUMN: "inverseJoinColumn",
    RELATIONSHIP_INVERSE_JOIN_COLUMNS: "inverseJoinColumns",
    RELATIONSHIP_MAPPED_BY: "mappedBy",
    RELATIONSHIP_CASCADE: "cascade",
    RELATIONSHIP_FETCH: "fetch",
    RELATIONSHIP_ORPHAN_REMOVAL: "orphanRemoval",
    PACKAGE_NAME: "packageName"
};

const TEMPLATE_PLACEHOLDERS = {
    CLASS_OBJECT: "classObject",
    NAME: "name",
    PACKAGE_NAME: "packageName",
    CLASS_NAME: "className",
    ACCESS_MODIFIER: "accessModifier",
    FIELDS: "fields",
    METHODS: "methods",
    FIELDS_GET_SET_METHODS: "fieldsGetSetMethods",
    DEFAULT_CONSTRUCTOR: "defaultConstructor",
    PARAM_CONSTRUCTOR: "paramConstructor",
    REPOSITORY_NAME: "repositoryName",
    SERVICE_NAME: "serviceName",
    REPOSITORY_VARIABLE: "repositoryVariable",
    CLASS_LOWERCASE_NAME: "classLowerCaseName",
    RELATED_FIELDS: "relatedFields",
    RELATED_FIELDS_METHODS: "relatedFieldsMethods"
};

const TEMPLATE_FILE_PATH_MAPPING = {
    MODEL: `${TEMPLATE_FILES_DIRECTORY}/Model.java`,
    REPOSITORY: `${TEMPLATE_FILES_DIRECTORY}/Repository.java`,
    CONTROLLER: `${TEMPLATE_FILES_DIRECTORY}/Controller.java`,
    SERVICE: `${TEMPLATE_FILES_DIRECTORY}/Service.java`
};

const JPA_RELATIONSHIP_CONSTANTS = {
    ONE_TO_ONE: "onetoone",
    MANY_TO_ONE: "manytoone",
    MANY_TO_MANY: "manytomany"
};

const JPA_RELATIONSHIP_ANNOTATION_MAPPING = {
    ONETOONE: "OneToOne",
    ONETOMANY: "OneToMany",
    MANYTOONE: "ManyToOne",
    MANYTOMANY: "ManyToMany"
};

const FETCH_TYPES = {
    LAZY: "LAZY",
    EAGER: "EAGER"
};

const CASCADE_TYPES = {
    ALL: "ALL",
    MERGE: "MERGE",
    PERSIST: "PERSIST",
    REFRESH: "REFRESH",
    REMOVE: "REMOVE"
};

const DEFAULT_MAPPINGS = {
    PACKAGE_NAME: "example",
    COLLECTION_INTERFACE: COLLECTION_TYPE_MAPPING.SET,
    COLLECTION_IMPLEMENTATION: COLLECTION_TYPE_MAPPING.HASHSET,
    MAP_INTERFACE: MAP_TYPE_MAPPING.MAP,
    MAP_IMPLEMENTATION: MAP_TYPE_MAPPING.HASHMAP
};

const DEFAULT_METHOD_RETURNS = {
    NUMERIC_RETURN: "return -1;",
    VOID_RETURN: "",
    NULL_RETURN: "return null;",
    BOOLEAN_RETURN: "return true;",
    BYTE_RETURN: 'return Byte.parseByte("");',
    CHAR_RETURN: "return 'a';"
};

module.exports = {
    OUTPUT_DIRECTORY,
    MODELS_DIRECTORY,
    CONTROLLERS_DIRECTORY,
    REPOSITORIES_DIRECTORY,
    SERVICES_DIRECTORY,
    TYPE_MAPPING,
    DATA_TYPE_MAPPING,
    BOX_TYPE_MAPPING,
    COLLECTION_TYPE_MAPPING,
    MAP_TYPE_MAPPING,
    DEFAULT_MAPPINGS,
    ACCESS_MODIFIER_MAPPING,
    JSON_CONSTANTS,
    TEMPLATE_FILE_PATH_MAPPING,
    JPA_RELATIONSHIP_ANNOTATION_MAPPING,
    JPA_RELATIONSHIP_CONSTANTS,
    TEMPLATE_PLACEHOLDERS,
    FETCH_TYPES,
    CASCADE_TYPES,
    DEFAULT_METHOD_RETURNS
};
