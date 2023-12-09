const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const addToListFavorite = {
  body: Joi.object().keys({
    blogId: Joi.string().required(),
  }),
};

const myListFavorite = {
  query: Joi.object().keys({
    userId: Joi.string(),
    sortBy: Joi.string(),
    isActive: Joi.boolean(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateListFavorite = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
};

const removeToLitFavorite = {
  body: Joi.object().keys({
    blogId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  addToListFavorite,
  removeToLitFavorite,
  myListFavorite,
  updateListFavorite,
};
