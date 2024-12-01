const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const { Auction } = require('../models/auction.model');
// const Customer = require('../models/customer.model');
const { formatResponse } = require('../common/MethodsCommon');
const redisClient = require('../config/redis');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const moment = require('moment');
const mongoose = require('mongoose');

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
        const uploadPromises = req.files ? req.files.map(file => {
            return new Promise((resolve, reject) => {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;

                cloudinary.uploader.upload(dataURI, {
                    folder: 'auction-products',
                    resource_type: 'auto',
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                });
            });
        }) : [];

        const imageUrls = await Promise.all(uploadPromises);
        const product = new Product({
            productName,
            description,
            address,
            category,
            seller: sellerId,
            images: imageUrls,
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
            status: 'new',
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
    // const userId = req.user.userId;

    const {
        startTime,
        endTime,
        registrationOpenDate,
        registrationCloseDate,
        registrationFee
    } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy phiên đấu giá"));
    }

    try {
        auction.startTime = startTime;
        auction.endTime = endTime;
        auction.registrationOpenDate = registrationOpenDate;
        auction.registrationCloseDate = registrationCloseDate;
        auction.registrationFee = registrationFee;
        // auction.approvalBy = userId,
        auction.approvalTime = moment();
        auction.status = 'pending';

        await auction.save();

        await Product.findByIdAndUpdate(auction.product, { status: 'pending' });

        res.status(200).json(formatResponse(true, { auctionId: auction._id }, "Phiên đấu giá đã được duyệt và kích hoạt thành công"));
    } catch (error) {
        console.error('Lỗi khi duyệt phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi duyệt phiên đấu giá"));
    }
});

const rejectAuction = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;
    const { reason } = req.body;
    // const userId = req.user.userId;

    if (!reason) {
        return res.status(400).json(formatResponse(false, null, "Vui lòng cung cấp lý do từ chối"));
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy phiên đấu giá"));
    }

    try {
        auction.status = 'cancelled';
        auction.cancellationReason = reason;
        // auction.approvalBy = userId,
        auction.approvalTime = moment();

        await auction.save();

        await Product.findByIdAndUpdate(auction.product, { status: 'cancelled' });

        res.status(200).json(formatResponse(true, { auctionId: auction._id }, "Phiên đấu giá đã bị từ chối"));
    } catch (error) {
        console.error('Lỗi khi từ chối phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi từ chối phiên đấu giá"));
    }
});

const updateAuction = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;
    // const userId = req.user.userId;

    const {
        title,
        description,
        startTime,
        endTime,
        registrationOpenDate,
        registrationCloseDate,
        registrationFee
    } = req.body;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy phiên đấu giá"));
    }
    
    try {
        auction.title = title;
        auction.description = description;
        auction.startTime = startTime;
        auction.endTime = endTime;
        auction.registrationOpenDate = registrationOpenDate;
        auction.registrationCloseDate = registrationCloseDate;
        auction.registrationFee = registrationFee;
        // auction.approvalBy = userId,
        // auction.approvalTime = auction.approvalTime,
        
        await auction.save();

        // await Product.findByIdAndUpdate(auction.product, { status: 'pending' });

        res.status(200).json(formatResponse(true, { auctionId: auction._id }, "Phiên đấu giá đã được điều chỉnh"));
    } catch (error) {
        console.error('Lỗi khi điều chỉnh phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi điều chỉnh phiên đấu giá"));
    }
});

const endAuction = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;
    const { reason } = req.body;
    // const userId = req.user.userId;

    if (!reason) {
        return res.status(400).json(formatResponse(false, null, "Vui lòng cung cấp lý do đóng phiên"));
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy phiên đấu giá"));
    }

    try {
        auction.status = 'ended';
        auction.cancellationReason = reason;
        // auction.approvalBy = userId,
        auction.approvalTime = moment();

        await auction.save();

        // await Product.findByIdAndUpdate(auction.product, { status: 'cancelled' });

        res.status(200).json(formatResponse(true, { auctionId: auction._id }, "Phiên đấu giá đã đóng thành công"));
    } catch (error) {
        console.error('Lỗi khi đóng phiên đấu giá:', error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi đóng phiên đấu giá"));
    }
});

const kickCustomerOutOfAuction = asyncHandler(async (req, res) => {
    const { auctionId, customerId } = req.params;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy phiên đấu giá"));
    }

    const userIndex = auction.registeredUsers.findIndex(
        (user) => user.customer && user.customer.toString() === customerId.toString()
    );
    if (userIndex === -1) {
        return res.status(404).json(formatResponse(false, null, "Không tìm thấy khách hàng trong phòng đấu giá"));
    }

    try {
        auction.registeredUsers.splice(userIndex, 1);
        await auction.save();

        const pipeline = [
            { 
                $match: { _id: new mongoose.Types.ObjectId(auctionId) } 
            },
            {
                $lookup: {
                    from: 'customers', 
                    localField: 'registeredUsers.customer', 
                    foreignField: '_id', 
                    as: 'customerDetails'
                }
            },
            {
                $project: {
                    _id: 1, 
                    customerDetails: 1
                }
            }
        ];

        const [result] = await Auction.aggregate(pipeline);

        if (!result || !result.customerDetails) {
            return res.status(404).json(formatResponse(false, null, "Không tìm thấy thông tin khách hàng"));
        }

        res.status(200).json(formatResponse(true,{ auctionId: auction._id, removedCustomer: customerId, listCustomers: result.customerDetails },"Khách hàng đã được loại khỏi phòng đấu giá"));
    } catch (error) {
        console.error("Lỗi khi loại khách hàng khỏi phòng đấu giá:", error);
        res.status(500).json(formatResponse(false, null, "Đã xảy ra lỗi khi loại khách hàng khỏi phòng đấu giá"));
    }
});



//Get by slug
const getAuctionDetails = asyncHandler(async (req, res) => {
    const { auctionSlug } = req.params;
    const { viewed } = req.query;
    
    try {
        let pipeline = [];
        if (!JSON.parse(viewed || 'false')) {//Check số lượng người xem sản phẩm
            await Auction.updateOne(
                { slug: auctionSlug }, 
                { $inc: { viewCount: 1 } } // Tăng currentViews lên 1
            );
        }
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
                    title: 1,
                    description: 1,
                    contactEmail: 1,
                    
                    currentViews: 1,
                    viewCount: 1,
                    sellerName: 1,
                    startingPrice: 1,
                    currentPrice: 1,
                    startTime: 1,
                    endTime: 1,
                    bidIncrement: 1,
                    registrationOpenDate: 1,
                    registrationCloseDate: 1,
                    deposit: 1,
                    registrationFee: 1,
                    registeredUsers: {
                        $map: {
                            input: "$registeredUsers",
                            as: "registeredUsers",
                            in: "$$registeredUsers.customer"
                        }
                    },
                    winner: 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    approvalTime: 1,
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
        const { limit = 10, page = 1 } = req.query;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10); 
        const skip = (parsedPage - 1) * parsedLimit; 

        let pipeline = [
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
            },
            {
                $sort: { viewCount: -1 } 
            },
            {
                $skip: skip 
            },
            {
                $limit: parsedLimit 
            },
            {
                $project: { 
                    // Product
                    productName: "$product.productName",
                    productImages: "$product.images",
                    productDescription: "$product.description",
                    productAddress: "$product.address",

                    // Auction
                    currentViews: 1,
                    sellerName: 1,
                    startingPrice: 1,
                    startTime: 1,
                    bidIncrement: 1,
                    registrationOpenDate: 1,
                    registrationCloseDate: 1,
                    deposit: 1,
                    registrationFee: 1,
                }
            }
        ];

        const auctions = await Auction.aggregate(pipeline); 
        res.status(200).json(formatResponse(true, auctions, ""));
    } catch (error) {
        console.error('Lỗi khi lấy thông tin phiên đấu giá:', error);
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
            }
        ); 

        pipeline.push(
            {
              $lookup: {
                from: 'customers', 
                localField: 'registeredUsers.customer', 
                foreignField: '_id', 
                as: 'customerDetails',
              },
            },
        );

        pipeline.push(
            {
                $lookup: {
                    from: 'customers',
                    localField: 'winner',
                    foreignField: '_id',
                    as: 'customerwinner'
                }
            },
            {
                $unwind: {
                    path: '$customerwinner',
                    preserveNullAndEmptyArrays: true // Giữ lại tài liệu nếu không có dữ liệu customer
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

        const auction = await Auction.findOne();
        const registeredUsersCount = auction?.registeredUsers?.length || 0;
        const totalAuctions = await Auction.countDocuments(status ? { status } : {});
        pipeline.push({
            $project: {
                productName: "$product.productName",
                productImages: "$product.images",
                productDescription: "$product.description",
                productAddress: "$product.address",
                productCategory: "$product.category",
                productCondition: "$product.condition",
                productStatus: "$product.status",
                productCreate: "$product.createdAt",

                slug: 1,
                title: 1,
                description: 1,
                contactEmail: 1,
                sellerName: 1,   
                startTime: 1,
                endTime: 1,            
                startingPrice: 1,
                currentPrice: 1,
                currentViews: 1,
                viewCount: 1,
                bidIncrement: 1,
                registrationOpenDate: 1,
                registrationCloseDate: 1,
                deposit: 1,
                registrationFee: 1,
                winner: "$customerwinner.fullName",

                createdAt: 1,
                updatedAt: 1,
                approvalTime: 1,
                approvalBy: 1,
                status: status,
                cancellationReason: 1,

                registeredUsers: 1,
                customerDetails: 1,
                username: "$customerwinner.username",
                userCode: "$customerwinner.userCode",
                email: "$customerwinner.email",
                fullName: "$customerwinner.fullName",
                address: "$customerwinner.address",
                phoneNumber: "$customerwinner.phoneNumber",
                avatar: "$customerwinner.avatar",
                IndentifyCode: "$customerwinner.IndentifyCode",
                createdCustomerAt: "$customerwinner.createdAt",
                winningPrice: 1,

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
              $lookup: {
                from: 'customers', 
                localField: 'registeredUsers.customer', 
                foreignField: '_id', 
                as: 'customerDetails', 
              },
            },
            // {
            //   $unwind: {
            //     path: '$customerDetails', // Tách từng phần tử trong mảng `customerDetails`
            //     preserveNullAndEmptyArrays: true, // Đảm bảo giữ tài liệu gốc nếu không tìm thấy match
            //   },
            // },
            
        );
        
        pipeline.push(
            {
                $lookup: {
                    from: 'customers',
                    localField: 'winner',
                    foreignField: '_id',
                    as: 'customerwinner'
                }
            },
            {
                $unwind: {
                    path: '$customerwinner',
                    preserveNullAndEmptyArrays: true // Giữ lại tài liệu nếu không có dữ liệu customer
                }
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

        const auction = await Auction.findOne();
        const registeredUsersCount = auction?.registeredUsers?.length || 0;
        const totalAuctions = await Auction.countDocuments(status ? { status } : {});
        pipeline.push({
            $project: {
                productName: "$product.productName",
                productImages: "$product.images",
                productDescription: "$product.description",
                productAddress: "$product.address",
                productCategory: "$product.category",
                productCondition: "$product.condition",
                productStatus: "$product.status",
                productCreate: "$product.createdAt",

                slug: 1,
                title: 1,
                description: 1,
                contactEmail: 1,
                sellerName: 1,     
                startTime: 1,
                endTime: 1,          
                startingPrice: 1,
                currentPrice: 1,
                currentViews: 1,
                viewCount: 1,
                bidIncrement: 1,
                registrationOpenDate: 1,
                registrationCloseDate: 1,
                deposit: 1,
                registrationFee: 1,
                winner: "$customerwinner.fullName",

                participants: 1,

                createdAt: 1,
                updatedAt: 1,
                approvalTime: 1,
                approvalBy: 1,
                status: status,
                cancellationReason: 1,

                registeredUsers: 1,
                customerDetails: 1,
                username: "$customer.username",
                userCode: "$customer.userCode",
                email: "$customer.email",
                fullName: "$customer.fullName",
                address: "$customer.address",
                phoneNumber: "$customer.phoneNumber",
                avatar: "$customer.avatar",
                IndentifyCode: "$customer.IndentifyCode",
                createdCustomerAt: "$customer.createdAt",

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
    checkValidAccess,
    updateAuction,
    endAuction,
    kickCustomerOutOfAuction,
};