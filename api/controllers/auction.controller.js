const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const { Auction } = require('../models/auction.model');
const Customer = require('../models/customer.model');
const { formatResponse } = require('../common/MethodsCommon');
const redisClient = require('../config/redis');

const registerAuctionProduct = asyncHandler(async (req, res) => {
    const {
        productName,
        description,
        address,
        category,
        sellerName,
        condition,
        startingPrice,
        bidIncrement,
        auctionType,
        deposit,
        contactEmail,
        images
    } = req.body;
    const sellerId = req.user.userId;

    try {
        const product = new Product({
            productName,
            description,
            address,
            category,
            seller: sellerId,
            images: images || [],
            condition,
            status: 'pending'
        });
        const auction = new Auction({
            product: product._id,
            title: productName,
            description,
            sellerName,
            contactEmail,
            startingPrice,
            bidIncrement,
            deposit,
            status: 'pending',
            createdBy: sellerId,
        });
        await product.save();
        await auction.save();

        res.status(201).json(formatResponse(true, {
            productId: product._id,
            auctionId: auction._id
        }, "Success"));
    } catch (error) {
        console.error('Lỗi khi đăng ký sản phẩm đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi đăng ký sản phẩm đấu giá"));
    }
});

const approveAuction = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;
    const {
        startTime,
        endTime,
        registrationOpenDate,
        registrationCloseDate,
        reservePrice,
        registrationFee
    } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy phiên đấu giá"));
    }

    if (auction.status !== 'pending') {
        return res.status(400).json(formatResponse(false, null, "Phiên đấu giá không ở trạng thái chờ duyệt"));
    }

    try {
        auction.startTime = startTime;
        auction.endTime = endTime;
        auction.registrationOpenDate = registrationOpenDate;
        auction.registrationCloseDate = registrationCloseDate;
        auction.reservePrice = reservePrice;
        auction.registrationFee = registrationFee;
        auction.status = 'active';

        await auction.save();

        await Product.findByIdAndUpdate(auction.product, { status: 'active' });

        res.status(200).json(formatResponse(true, { auctionId: auction._id }, "Phiên đấu giá đã được duyệt và kích hoạt thành công"));
    } catch (error) {
        console.error('Lỗi khi duyệt phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi duyệt phiên đấu giá"));
    }
});

const rejectAuction = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json(formatResponse(false, null, "Vui lòng cung cấp lý do từ chối"));
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy phiên đấu giá"));
    }

    if (auction.status !== 'pending') {
        return res.status(400).json(formatResponse(false, null, "Phiên đấu giá không ở trạng thái chờ duyệt"));
    }

    try {
        auction.status = 'cancelled';
        auction.cancellationReason = reason;
        await auction.save();

        await Product.findByIdAndUpdate(auction.product, { status: 'cancelled' });

        res.status(200).json(formatResponse(true, { auctionId: auction._id }, "Phiên đấu giá đã bị từ chối"));
    } catch (error) {
        console.error('Lỗi khi từ chối phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi từ chối phiên đấu giá"));
    }
});

//Get by slug
const getAuctionDetails = asyncHandler(async (req, res) => {
    const { auctionSlug } = req.params;

    try {
        let pipeline = [];

        pipeline.push(
            {
                $match: { slug: auctionSlug }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            });

        pipeline.push({
            $sort: { createdAt: -1 }
        });

        pipeline.push(
            {
                $project: {
                    //Product
                    productName: "$product.productName",
                    productImages: "$product.images",
                    productDescription: "$product.description",
                    productAddress: "$product.address",

                    //Auction
                    currentViews: 1,
                    sellerName: 1,
                    reservePrice: 1,
                    startingPrice: 1,
                    startTime: 1,
                    bidIncrement: 1,
                    registrationOpenDate: 1,
                    registrationCloseDate: 1,
                    deposit: 1,
                    registrationFee: 1,
                }
            },
            {
                $limit: 1
            }
        );
        const auctions = await Auction.aggregate(pipeline);
        res.status(200).json(formatResponse(true, auctions[0], ""));
    } catch (error) {
        console.error('Lỗi khi lấy thông phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi lấy danh sách phiên đấu giá"));
    }
});
//Auction nổi bật(hightlight)
const getAuctionOutstanding = asyncHandler(async (req, res) => {
    try {
        let pipeline = [];
        pipeline.push(
            {
                $match: { outstanding: true }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            });

        pipeline.push({
            $sort: { createdAt: -1 }
        });

        pipeline.push(
            {
                $project: {
                    //Product
                    productName: "$product.productName",
                    productImages: "$product.images",
                    productDescription: "$product.description",
                    productAddress: "$product.address",

                    //Auction
                    currentViews: 1,
                    sellerName: 1,
                    reservePrice: 1,
                    startingPrice: 1,
                    startTime: 1,
                    bidIncrement: 1,
                    registrationOpenDate: 1,
                    registrationCloseDate: 1,
                    deposit: 1,
                    registrationFee: 1,
                }
            },
            {
                $limit: 1
            }
        );
        const auctions = await Auction.aggregate(pipeline);
        res.status(200).json(formatResponse(true, auctions[0], ""));
    } catch (error) {
        console.error('Lỗi khi lấy thông phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi lấy danh sách phiên đấu giá"));
    }
});

const listAuctions = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    try {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        let pipeline = [];

        if (status) {
            pipeline.push({
                $match: { status }
            });
        }
        pipeline.push(
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: '$product'
            });

        pipeline.push({
            $sort: { createdAt: -1 }
        });
        pipeline.push(
            { $skip: (pageInt - 1) * limitInt },
            { $limit: limitInt }
        );

        const totalAuctions = await Auction.countDocuments(status ? { status } : {});
        pipeline.push({
            $project: {
                productName: "$product.productName",
                productImages: "$product.images",
                productDescription: "$product.description",
                slug: 1,
                currentViews: 1,
                startingPrice: 1,
                registrationOpenDate: 1,
            }
        });
        const auctions = await Auction.aggregate(pipeline);
        res.status(200).json(formatResponse(true, {
            docs: auctions,
            total: totalAuctions,
            page: pageInt,
            limit: limitInt,
        }, ""));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi lấy danh sách phiên đấu giá"));
    }
});

//Đấu giá đang diễn ra
const ongoingList = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    try {
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        let pipeline = [];

        if (status) {
            pipeline.push({
                $match: { status }
            });
        }
        pipeline.push(
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $lookup: {
                    from: 'bidhistories',
                    localField: '_id',
                    foreignField: 'auction',
                    as: 'bidshistory'
                }
            },
            {
                $unwind: '$product'
            }
        );

        pipeline.push(
            {
                $addFields: {
                    highestBid: { $cond: { if: { $gt: [{ $size: "$bidshistory" }, 0] }, then: { $max: "$bidshistory.amount" }, else: null } },
                    timeRemain: { $subtract: ["$endTime", new Date()] } // Tính thời gian còn lại
                }
            }
        );

        pipeline.push({
            $sort: { createdAt: -1 }
        });

        pipeline.push(
            { $skip: (pageInt - 1) * limitInt },
            { $limit: limitInt }
        );

        const totalAuctions = await Auction.countDocuments(status ? { status } : {});
        pipeline.push({
            $project: {
                productName: "$product.productName",
                productImages: "$product.images",
                productDescription: "$product.description",

                participants: 1,
                slug: 1,
                currentViews: 1,
                startingPrice: 1,
                registrationOpenDate: 1,
                startTime: 1,
                endTime: 1,
            }
        });
        const auctions = await Auction.aggregate(pipeline);
        res.status(200).json(formatResponse(true, {
            docs: auctions,
            total: totalAuctions,
            page: pageInt,
            limit: limitInt,
        }, ""));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi lấy danh sách phiên đấu giá"));
    }
});

//Check customer có trong danh sách đăng ký đấu giá hay không
const checkValidAccess = asyncHandler(async (req, res) => {
    const customerId = req.user.userId;

    try {
        const auction = await Auction.findOne({
            status: 'active',
            startTime: { $lte: new Date() },
            endTime: { $gte: new Date() },
            'registeredUsers': {
                $elemMatch: {
                    customer: customerId,
                    status: 'active',
                    // transaction: { $exists: true }
                }
            }
        }).select('registeredUsers.$');

        if (auction && auction.registeredUsers.length > 0) {
            res.status(200).json(formatResponse(true, { allow: true }, "Allow access"));
        } else {
            res.status(200).json(formatResponse(true, { allow: false, viewOnly: true }, "Allow access: View only"));
        }
    } catch (error) {
        console.error('Error checking auction access:', error);
        res.status(500).json(formatResponse(false, null, "An error occurred while checking auction access"));
    }
});

const syncAuctionsToMongoDB = async () => {
    try {
        // Lấy tất cả các phiên đấu giá từ Redis
        const auctionKeys = await redisClient.keys('auction:*');

        for (const auctionKey of auctionKeys) {
            const auctionData = await redisClient.hGetAll(auctionKey);

            // Kiểm tra xem phiên đấu giá đã tồn tại trong MongoDB chưa
            let auction = await Auction.findOne({ _id: auctionData.id });

            if (!auction) {
                // Nếu chưa tồn tại, tạo một phiên đấu giá mới trong MongoDB
                auction = new Auction({
                    _id: auctionData.id,
                    product: auctionData.product,
                    title: auctionData.title,
                    // Chuyển các trường khác từ Redis sang MongoDB
                    status: auctionData.status,
                    startTime: new Date(auctionData.startTime),
                    endTime: new Date(auctionData.endTime),
                    // ...
                });
                await auction.save();
            } else {
                // Nếu đã tồn tại, cập nhật thông tin phiên đấu giá
                auction.currentPrice = auctionData.currentPrice;
                auction.currentViews = auctionData.currentViews;
                // Cập nhật các trường khác từ Redis sang MongoDB
                await auction.save();
            }

            // Đồng bộ lịch sử đấu giá từ Redis sang MongoDB
            const bidKeys = await redisClient.lrange(`${auctionKey}:bids`, 0, -1);
            for (const bidKey of bidKeys) {
                const bidData = JSON.parse(await redisClient.lIndex(`${auctionKey}:bids`, bidKey));
                const bid = new BidHistory({
                    auction: auction._id,
                    bidder: bidData.bidderId,
                    amount: bidData.bidAmount,
                    time: new Date(bidData.time)
                });
                await bid.save();
            }
        }

        console.log('Sync completed. Room: ',);
    } catch (err) {
        console.error('Error syncing data from Redis to MongoDB:', err);
    }
};

module.exports = syncAuctionsToMongoDB;

module.exports = {
    registerAuctionProduct,
    approveAuction,
    rejectAuction,
    listAuctions,
    getAuctionDetails,
    getAuctionOutstanding,
    ongoingList,
    checkValidAccess
};