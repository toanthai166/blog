const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartService, listFavoriteService } = require('../services');
const Category = require('../models/category.model');
const Blog = require('../models/blog.model');
const ListFavorite = require('../models/listFavorite.model');
const { log } = require('../config/logger');

const addToListFavorite = catchAsync(async (req, res) => {
  const newItem = {
    ...req.body,
    userId: req.user.id,
  };
  const userId = req.user.id;
  const posts = await ListFavorite.findOne({ userId });
  const foundProduct = await Blog.findById(req.body.blogId);
  if (posts === null) {
    const listFavorite = [];
    listFavorite.push(foundProduct);
    await Blog.updateOne({ _id: req.body.blogId }, { $set: { isFavorite: true } });
    await listFavoriteService.addToListFavorite({ ...newItem, items: listFavorite });
    res.status(httpStatus.CREATED).send({ ...newItem, items: listFavorite });
  } else {
    const list = posts.items.push(foundProduct);
    await listFavoriteService.updateListFavorite(posts.id, { items: posts.items });
    await Blog.updateOne({ _id: req.body.blogId }, { $set: { isFavorite: true } });
    res.status(httpStatus.CREATED).send({ ...newItem, items: list });
  }
});

const removeToLitFavorite = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const list = await ListFavorite.findOne({ userId });
  const newData = list.items.filter((item) => {
    return String(item._id) !== req.body.blogId;
  });
  await Blog.updateOne({ _id: req.body.blogId }, { $set: { isFavorite: false } });
  const cartItem = await listFavoriteService.updateListFavorite(list.id, { items: newData });
  res.send(cartItem);
});

const listFavorite = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await listFavoriteService.lisFavorite(filter, options);
  res.send(result);
});

module.exports = {
  addToListFavorite,
  listFavorite,
  removeToLitFavorite,
};
