//Node Modules
const mongoose = require("mongoose");
const request = require("request-promise");
const _ = require("lodash");
const crypto = require('crypto');

//Custom Modules
const CommonUtil = require('../utils/commonUtil');

// Logger initialise
const logger = CommonUtil.getLoggerLevel();

exports.getAllEmbedTokens = async (req, res, next) => {
  logger.warn(`getAllEmbedTokens`);

  try {
    const EmbedToken = require("../models/embedTokenModel");

    // if (token) {
    let embedTokens = await EmbedToken.find({}).sort({ //sorting the fields
      updatedAt: -1
    })
      .limit(10); // 10 records only

    res.status(200).json({
      success: true,
      message: 'List of embedTokens fetched successfully',
      payload: embedTokens
    });
    logger.info(`List of embedTokens fetched successfully`);

    // } else {
    //   res.status(200).json({
    //     success: true,
    //     message: 'Access Denied!',
    //     payload: []
    //   });
    // }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      message: err
    });
  }
}


exports.createEmbedToken = async (req, res, next) => {
  logger.warn(`createEmbedToken`);

  try {
    const EmbedToken = require("../models/embedTokenModel");

    const hashSystemUserId = crypto.createHash('md5').update(req.body.systemUserId).digest('hex');

    const embedToken = new EmbedToken({
      _id: new mongoose.Types.ObjectId(),
      systemUserId: hashSystemUserId,
      roles: req.body.roles,
      embedTokens: req.body.embedTokens,
    });

    let result = await embedToken.save();

    res.status(201).json({
      success: true,
      message: 'Embed Token created successfully',
      payload: result
    });
    logger.info(`Embed Token created successfully`);

  } catch (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

exports.updateEmbedTokenById = async (req, res, next) => {
  logger.warn(`updateEmbedTokenById`);

  try {
    const EmbedToken = require("../models/embedTokenModel");

    const id = req.params.embedTokenId;
    const updateOps = {
      embedTokens: req.body.embedTokens,
    };

    let embedToken = await EmbedToken.findById(id);

    if (embedToken) {
      let updated_embedToken = await EmbedToken.updateOne({
        _id: id
      }, {
        $set: updateOps
      });

      res.status(200).json({
        success: true,
        message: "EmbedToken updated successfully",
        payload: updated_embedToken
      });
      logger.info(`EmbedToken updated successfully`);

    } else {
      res.status(404).json({
        success: true,
        message: "No valid entry found for provided embedTokenId"
      });
      logger.fatal(`No valid entry found for provided embedTokenId`);

    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

exports.getEmbedTokenById = async (req, res, next) => {
  logger.warn(`getEmbedTokenById`);

  try {
    const EmbedToken = require("../models/embedTokenModel");

    const id = req.params.embedTokenId;

    let embedToken = await EmbedToken.findById(id);

    if (embedToken) {
      res.status(200).json({
        success: true,
        message: 'A EmbedToken fetched successfully',
        payload: embedToken
      });
      logger.info(`A EmbedToken fetched successfully`);
    } else {
      res.status(404).json({
        success: true,
        message: "No valid entry found for provided embedTokenId"
      });
      logger.fatal(`No valid entry found for provided embedTokenId`);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({
      success: false,
      message: err
    });
  }
};