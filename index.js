let config = require("./config");
global.config = config;

require("./utils/mongodb.util");
const LOGGER_HELPER = require("./utils/logger.util");
const logger = LOGGER_HELPER.getDefaultLogger();
global.logger = logger;

const SCHEDULE_HELPER = require("./schedule");
let jobManagement = null;
async function main() {
	jobManagement = new SCHEDULE_HELPER();
    await jobManagement.start();
}

main();