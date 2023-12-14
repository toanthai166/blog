const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ReviewSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: Object,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
ReviewSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.createdAt = doc.createdAt;
    ret.updatedAt = doc.updatedAt;
  },
});

// add plugin that converts mongoose to json
ReviewSchema.plugin(toJSON);
ReviewSchema.plugin(paginate);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
