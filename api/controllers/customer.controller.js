const asyncHandle = require('express-async-handler');
const bcrypt = require('bcrypt');
const { formatResponse } = require('../common/MethodsCommon');
const { Customer } = require('../models/customer.model');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/Authentication');
const { sendAccountCreationOTP, sendPasswordResetOTP } = require('../utils/email');
const redisClient = require('../config/redis');
const crypto = require('crypto');

const createCustomer = asyncHandle(async (req, res) => {
    const { fullName, username, email, phoneNumber, password, status, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json(formatResponse(false, { message: "Email or OTP missing!" }, "Email or OTP missing!"));
    }

    const cachedOtp = await redisClient.get(email.toLowerCase());
    if (!cachedOtp) {
        return res.status(400).json(formatResponse(false, { message: "OTP expired or invalid!" }, "OTP expired or invalid!"));
    }

    if (cachedOtp !== otp) {
        return res.status(400).json(formatResponse(false, { message: "OTP is incorrect!" }, "OTP is incorrect!"));
    }

    const existingCustomer = await Customer.findOne({
        $or: [{ username }, { email: email.toLowerCase() }]
    });
    if (existingCustomer) {
        if (existingCustomer.username === username)
            return res.status(400).json(formatResponse(false, { message: "Username already exists!" }, "Username already exists!"));
        if (existingCustomer.email === email.toLowerCase())
            return res.status(400).json(formatResponse(false, { message: "Email already exists!" }, "Email already exists!"));
        return res.status(400).json(formatResponse(false, { message: "Account already exists!" }, "Account already exists!"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
        fullName,
        username,
        email: email.toLowerCase(),
        phoneNumber,
        password: hashedPassword,
        status
    });

    const { password: _, ...customerResponse } = customer.toObject();
    await redisClient.del(email.toLowerCase());

    res.status(201).json(formatResponse(true, customerResponse, "Customer created successfully!"));
});

const sendOTPCreateAccount = asyncHandle(async (req, res) => {
    const { email } = req.body;
    if (!email)
        res.status(400).json(formatResponse(false, { message: "Email invalid!" }, "Email invalid!"));
    const { otp, success } = await sendAccountCreationOTP(email);
    if (!success)
        res.status(400).json(formatResponse(false, { message: "Send otp failed!" }, "Send otp failed!"));
    await redisClient.setEx(email, 180, otp);
    res.status(200).json(formatResponse(true, { message: "Send OTP successfully!" }, "Send OTP successfully!"));
});

const getCustomerById = asyncHandle(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        return res.status(404).json(formatResponse(false, null, "Customer not found"));
    }

    const { hashedPassword: _, ...customerResponse } = customer.toObject();
    delete customerResponse.password
    res.status(200).json(formatResponse(true, customerResponse, "Customer retrieved successfully!"));
});

const updateCustomer = asyncHandle(async (req, res) => {
    const { fullName, username, email, phoneNumber, password, status } = req.body;

    const updates = { fullName, username, email: email.toLowerCase(), phoneNumber, status }; // Normalize email
    if (password) {
        updates.hashedPassword = await bcrypt.hash(password, 10);
    }

    const customer = await Customer.findOneAndUpdate({ username: username }, updates, {
        new: true,
        runValidators: true
    });
    if (!customer) {
        return res.status(404).json(formatResponse(false, null, "Customer not found"));
    }

    const { hashedPassword: _, ...customerResponse } = customer.toObject();
    res.status(200).json(formatResponse(true, customerResponse, "Customer updated successfully!"));
});

const deleteCustomer = asyncHandle(async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
        return res.status(404).json(formatResponse(false, null, "Customer not found"));
    }

    res.status(200).json(formatResponse(true, null, "Customer deleted successfully!"));
});

const loginCustomer = asyncHandle(async (req, res) => {
    const { username, password } = req.body;

    const customer = await Customer.findOne({
        $or: [{ username }, { email: username.toLowerCase() }]
    });

    if (!customer) {
        return res.status(400).json(formatResponse(false, null, "Invalid username or password"));
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
        return res.status(400).json(formatResponse(false, null, "Invalid username or password"));
    }

    // Tạo access token và refresh token
    const { sessionKey } = await generateRefreshToken(customer._id)
    const accessToken = generateAccessToken(customer._id, sessionKey,customer.userCode);
    res.setHeader('x-new-access-token', accessToken);
    res.status(200).json(formatResponse(true, {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        username: customer.username
    }, null));

});

//Send otp=>Verify otp=>change password
const sendOTPForPasswordReset = asyncHandle(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json(formatResponse(false, { message: "Email is required!" }, "Email is required!"));
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
        return res.status(400).json(formatResponse(false, { message: "No account found with this email!" }, "No account found with this email!"));
    }

    const { success, otp } = await sendPasswordResetOTP(email);

    if (!success) {
        return res.status(500).json(formatResponse(false, { message: "Failed to send OTP!" }, "Failed to send OTP!"));
    }

    await redisClient.setEx(`pwd_reset_${email.toLowerCase()}`, 180, otp);

    res.status(200).json(formatResponse(true, { message: "Password reset OTP sent successfully!" }, "Password reset OTP sent successfully!"));
});

const verifyOTP = asyncHandle(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json(formatResponse(false, { message: "Email and OTP are required!" }, "Email and OTP are required!"));
    }

    const cachedOtp = await redisClient.get(`pwd_reset_${email.toLowerCase()}`);
    if (!cachedOtp) {
        return res.status(400).json(formatResponse(false, null, "OTP expired or invalid!"));
    }

    if (cachedOtp !== otp) {
        return res.status(400).json(formatResponse(false, null, "Incorrect OTP!"));
    }

    // OTP chính xác => tạo một token mới cho bước đổi mật khẩu, xóa otp cũ
    const resetToken = crypto.randomBytes(20).toString('hex');
    await redisClient.setEx(`pwd_reset_token_${email.toLowerCase()}`, 300, resetToken);
    await redisClient.del(`pwd_reset_${email.toLowerCase()}`);

    res.status(200).json(formatResponse(true, { key: resetToken }, "OTP verified successfully!"));
});

const resetPassword = asyncHandle(async (req, res) => {
    const { email, otpKey, newPassword } = req.body;

    if (!email || !otpKey || !newPassword) {
        return res.status(400).json(formatResponse(false, null, "Invalid data. Try again!"));
    }

    const cachedToken = await redisClient.get(`pwd_reset_token_${email.toLowerCase()}`);
    if (!cachedToken || cachedToken !== otpKey) {
        return res.status(400).json(formatResponse(false, null, "Cannot reset password!"));
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
        return res.status(404).json(formatResponse(false, { message: "Customer not found!" }, "Customer not found!"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;
    await customer.save();

    await redisClient.del(`pwd_reset_token_${email.toLowerCase()}`);

    res.status(200).json(formatResponse(true, { message: "Password reset successfully!" }, "Password reset successfully!"));
});



module.exports = {
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    loginCustomer,
    sendOTPCreateAccount,
    sendOTPForPasswordReset,
    resetPassword,
    verifyOTP,
};
