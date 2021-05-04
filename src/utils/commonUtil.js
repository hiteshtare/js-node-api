// Import node modules
const log4js = require('log4js'); // include log4js

// Import custom modules
var config = require('../config');

exports.setLoggerLevel = ()=> {
  config.APP_CONFIG.loggerLevel = '' + process.env.LOGGER_LEVEL;
  console.warn(`setLoggerLevel : ${config.APP_CONFIG.loggerLevel}`);
}

exports.getLoggerLevel = ()=> {
  const logger = log4js.getLogger();
  logger.level = config.APP_CONFIG.loggerLevel;
  return logger;
}