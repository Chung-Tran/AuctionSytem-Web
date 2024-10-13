const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { EmployeeStatus } = require("../common/constant")

const EmployeeSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(EmployeeStatus),
            default: EmployeeStatus.ACTIVE
        },
        rolePermission: { type: mongoose.Schema.Types.ObjectId, ref: 'RolePermission', require: true}, 

        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            // ref: 'User'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            // ref: 'User'
        },
        

    },
    { timestamps: true }
);

EmployeeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = {
    Employee: mongoose.model("Employee", EmployeeSchema),
} 