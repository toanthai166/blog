const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Address = require('../models/address.model');
const Category = require('../models/category.model');

const createAddress = async (body) => {
  return Address.create(body);
};

const queryAddresses = async (filter, options) => {
  const addresses = await Address.paginate(filter, options);
  return addresses;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */

const getAddresById = async (id) => {
  return Address.findById(id);
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
const updateAddress = async (id, updateBody) => {
  const cart = await Address.findById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'cart not found');
  }
  Object.assign(cart, updateBody);
  try {
    await cart.save();
  } catch (error) {
    console.error('Lỗi cơ sở dữ liệu:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi cơ sở dữ liệu');
  }
  // await cart.save();
  return cart;
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
  createAddress,
  queryAddresses,
  getAddresById,
  updateAddress,
};
