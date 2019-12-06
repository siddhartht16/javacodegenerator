# javacodegenerator

Spring Java project source code generator

This project is to generate Java source code files for models, repositories, services from a given JSON Configuration.
JSON Configuration is expected to provide data for classes, fields, methods and JPA relationships(if applicable). 
The source files for entities/classes, repositories and services will be auto generated after running the app.

Developed as a individual project for the course CS 5200, Fall 2019 at Northeastern University under the guidance of **Professor Dr. Jose Annunziato**. 

Using: JavaScript, Node JS, [EJS](https://ejs.co/)


## How to Run

1. From the project directory, run the following command to install npm packages:
```
npm install --save
```

2. From the project directory, run the following command to generate source files:
```
node app generate --jsonFile=input.json --output=output
```

where,
* generate = specifies the option to generate code
* jsonFile = option to specify input JSON configuration to use
* output = option to specify the path where the output would be written


## Sample JSON
Sample JSON is provided in the file input.json. Use it to further customize the JSON.

## JSON Configuration
Separate README explaining the JSON Configuration and customisation is at [JSON_README](https://github.com/siddhartht16/javacodegenerator/blob/master/JSON_README.md).
