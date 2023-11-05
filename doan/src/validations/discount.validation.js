const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createDisCount = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    limit: Joi.number().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    unit: Joi.string().required(),
    value: Joi.number().required(),
    minOrderValue: Joi.number().required(),
    limitPerAccount: Joi.number().required(),
    productIds: Joi.array().items(Joi.string().required()).required(),
  }),
};
const changeIsActiveDiscount = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      id: Joi.string().custom(objectId),
      isActive: Joi.boolean().required(),
    })
    .min(1),
};

const getDiscounts = {
  query: Joi.object().keys({
    isActive: Joi.string(),
    productIds: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDiscount = {
  param: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateDiscount = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      id: Joi.required().custom(objectId),
      name: Joi.string(),
      limit: Joi.number(),
      startDate: Joi.string(),
      endDate: Joi.string(),
      unit: Joi.string(),
      value: Joi.number(),
      minOrderValue: Joi.number(),
      limitPerAccount: Joi.number(),
      productIds: Joi.array().items(Joi.string()),
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
  createDisCount,
  changeIsActiveDiscount,
  getDiscounts,
  getDiscount,
  editAddress,
  updateDiscount,
  removeAddress,
};
