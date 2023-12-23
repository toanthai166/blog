const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const Order = require('../models/order.model');

const getReportOrder = catchAsync(async (req, res) => {
  console.log('req.time :>> ', req.query.time);
  const timeQuery = req.query.time;
  const currentDate = new Date();

  // Xác định ngày đầu tiên của tuần hiện tại
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  if (timeQuery == 'weekly') {
    // Xác định ngày cuối cùng của tuần hiện tại
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

    // Thực hiện truy vấn để lấy đơn hàng trong khoảng thời gian từ startOfWeek đến endOfWeek
    const completedOrdersInCurrentWeek = await Order.find({
      status: 'complete',
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    });
    const transformedData = completedOrdersInCurrentWeek.map((order) => {
      // Chuyển đổi định dạng của createdAt thành 'YYYY-MM-DD'
      const date = new Date(order.createdAt).toISOString().split('T')[0];

      // Trả về đối tượng mới với định dạng mong muốn
      return {
        date,
        revenue: order.total,
      };
    });
    res.send({
      report: transformedData,
      orderDetails: completedOrdersInCurrentWeek,
    });
  }

  if (timeQuery == 'monthly') {
    // Xác định ngày cuối cùng của tuần hiện tại
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    // Thực hiện truy vấn để lấy đơn hàng trong khoảng thời gian từ startOfWeek đến endOfWeek
    const completedOrdersInCurrentWeek = await Order.find({
      status: 'complete',
      createdAt: { $gte: thirtyDaysAgo, $lte: currentDate },
    });
    const transformedData = completedOrdersInCurrentWeek.map((order) => {
      // Chuyển đổi định dạng của createdAt thành 'YYYY-MM-DD'
      const date = new Date(order.createdAt).toISOString().split('T')[0];

      // Trả về đối tượng mới với định dạng mong muốn
      return {
        date,
        revenue: order.total,
      };
    });

    const revenueByDate = new Map();

    transformedData.forEach((item) => {
      const date = item.date;
      const revenue = item.revenue;

      if (revenueByDate.has(date)) {
        revenueByDate.set(date, revenueByDate.get(date) + revenue);
      } else {
        revenueByDate.set(date, revenue);
      }
    });

    const result = Array.from(revenueByDate, ([date, revenue]) => ({ date, revenue }));
    res.send({
      report: result,
      orderDetails: completedOrdersInCurrentWeek,
    });
  }
  if (timeQuery == 'yearly') {
    // Xác định ngày cuối cùng của tuần hiện tại
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Thực hiện truy vấn để lấy đơn hàng trong khoảng thời gian từ startOfWeek đến endOfWeek
    const completedOrdersInCurrentWeek = await Order.find({
      status: 'complete',
      createdAt: { $gte: oneYearAgo, $lte: currentDate },
    });
    const transformedData = completedOrdersInCurrentWeek.map((order) => {
      // Chuyển đổi định dạng của createdAt thành 'YYYY-MM-DD'
      const date = new Date(order.createdAt).toISOString().slice(0, 7);

      // Trả về đối tượng mới với định dạng mong muốn
      return {
        date,
        revenue: order.total,
      };
    });
    const revenueByDate = new Map();

    transformedData.forEach((item) => {
      const date = item.date;
      const revenue = item.revenue;

      if (revenueByDate.has(date)) {
        revenueByDate.set(date, revenueByDate.get(date) + revenue);
      } else {
        revenueByDate.set(date, revenue);
      }
    });

    const result = Array.from(revenueByDate, ([date, revenue]) => ({ date, revenue }));
    res.send({
      report: result,
      orderDetails: completedOrdersInCurrentWeek,
    });
  }
});

module.exports = {
  getReportOrder,
};
