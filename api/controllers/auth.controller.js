const asyncHandle = require('express-async-handler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const { User } = require('../models/user.model');
const { formatResponse } = require('../common/MethodsCommon');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/Authentication')
const { sendEmail } = require("../utils/email")
const { EmailType } = require("../common/constant")
const redisClient = require("../config/redis")
const { parseDuration, parseDurationToHumanFormat } = require("../utils/time");


const employeeLogin = asyncHandle(async (req, res) => {
    const { username, password } = req.body;

    // Find employee by username
    const employee = await User.findOne({ username });
    if (!employee) {
        return res.status(401).json(formatResponse(false, null, "Invalid username or password"));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, employee.hashedPassword);
    if (!isMatch) {
        return res.status(401).json(formatResponse(false, null, "Invalid username or password"));
    }

    // Create JWT access token & refresh token
    const { sessionKey } = await generateRefreshToken(employee._id, process.env.EMPLOYEERE_FRESH_TOKEN_EXPIRED);
    const accessToken = generateAccessToken(employee._id, sessionKey, process.env.EMPLOYEE_ACCESS_TOKEN_EXPIRED);
    res.setHeader('x-new-access-token', accessToken);
    res.status(200).json(formatResponse(true, employee, null));
});

const employeeSendOTPCode = asyncHandle(async (req, res) => {
    const { email } = req.body;

    // check email in DB
    const employee = await User.findOne({ email });
    if (!employee) {
        return res.status(401).json(formatResponse(false, null, "Invalid email"));
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP into Redis
    const otpExpired = parseDuration(process.env.RESET_PASSWORD_OTP_EXPIRED) / 1000; // seconds
    const otpKey = `reset_pass_otp_${employee.username}`;
    const otpValue = JSON.stringify({ otpHashed: await bcrypt.hash(otp, 10) })
    await redisClient.setEx(otpKey, otpExpired, otpValue,);


    // Send OTP
    const isSuccessed = await sendEmail(
        email,
        EmailType.RESET_PASSWORD_OTP,
        {
            otp,
            fullName: employee.fullName,
            expiryTime: parseDurationToHumanFormat(process.env.RESET_PASSWORD_OTP_EXPIRED)
        }
    );


    if (isSuccessed)
        res.status(200).json(formatResponse(true, null, "OTP sent successfully."));
    else
        res.status(500).json(formatResponse(false, null, "Failed to send OTP."));


});

const employeeResetPassword = asyncHandle(async (req, res) => {
    const { username, newPassword, otp } = req.body;

    // validate otp 
    const value = await redisClient.get(`reset_pass_otp_${username}`);
    const { otpHashed } = value ? JSON.parse(value) : {};
    if (!otpHashed)
        return res.status(400).json(formatResponse(false, null, "OTP Invalid."));

    const isMatch = await bcrypt.compare(otp, otpHashed);
    if (!isMatch)
        return res.status(400).json(formatResponse(false, null, "OTP Invalid."));

    // change password
    const employee = await User.findOne({ username });
    if (!employee)
        return res.status(404).json(formatResponse(false, null, "Employee not found."))

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    employee.hashedPassword = hashedPassword;
    await employee.save();

    return res.status(400).json(formatResponse(true, null, "Password has been reseted."));
});

module.exports = { employeeLogin, employeeSendOTPCode, employeeResetPassword };
