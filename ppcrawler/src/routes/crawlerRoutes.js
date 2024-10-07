// src/routes/crawlerRoutes.js

const express = require('express');
const router = express.Router();
const crawlerController = require('../controllers/crawlerController');  // Ensure this path is correct

// Define routes
router.get('/store-policies', crawlerController.storePrivacyPolicies);
router.get('/crawl-policy', crawlerController.crawlPrivacyPolicy);

module.exports = router;
