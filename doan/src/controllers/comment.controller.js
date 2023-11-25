const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { commentService } = require('../services');
const Comment = require('../models/comment.model');
const { User } = require('../models');

const createComment = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  console.log(user);

  if (!user) {
    throw new Error('user not found');
  }

  req.body.user = user.toObject();
  console.log('req.body', req.body);
  await commentService.createComment(req.body);
  res.status(httpStatus.CREATED).send(req.body);
});

const getCommentByBlogId = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const listCommentByBlog = await Comment.find({ blogId: blogId });

  res.send(listCommentByBlog);
});

const updateCommentById = catchAsync(async (req, res) => {
  // const newComment = {
  //   ...req.body,
  //   updateAt: Date.now(),
  // };
  const comment = await commentService.updateCommentById(req.params.commentId, req.body);
  res.send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  deleteComment,
  updateCommentById,
  getCommentByBlogId,
  createComment,
};
