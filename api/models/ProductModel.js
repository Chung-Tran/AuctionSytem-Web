const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },// Mô tả chi tiết về sản phẩm
//   category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },// ID của danh mục sản phẩm, Chưa xác định mô hình có category hay không
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },// ID của người bán
  startingPrice: { type: Number, required: true },// Giá khởi điểm của sản phẩm
  currentPrice: { type: Number, required: true },// Giá hiện tại của sản phẩm (cập nhật khi có lượt đấu giá mới)
  images: [{ type: String }],
  condition: { type: String, enum: ['new', 'used', 'refurbished'] },// Tình trạng sản phẩm: mới, đã sử dụng, tân trang
  status: { type: String, enum: ['pending', 'active', 'sold', 'cancelled'], default: 'pending' },// Trạng thái đấu giá: chờ duyệt, đang diễn ra, đã bán, đã hủy
  startTime: { type: Date, required: true },// Thời gian bắt đầu đấu giá
  endTime: { type: Date, required: true },// Thời gian kết thúc đấu giá
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date}
});

module.exports = mongoose.model('Product', ProductSchema);