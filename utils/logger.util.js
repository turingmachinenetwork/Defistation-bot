const config = require("../config");

function getLogger(name) {
    let log4js = require("log4js");
    let opts = config.defaultLog4jConfig;
    opts.appenders[name] = { type: "file", filename: `logs/${name}.log` };
    opts.categories[name] = { appenders: ["console", name], level: config.logLevel };
    log4js.configure(opts);
    return log4js.getLogger(name);
}
exports.getLogger = getLogger;

function getDefaultLogger() {
    let log4js = require("log4js");
    log4js.configure(config.defaultLog4jConfig);
    return log4js.getLogger();
}
exports.getDefaultLogger = getDefaultLogger;