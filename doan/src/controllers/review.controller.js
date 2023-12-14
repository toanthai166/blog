const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService, reviewService } = require('../services');
const Comment = require('../models/comment.model');
const { User } = require('../models');
const Product = require('../models/product.model');
const Review = require('../models/review.model');

const createReview = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  const product = await Product.findById(req.body.productId);
  const totalReviews = await Review.countDocuments({ productId: req.body.productId });
  const reviewResults = await Review.find({ productId: req.body.productId });
  const totalRating = reviewResults.reduce((sum, obj) => sum + obj.rating, 0) + req.body.rating;
  const rating = totalRating / (totalReviews + 1);
  await Product.updateOne(
    { _id: req.body.productId },
    { $set: { rating: rating.toFixed(1), totalReview: totalReviews + 1 } }
  );

  if (!user) {
    throw new Error('user not found');
  }

  req.body.user = user.toObject();
  await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).send(req.body);
});

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productId', 'rating']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reviewService.queryReviews(filter, options);
  res.send(result);
});

module.exports = {
  getReviews,
  createReview,
};
