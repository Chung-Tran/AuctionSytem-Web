const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ProductCategory, ProductCondition, ProductStatus } = require('../common/constant')

const ProductSchema = new Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },// Mô tả chi tiết về sản phẩm
  address: { type: String, required: true },// Địa chỉ của sản phẩm
  seller: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },// ID của người dki đấu giá
  images: [{ type: String }],

  category: { type: String, enum: Object.values(ProductCategory)},
  // category: { type: String, enum: ['Electronics', 'Fashion', 'HomeGoods', 'Food_Beverages', 'Health_Beauty', 'Sports_Outdoors', 'Books_Stationery'] },// danh mục sản phẩm: tài sản hiện vật

  condition: { type: String, enum: Object.values(ProductCondition)},
  // condition: { type: String, enum: ['new', 'used', 'refurbished'] },// Tình trạng sản phẩm: mới, đã sử dụng, tân trang
  
  status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.pending},
  // status: { type: String, enum: ['pending', 'active', 'sold', 'cancelled'], default: 'pending' },// Trạng thái đấu giá: chờ duyệt, đang diễn ra, đã bán, đã hủy
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date}
});

module.exports = mongoose.model('Product', ProductSchema);