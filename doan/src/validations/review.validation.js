const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    comment: Joi.string(),
    productId: Joi.string().required(),
    rating: Joi.number().required(),
  }),
};
const getReviews = {
  query: Joi.object().keys({
    productId: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createReview,
  getReviews,
};
