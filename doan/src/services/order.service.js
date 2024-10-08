const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Order = require('../models/order.model');
const Address = require('../models/address.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Discount = require('../models/discount.model');

const createOrder = async (body) => {
  const addressId = body.addressId;
  const items = body.items;
  const userId = body.userId;
  const addresses = await Address.findOne({ userId });
  const discount = await Discount.findById(body.discountId);
  const address = addresses.addresses.find((it) => it.id == addressId);

  if (!address) {
    throw new Error('address not found');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('user not found');
  }
  const getProductDetails = async (item) => {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      product: product,
      quantity: item.quantity,
    };
  };

  const itemDetailsPromises = items.map(getProductDetails);
  Promise.all(itemDetailsPromises)
    .then(async (itemDetails) => {
      body.user = user.toObject();
      if (discount) {
        await Discount.updateOne({ _id: discount.id }, { $set: { used: discount.used + 1 } });
        const discountUpdate = await Discount.findById(body.discountId);
        console.log('discountUpdate :>> ', discountUpdate);
        if (discountUpdate.used >= discountUpdate.limit) {
          const abc = await Discount.updateOne({ _id: discount.id }, { $set: { isActive: false } });
          console.log('abc :>> ', abc);
          return Order.create({ ...body, product: itemDetails, addresses: address, user: user, discount: discountUpdate });
        } else {
          return Order.create({ ...body, product: itemDetails, addresses: address, user: user, discount: discountUpdate });
        }
        console.log('1 :>> ', 1);
      } else {
        return Order.create({ ...body, product: itemDetails, addresses: address, user: user });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */

const getOrderById = async (id) => {
  return Order.findById(id);
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
const updateOrderById = async (id, updateBody, user) => {
  const order = await getOrderById(id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }
  if (updateBody.status == 'cancel') {
    const currentDate = new Date();
    Object.assign(order, { ...updateBody, statusDetail: { timeCancel: currentDate, content: updateBody.content, user } });
    await order.save();
    return order;
  }

  if (updateBody.status == 'shipping') {
    const currentDate = new Date();
    Object.assign(order, { ...updateBody, statusDetail: { timeConfirm: currentDate } });
    await order.save();
    return order;
  }
  if (updateBody.status == 'delivered') {
    const currentDate = new Date();
    Object.assign(order, {
      ...updateBody,
      statusDetail: { timeConfirm: order.statusDetail.timeConfirm, timeDelivered: currentDate },
    });
    await order.save();
    return order;
  }
  if (updateBody.status == 'complete') {
    const currentDate = new Date();
    console.log('order :>> ', order.product);

    order.product.map(async (it) => {
      await Product.updateOne({ _id: it._id }, { $set: { quantity: it.product.quantity - it.quantity } });
    });
    Object.assign(order, {
      ...updateBody,
      statusDetail: {
        timeConfirm: order.statusDetail.timeConfirm,
        timeDelivered: order.statusDetail.timeDelivered,
        timeComplete: currentDate,
      },
    });
    await order.save();
    return order;
  }
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  updateOrderById,
};
