//Node Modules
var mongoose = require('mongoose');

//Custom Config
var config = require('../config');

var Schema = mongoose.Schema;

var embedTokenSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  systemUserId: String,
  roles: [String],
  embedTokens: [{
    reportName: String,
    clickedTimestamp: String,
    loadedTimestamp: String,
    renderedTimestamp: String,
  }]
}, {
  timestamps: true
});


module.exports = mongoose.model('EmbedToken', embedTokenSchema, config.APP_CONFIG.mongoCollectionName);