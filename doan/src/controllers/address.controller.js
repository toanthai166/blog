const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { addressService } = require('../services');
const Address = require('../models/address.model');

const createAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const addresses = await Address.findOne({ userId });
  if (addresses === null) {
    const id = new Date().getTime();
    const addresses = [];
    req.body.id = String(id);
    addresses.push({ ...req.body });
    await addressService.createAddress({ addresses: addresses, userId: req.user.id });
    res.status(httpStatus.CREATED).send({ addresses: addresses, userId: req.user.id });
  } else {
    if (req.body.id) {
      const address = addresses.addresses.filter((it) => it.id !== req.body.id);
      address.forEach((item) => {
        item.isDefault = false;
      });

      address.push({ ...req.body });
      const newAddress = await addressService.updateAddress(addresses.id, { addresses: address });
      res.send(newAddress);
    } else {
      const id = new Date().getTime();
      req.body.id = String(id);
      if (req.body.isDefault == true) {
        addresses.addresses.forEach((item) => {
          item.isDefault = false;
        });
      }
      addresses.addresses.push({ ...req.body });
      const newAddress = await addressService.updateAddress(addresses.id, { addresses: addresses.addresses });
      res.send(newAddress);
    }
  }
});

const getAddresses = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await addressService.queryAddresses(filter, options);
  res.send(result);
});

const getAddress = catchAsync(async (req, res) => {
  const address = await addressService.getAddresById(req.params.id);
  res.send(address);
});

const removeAddress = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const addresses = await Address.findOne({ userId });
  const newData = addresses.addresses.filter((item) => {
    return String(item.id) !== req.body.addressId;
  });
  const address = await addressService.updateAddress(addresses.id, { addresses: newData });
  res.send(address);
});

module.exports = {
  createAddress,
  getAddresses,
  removeAddress,
  getAddress,
};
