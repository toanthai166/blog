const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const blogRoute = require('./blog.route');
const categoryRoute = require('./category.route');
const commentRoute = require('./comment.route');
const faqRoute = require('./faq.route');
const productRoute = require('./product.route');
const favoriteRoute = require('./favorite.route');
const imageRoute = require('./image.route');
const feedbackRoute = require('./contact.route');
const addressRoute = require('./address.route');
const orderRoute = require('./order.route');
const cartRoute = require('./cart.route');
const reviewRouter = require('./review.route');
const listFavoriteRoute = require('./listFavorite.route');
const discountRoute = require('./discount.route');
const revenueRoute = require('./revenue.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/blog',
    route: blogRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/comment',
    route: commentRoute,
  },
  {
    path: '/faq',
    route: faqRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/reviews',
    route: reviewRouter,
  },
  {
    path: '/upload-image',
    route: imageRoute,
  },

  // {
  //   path: '/favorite',
  //   route: favoriteRoute,
  // },
  {
    path: '/address',
    route: addressRoute,
  },
  {
    path: '/feedback',
    route: feedbackRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/discount',
    route: discountRoute,
  },
  {
    path: '/favorites',
    route: listFavoriteRoute,
  },
  {
    path: '/revenue',
    route: revenueRoute,
  },
  ,
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
