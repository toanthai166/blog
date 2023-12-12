const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const Category = require('./category.model');
const { array } = require('joi');

const discountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    limit: {
      type: Number,
      required: true,
    },
    used: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: ['VND', 'PERCENTAGE'],
      required: true,
    },
    productIds: { type: Array },
    isActive: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    limitPerAccount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

discountSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.createdAt = doc.createdAt;
    ret.updatedAt = doc.updatedAt;
  },
});
// Blog.belongsTo(Category, { foreignKey: 'categoryId' });

// add plugin that converts mongoose to json
discountSchema.plugin(toJSON);
discountSchema.plugin(paginate);

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
