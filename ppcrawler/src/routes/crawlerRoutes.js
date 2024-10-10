// src/routes/crawlerRoutes.js

const express = require('express');
const router = express.Router();
const crawlerController = require('../controllers/crawlerController');

// Define routes
router.get('/store-policies', crawlerController.storePrivacyPoliciesRoute);
router.get('/crawl-policy', crawlerController.crawlPrivacyPolicy);

module.exports = router;
