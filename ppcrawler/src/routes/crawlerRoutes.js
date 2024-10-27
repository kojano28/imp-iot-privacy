const express = require('express');
const router = express.Router();
const crawlerController = require('../controllers/crawlerController');

// Debugging statement
console.log('crawlerController:', crawlerController);

// Define routes
router.get('/store-policies', crawlerController.storePrivacyPoliciesRoute);
router.get('/crawl-policy', crawlerController.crawlPrivacyPolicy);

module.exports = router;
