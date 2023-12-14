const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Comment = require('../models/comment.model');
const mongoose = require('mongoose');
const Review = require('../models/review.model');
const { ObjectId } = mongoose.Types;

const createReview = async (body) => {
  return Review.create(body);
};

const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

module.exports = {
  createReview,
  queryReviews,
};
