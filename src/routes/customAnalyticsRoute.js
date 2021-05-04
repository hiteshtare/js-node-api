//Node Modules
const express = require("express");
const router = express.Router();

//Custom Modules
const EmbedTokenController = require('../controllers/customAnalyticsController');

router.get("/", EmbedTokenController.getAllEmbedTokens);

router.post("/", EmbedTokenController.createEmbedToken);

router.put("/:embedTokenId", EmbedTokenController.updateEmbedTokenById);

router.get("/:embedTokenId", EmbedTokenController.getEmbedTokenById);

module.exports = router;