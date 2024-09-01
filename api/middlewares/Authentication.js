const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {RefreshToken} = require('../models/UserModel');

// Tạo access token
function generateAccessToken(userId, sessionKey) {
    console.log(sessionKey)
    return jwt.sign({ userId, sessionKey }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

// Tạo refresh token
async function generateRefreshToken(userId) {
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hash = await bcrypt.hash(refreshToken, 10);

    const sessionKey = crypto.randomBytes(16).toString('hex'); // UUID session
    // await RefreshToken.deleteMany({ userId: userId });
    await RefreshToken.create({
        token: hash,
        sessionKey: sessionKey,
        userId: userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
    });

    return { refreshToken, sessionKey };
}
// Verify access token
async function verifyAccessToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            try {
                const decodedToken = jwt.decode(token);
                const { userId, sessionKey } = decodedToken;

                const refreshTokenRecord = await RefreshToken.findOne({ userId, sessionKey, isRevoked: false }).exec();
                if (!refreshTokenRecord || !refreshTokenRecord.token || new Date() > refreshTokenRecord.expiresAt) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                const { refreshToken: newRefreshToken, sessionKey: newSessionKey } = await generateRefreshToken(userId);
                const newAccessToken = generateAccessToken(userId, newSessionKey);
                const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

                await RefreshToken.findOneAndUpdate(
                    { userId, sessionKey },
                    { 
                        token: newRefreshTokenHash,
                        sessionKey: newSessionKey,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    },
                    { new: true }
                );

                res.setHeader('x-new-access-token', newAccessToken);
                // res.setHeader('x-new-refresh-token', newRefreshToken); 
                req.user = jwt.verify(newAccessToken, process.env.JWT_SECRET);
                next();
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                return res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken };