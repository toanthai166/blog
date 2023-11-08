const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { addressService, discountService } = require('../services');
const Address = require('../models/address.model');

const createDiscount = catchAsync(async (req, res) => {
  await discountService.createDisCount(req.body);
  res.status(httpStatus.CREATED).send(req.body);
});

const changeIsActiveDiscount = catchAsync(async (req, res) => {
  const FAQ = await discountService.updateDiscount(req.params.id, req.body);
  res.send(FAQ);
});
// if (req.query.productIds) {
//   console.log(1);
// }

const getDiscounts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isActive']);

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await discountService.queryDiscounts(filter, options);

  if (req.query.productIds) {
    const productIds = JSON.parse(req.query.productIds);
    const desiredData = result.results.filter((item) => productIds.some((id) => item.productIds.includes(id)));
    if (desiredData.length > 0) {
      res.send(desiredData);
    } else {
      console.log('không tìm thấy id tương ứng');
    }
  } else {
    res.send(result);
  }
});

const getDiscount = catchAsync(async (req, res) => {
  const address = await discountService.getDiscountById(req.params.id);
  res.send(address);
});
const updateDiscountById = catchAsync(async (req, res) => {
  console.log(req.body);
  const FAQ = await discountService.updateDiscount(req.params.id, req.body);
  res.send(FAQ);
});

module.exports = {
  createDiscount,
  getDiscounts,
  updateDiscountById,
  getDiscount,
  changeIsActiveDiscount,
};
