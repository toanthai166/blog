const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ListFavorite = require('../models/listFavorite.model');
const Product = require('../models/product.model');

const addToListFavorite = async (body) => {
  return ListFavorite.create(body);
};

const updateListFavorite = async (id, updateBody) => {
  const list = await ListFavorite.findById(id);
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, 'list not found');
  }
  Object.assign(list, updateBody);
  try {
    await list.save();
  } catch (error) {
    console.error('Lỗi cơ sở dữ liệu:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Lỗi cơ sở dữ liệu');
  }
  // await cart.save();
  return list;
};

const removeToListFavorite = async (id, updateBody) => {
  const products = updateBody;
  console.log(2);
  const cart = await Cart.findById(id);
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

const lisFavorite = async (filter, options) => {
  const list = await ListFavorite.paginate(filter, options);
  return list;
};

module.exports = {
  addToListFavorite,
  updateListFavorite,
  lisFavorite,
  removeToListFavorite,
};
