const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { Notification } = require('../models/notification.model');
const { default: mongoose } = require('mongoose');
const { formatResponse } = require('../common/MethodsCommon');
const { verifyAccessToken } = require('../middlewares/Authentication');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get(
	'/',
	verifyAccessToken,
	expressAsyncHandler(async (req, res) => {
		try {
			const { userId } = req.user;
			const { limit = 10, page = 1, type } = req.query;
			const parsedLimit = parseInt(limit, 10);
			const parsedPage = parseInt(page, 10);
			const skip = (parsedPage - 1) * parsedLimit;

			const pipeline = [
				{
					$match: {
						$and: [{ ownerId: new mongoose.Types.ObjectId(userId) }, type ? { type }: {}],
					},
				},
				{ $skip: skip },
				{ $limit: parsedLimit },
			];

			const result = await Notification.aggregate(pipeline);
			return res.json(formatResponse(true, result, ''));
		} catch (error) {
			console.error('Lỗi khi lấy danh sách thông báo:', error);
			res.status(500).json(formatResponse(false, null, 'Đã xảy ra lỗi khi lấy danh sách thông báo.'));
		}
	}),
);

router.post(
	'/makeRead/all',
	verifyAccessToken,
	expressAsyncHandler(async (req, res) => {
        const { userId } = req.user;

		await Notification.updateMany({ ownerId: userId, isRead: false }, { $set: { isRead: true } });

		return res.json(formatResponse(true));
	}),
);

router.post(
	'/makeRead/:notifyId',
	verifyAccessToken,
	expressAsyncHandler(async (req, res) => {
		const { notifyId } = req.params;
        const { userId } = req.user;

		await Notification.findOneAndUpdate({ _id: notifyId, ownerId: userId }, { $set: { isRead: true } });

		return res.json(formatResponse(true));
	}),
);

router.get("/test", async (req, res) => {
    const password = await bcrypt.hash('zaqxsw', 10)
    return res.json(password)
})

module.exports = router;
