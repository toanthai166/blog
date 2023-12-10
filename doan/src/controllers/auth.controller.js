const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ListFavorite = require('../models/listFavorite.model');
const Blog = require('../models/blog.model');
const { mongoose } = require('../config/config');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const userId = user.id;
  if (user) {
    const posts = await ListFavorite.findOne({ userId });
    const blogs = await Blog.find({});
    blogs.forEach(async (item) => {
      const matchingItem = posts.items.find((itemA) => {
        return String(itemA._id) === String(item.id);
      });

      if (matchingItem) {
        await mongoose.connection;
        // Cập nhật trạng thái trong cơ sở dữ liệu
        await Blog.updateOne({ _id: item.id }, { $set: { isFavorite: true } });
      }
    });
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const blogs = await Blog.find({});
  blogs.forEach(async (item) => {
    console.log('item :>> ', item);
    await mongoose.connection;
    // Cập nhật trạng thái trong cơ sở dữ liệu
    await Blog.updateOne({ _id: item.id }, { $set: { isFavorite: false } });
  });
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
