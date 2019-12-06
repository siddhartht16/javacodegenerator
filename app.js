const yargs = require("yargs");
const generateMain = require("./generateMain");
const utils = require("./common/utils");

// Customize yargs version
yargs.version("1.1.0");

// Create add command
yargs.command({
    command: "generate",
    describe: "Generate source code from JSON",
    builder: {
        jsonFile: {
            describe: "Metadata JSON file",
            demandOption: true,
            type: "String"
        },
        output: {
            describe: "Output path",
            demandOption: true,
            type: "String"
        }
    },
    handler(argv) {
        utils.logMessage(`JSON File: ${argv.jsonFile}, Output: ${argv.output}`);
        generateMain.generate(argv.jsonFile, argv.output);
    }
});

yargs.parse();
