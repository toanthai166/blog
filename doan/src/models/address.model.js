const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const Category = require('./category.model');

// const addressSchema = mongoose.Schema({
//   street: String,
//   city: String,
//   state: String,
//   postalCode: String,
//   // Các trường khác mà bạn muốn thêm vào địa chỉ
// });

const addressSchema = mongoose.Schema(
  {
    addresses: {
      type: Array,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);
// Blog.belongsTo(Category, { foreignKey: 'categoryId' });

// add plugin that converts mongoose to json
addressSchema.plugin(toJSON);
addressSchema.plugin(paginate);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
