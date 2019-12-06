## JSON Configuration to generate Java source code

Sample JSON is provided in the **input.json** file. This readme is to explain the different parts of the JSON and help understand how to customize the JSON as per requirements.

## Components of JSON

### Root Level 

  This section will explain about the keys that are expected at the root level of the input JSON.
  ```
  {
    "packageName": "example",
    "classes": [...],
    "relationShips": [...]
  }
  ```
  where,
  * packageName = name of the package to be used in the JAVA source files, defaults to *example*
  * classes = array of objects representing the classes
  * relationShips = array of objects representing the relationships between classes

#### Class object

  These section will explain the keys expected in a object containing class information and what value each key represents.

  Example class information object
  ```
    {
        "accessModifier": "public",
        "name": "Course",
        "fields": [...],
        "methods": [...]
    }
  ```
  where,
  * accessModifier = access modifier for the class, like *public, private* etc.
  * name = Name of the class, **required**
  * fields = array of objects for the fields in the class
  * methods = array of objects for the methods in the class


#### Field Data types

  Field data types are used to identify if the field is a primitive type field, a collection field or a map field.
  The data type value is used to construct field definitions, parameter definition, field assignment, method return type statements.
  When a primitive type is specified in a collection or map field, the box type of the primitive type will be used.

  * Primitive types
      *void, short, int, long, float, double, boolean, byte, char, string*
  * Collection types
      *Set, List, Queue, Deque, ArrayList, Vector, LinkedList, PriorityQueue, HashSet, LinkedHashSet, TreeSet*
  * Map types
      *Map, SortedMap, HashMap, TreeMap, LinkedHashMap*
  * Box types of primitive types: 
      *Short, Integer, Long, Float, Double, Boolean, Byte, Character, String* 


  Following are the required keys for a field definition apart from name and access modifier, as per the data type. 

  * For primitive types
    * dataType
    * type
  * For collection types
    * dataType
    * type
    * interfaceType
    * implementationType
  * For map types
    * dataType
    * interfaceType
    * implementationType
    * keyType
    * valueType

  where,
  * dataType = specifies if the field is a primitive, collection or map field
  * type = specifies the primitive type of the field
  * interfaceType = specifies the interface type for a collection or map field
  * implementationType = specifies the implementation type for a collection or map field
  * keyType = specifies the type of the key in the map field
  * type = specifies the type of the value in the map field


  ** Example outputs as per field data types **

  * Primitive types
    ```
     {
          "dataType": "primitive",
          "type": "int",
          "name": "name",
          "accessModifier": "public",
      }
    ```
    this would generate:
    ```
      public int name;
    ```

  * Collection types
    ```
      {
          "dataType": "collection",
          "type": "string",
          "name": "names",
          "accessModifier": "public",
          "interfaceType": "list",
          "implementationType": "arraylist"
      }

    ```
    this would generate:
    ```
      public List<String> names = new ArrayList<>(); 
    ```

  * Map types
    ```
      {
          "dataType": "map",
          "name": "namesMap",
          "accessModifier": "public",
          "interfaceType": "map",
          "implementationType": "hashmap",
          "keyType": "string",
          "valueType": "integer"
      }
    ```
    this would generate:
    ```
      public Map<String, Integer> namesMap = new HashMap<>(); 
    ```

 

#### Field object

  These section will explain the keys expected in a object containing a field information and what value each key represents.

  Example field information objects
  ```
      {
        "dataType": "primitive",
        "type": "int",
        "name": "name",
        "accessModifier": "public",
        "columnName": "name",
        "jsonIgnore": true
      },
      {
        "dataType": "collection",
        "type": "string",
        "name": "names",
        "accessModifier": "public",
        "interfaceType": "list",
        "implementationType": "arraylist"
      },
      {
        "dataType": "map",
        "name": "namesMap",
        "accessModifier": "public",
        "interfaceType": "map",
        "implementationType": "hashmap",
        "keyType": "string",
        "valueType": "integer"
      }
  ```
  where, apart from the data type definitions above,
  * accessModifier = access modifier for the field, like *public, private* etc.
  * name = Name of the field, **required**
  * columnName = name of the column to be annotated for JPA, optional
  * jsonIgnore = JPA JsonIgnore annotation to be added to the field, optional

  Also, for each field, the getter and setter methods are also generated based on the field definitions.


#### Method object
  These section will explain the keys expected in a object containing a method information and what value each key represents.

  ```
    {
      "dataType": "primitive",
      "type": "int",
      "name": "totalCount",
      "accessModifier": "public",
      "params": [
        {
          "dataType": "primitive",
          "type": "int",
          "name": "count"
        }
      ]
    }
  ```
  this will generate:
  ```
    public int totalCount(int count) { return -1; }
  ```
  where,
  params = array of method params. Each param object is expected to be similar to a field object.

  The app will also populate the return statements based on the return type of a method.


#### Relationships

  This is used to specify the relationships between the classes in terms of JPA relationships and annotate the fields.
  Supported Relationships:
    * OneToOne
    * ManyToOne
    * ManyToMany

  For each of the above type, a set of keys is expected in the relationShip object.

  Common Structure for all relationship types
  ```
  {
    "accessModifier": "public",
    "relationShip": "manytoone",
    "from": {...},
    "to": {...}
  }
  ```
  where,
  * accessModifier = access modifier for the field, like *public, private* etc.
  * relationShip = Either of the above three
  * from = From side of the relationship. This object should contain specific keys as per the relationship
  * to = To side of the relationship. This object should contain specific keys as per the relationship


  For a **OneToOne** relationship
    Following JSON is expected for a OneToOne relationship definition in the relationships array.
    The from and to sections should contain the following keys in the respective object. 
    ```
      {
        "accessModifier": "public",
        "relationShip": "onetoone",
        "from": {
          "class": "Course",
          "joinTable": "course_sections",
          "joinColumns": [
            "section_id"
          ],
          "inverseJoinColumns": [
            "course_id"
          ],
          "field": "courseSection"
        },
        "to": {
          "class": "Section",
          "mappedBy": "courseSection",
          "field": "sectionCourse"
        }
      }
    ```
    where, apart from the keys already defined above, others are:
    * mappedBy = the field name to use in the annotation in the to class
    * field = the field name
    * class = name of the class for the from or to side of the relationship
    * joinTable = to specify the name of the join table     
    * joinColumns = to specify the names of the join columns  
    * inverseJoinColumns = to specify the names of the inverse join columns  

  For a **ManyToOne** relationship
    Following JSON is expected for a ManyToOne relationship definition in the relationships array.
    The from and to sections should contain the following keys in the respective object. 
    ```
      {
        "accessModifier": "public",
        "relationShip": "manytoone",
        "from": {
          "class": "Course",
          "mappedBy": "course",
          "field": "modules",
          "interfaceType": "list",
          "implementationType": "arraylist"
        },
        "to": {
          "class": "Module",
          "joinColumn": "fk_course",
          "field": "course"
        }
      }
    ```
    where, apart from the keys already defined above, others are:
    * mappedBy = the field name to use in the annotation 
    * field = the field name
    * class = name of the class for the from or to side of the relationship   
    * joinColumn = to specify the name of the join column  


  For a **ManyToMany** relationship
    Following JSON is expected for a ManyToMany relationship definition in the relationships array.
    The from and to sections should contain the following keys in the respective object. 
    ```
     {
        "accessModifier": "public",
        "relationShip": "manytomany",
        "from": {
          "class": "Course",
          "joinTable": "course_semester",
          "joinColumns": [
            "semester_id"
          ],
          "inverseJoinColumns": [
            "course_id"
          ],
          "field": "courseSemesters",
          "interfaceType": "list",
          "implementationType": "arraylist"
        },
        "to": {
          "class": "Semester",
          "mappedBy": "courseSemesters",
          "field": "semesterCourses",
          "interfaceType": "list",
          "implementationType": "arraylist"
        }
      }
    ```
    where, apart from the keys already defined above, others are:
    * mappedBy = the field name to use in the annotation 
    * field = the field name
    * class = name of the class for the from or to side of the relationship
    * joinTable = to specify the name of the join table     
    * joinColumns = to specify the names of the join columns  
    * inverseJoinColumns = to specify the names of the inverse join columns
    * interfaceType = interface type for the collection as this relationship implies lists of objects
    * implementationType = implementation type for the collection as this relationship implies lists of objects



