const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const Category = require('./category.model');

const ListFavoriteSchema = mongoose.Schema({
  items: Array,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// add plugin that converts mongoose to json
ListFavoriteSchema.plugin(toJSON);
ListFavoriteSchema.plugin(paginate);

const ListFavorite = mongoose.model('ListFavorite', ListFavoriteSchema);

module.exports = ListFavorite;
