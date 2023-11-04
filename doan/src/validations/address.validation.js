const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createAddress = {
  body: Joi.object().keys({
    addressName: Joi.string().required(),
    fullname: Joi.string().required(),
    phone: Joi.string().required(),
    addressMoreInfo: Joi.string().required(),
    isDefault: Joi.boolean().required(),
  }),
};

const getAddresses = {
  query: Joi.object().keys({
    userId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAddress = {
  body: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateAddress = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      fullname: Joi.string(),
      phone: Joi.string(),
      isDefault: Joi.boolean(),
      addressMoreInfo: Joi.string(),
      addressName: Joi.string(),
    })
    .min(1),
};

const editAddress = {
  body: Joi.object()
    .keys({
      id: Joi.string(),
      fullname: Joi.string(),
      phone: Joi.string(),
      isDefault: Joi.boolean(),
      addressMoreInfo: Joi.string(),
      addressName: Joi.string(),
    })
    .min(1),
};

const removeAddress = {
  body: Joi.object().keys({
    addressId: Joi.string().required(),
  }),
};

module.exports = {
  createAddress,
  getAddresses,
  getAddress,
  editAddress,
  updateAddress,
  removeAddress,
};
