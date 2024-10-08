const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { blogService } = require('../services');
const Category = require('../models/category.model');
const Discount = require('../models/discount.model');
const { mongoose } = require('../config/config');

const createBlog = catchAsync(async (req, res) => {
  const newBlog = {
    ...req.body,
    author: req.user,
  };
  console.log(newBlog);
  await blogService.createBlog(newBlog);
  res.status(httpStatus.CREATED).send(newBlog);
});

const changeIsFavoriteBlog = catchAsync(async (req, res) => {
  if (!req.params.blogId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }
  const blog = await blogService.updateBlogById(req.params.blogId, req.body);
  res.send(blog);
});

const changeIsActiveBlog = catchAsync(async (req, res) => {
  if (!req.body.blogId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }
  console.log(req.body);
  const newBlog = {
    ...req.body,
    updateAt: Date.now(),
  };
  const blog = await blogService.updateBlogById(req.body.blogId, newBlog);
  res.send(blog);
});

const getBlogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['categoryId', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (req.query.title) {
    const titleRegex = new RegExp(req.query.title, 'i');

    filter.title = titleRegex;
  }
  const result = await blogService.queryBlogs(filter, options);
  result.results.forEach((item) => {
    item.content = item.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  });
  const discounts = await Discount.find({});
  discounts.forEach(async (item) => {
    await mongoose.connection;
    const currentDate = new Date();
    if (new Date(item.endDate) < currentDate) {
      await Discount.updateOne({ _id: item.id }, { $set: { isActive: false } });
    }
  });
  res.send(result);
});

const getBlog = catchAsync(async (req, res) => {
  const blog = await blogService.getBlogById(req.params.blogId);
  const content = blog.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
  }
  const { isActive, isFavorite, _id, title, categoryId, image, category } = blog;
  const newblog = { isActive, isFavorite, _id, title, categoryId, image, content: content, category };
  res.send(newblog);
});

const updateBlog = catchAsync(async (req, res) => {
  const blog = await blogService.updateBlogById(req.params.blogId, req.body);
  res.send(blog);
});

const deleteBlog = catchAsync(async (req, res) => {
  await blogService.deleteBlogById(req.params.blogId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  changeIsFavoriteBlog,
  changeIsActiveBlog,
  updateBlog,
  deleteBlog,
};
