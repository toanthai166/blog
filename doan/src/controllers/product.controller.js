const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const Category = require('../models/category.model');

const createProduct = catchAsync(async (req, res) => {
  await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(req.body);
});

const changeIsActiveProduct = catchAsync(async (req, res) => {
  if (!req.params.id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const product = await productService.updateProductById(req.params.id, req.body);
  res.send(product);
});
const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['categoryId', 'isActive']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  const description = product.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  const {
    _id,
    name,
    image,
    author,
    unitPrice,
    quantity,
    issuingCompany,
    publicationDate,
    coverType,
    numberOfPages,
    size,
    rating,
    totalReview,
  } = product;
  const newProduct = {
    author,
    quantity,
    _id,
    name,
    unitPrice,
    image,
    issuingCompany,
    publicationDate,
    coverType,
    numberOfPages,
    size,
    description: description,
    rating,
    totalReview,
  };
  res.send(newProduct);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.id, req.body);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  changeIsActiveProduct,
  updateProduct,
  deleteProduct,
};
