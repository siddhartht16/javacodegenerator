const yargs = require("yargs");
const generateMain = require("./generateMain");

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
        }
    },
    handler(argv) {
        console.log(argv.jsonFile);
        generateMain.generate(argv.jsonFile);
    }
});

yargs.parse();
