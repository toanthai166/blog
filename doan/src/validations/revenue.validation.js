const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getReportOrder = {
  query: Joi.object().keys({
    time: Joi.string(),
  }),
};

module.exports = {
  getReportOrder,
};
