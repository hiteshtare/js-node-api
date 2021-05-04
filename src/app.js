//Node Modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors')

//Custom Modules
const customerAnalyticsRoute = require('./routes/customAnalyticsRoute');
const cosmosDBMiddleware = require('./middlewares/cosmosdbMiddleware');
const CommonUtil = require('./utils/commonUtil');
var config = require('./config');

// Import bot configuration/variables from .env file in root folder
const ENV_FILE = path.join('.env');
dotenv.config({
  path: ENV_FILE
});

// Logger initialise
const logger = CommonUtil.getLoggerLevel();

//Initialize express app
const app = express();

// Log Bot Version in console
logger.debug(`Current Version: ${config.APP_CONFIG.version}`);

// config.endPointUrl = `https://entry.dev15.na01.labs.omnipresence.io`;
config.APP_CONFIG.endPointUrl = `https://${process.env.ENTRY}`;
logger.info(`EndPointUrl: ${config.APP_CONFIG.endPointUrl}`);


//Connect to Cosmos for Feedback loop (Chat logs)
connectToCosmos();

//Middlewares
// app.use(cors()); // CORS
app.use(morgan('dev')); // Logging
app.use(bodyParser.urlencoded({ // Body Parser
  extended: false
}));
app.use(bodyParser.json());

//Cross Origin Resource Scripting
app.use((req, res, next) => {
  //res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  //To avoid CORB issue
  res.setHeader("Content-Type", "application/json");

  next();
});

app.use(cosmosDBMiddleware.fetch_collection_name);

app.use("/api/nam/customeranalytics", customerAnalyticsRoute);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


function connectToCosmos() {
  logger.warn(`Connecting to COSMOS...`);

  const COSMOS_connectionString = process.env.DNA_CUSTOM_ANALYTICS_COSMOS_CONNECTIONSTRING;
  const COSMOS_dbName = process.env.DNA_CUSTOM_ANALYTICS_COSMOS_DBNAME;
  // const COSMOS_collectionName = process.env.DNA_CUSTOM_ANALYTICS_COSMOS_COLLECTIONNAME;

  // logger.info(`COSMOS_connectionString: ${COSMOS_connectionString}`);
  logger.info(`COSMOS_dbName: ${COSMOS_dbName}`);
  // logger.info(`COSMOS_collectionName: ${COSMOS_collectionName}`);

  mongoose.connect(`${COSMOS_connectionString}`, {
    dbName: COSMOS_dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    logger.warn(`Connected to COSMOS`);
  }).catch((err) => {
    logger.error(err);
  });
  mongoose.Promise = global.Promise;
}

module.exports = app;