//Node Modules
var mongoose = require('mongoose');
const request = require("request-promise");

//Custom Modules
const CommonUtil = require('../utils/commonUtil');
var config = require('../config')

// Logger initialise
const logger = CommonUtil.getLoggerLevel();

var fetch_collection_name = async function (req, res, next) {
  let moderatorConfigHeaders = {
    'Authorization': req.header('Authorization')
  };

  const moderatorConfigURI = `${config.APP_CONFIG.endPointUrl}/api/tnt/analytics/notesassistant/moderatorconfig`;
  // logger.info(`moderatorConfigURI : ${moderatorConfigURI}`);

  //GET Request for fetching Cosmos DB Config
  const get_options = {
    method: 'GET',
    uri: moderatorConfigURI,
    headers: moderatorConfigHeaders
  };

  const fetchedModeratorConfig = await request(get_options)
    .then(function (resp) {
      logger.info(`ModeratorConfig fetched successfully.`);
      // logger.debug(resp);
      return JSON.parse(resp);
    }).catch((err) => {
      logger.error(err);
    });

  //set MONGO details from fetchedModeratorConfig
  config.APP_CONFIG.mongoCollectionName = fetchedModeratorConfig.cosmosContainer;
  //++++++++++++++++++++++++++++++++++++Custom Analytics++++++++++++++++++++++++++++++++++++//
  config.APP_CONFIG.mongoCollectionName = fetchedModeratorConfig.cosmosContainer.replace("notesassistant", "customeranalytics");
  console.warn(`COSMOS_collectionName : ${config.APP_CONFIG.mongoCollectionName}`);
  //++++++++++++++++++++++++++++++++++++Custom Analytics++++++++++++++++++++++++++++++++++++//

  next();
}


module.exports = {
  fetch_collection_name
};