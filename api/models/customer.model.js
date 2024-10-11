const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    avatar: { type: String }, //URL từ cloudinary
    IndentifyCode:{ type: String },//CCCD
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = {
    Customer: mongoose.model('Customer', CustomerSchema),
};  