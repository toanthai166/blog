const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Discount = require('../models/discount.model');
const Category = require('../models/category.model');

const createDisCount = async (body) => {
  return Discount.create(body);
};

const queryDiscounts = async (filter, options) => {
  const addresses = await Discount.paginate(filter, options);
  return addresses;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */

const getDiscountById = async (id) => {
  console.log('id', id);
  return Discount.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateDiscount = async (id, updateBody) => {
  const discount = await Discount.findById(id);
  if (!discount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'discount not found');
  }
  Object.assign(discount, updateBody);
  try {
    await discount.save();
  } catch (error) {
    console.error('Lỗi cơ sở dữ liệu:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi cơ sở dữ liệu');
  }
  // await discount.save();
  return discount;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteBlogById = async (id) => {
  const address = await getAddresById(id);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'address not found');
  }
  await address.remove();
  return address;
};

module.exports = {
  createDisCount,
  queryDiscounts,
  getDiscountById,
  updateDiscount,
};
