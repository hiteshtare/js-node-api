// Import node modules
const http = require('http');
const app = require('./src/app');

//Custom Modules
const CommonUtil = require('./src/utils/commonUtil');

// Logger initialise
const logger = CommonUtil.getLoggerLevel();

//Port number
var port = process.env.PORT || 5000;

http.createServer(app).listen(port, () => {
  logger.warn(`Listening on port: ${port}`);
});