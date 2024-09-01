const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    avatar: { type: String }, //URL từ cloudinary
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }], //List role, role->permission
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date}
});

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    sessionKey: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d', 
    },
});

module.exports = {
    RefreshToken: mongoose.model('RefreshToken', refreshTokenSchema),
    User: mongoose.model('User', UserSchema),
};  