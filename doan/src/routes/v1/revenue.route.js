const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const revenueValidation = require('../../validations/revenue.validation');
const revenueController = require('../../controllers/revenue.controller');

const router = express.Router();

router.route('/').get(validate(revenueValidation.getReportOrder), revenueController.getReportOrder);

module.exports = router;
