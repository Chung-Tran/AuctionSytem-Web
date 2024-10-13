const asyncHandler = require('express-async-handler');
const redisClient = require('../config/redis');

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected. ID  :', socket.id);

        socket.on('createAuctionRoom', (data) => createAuctionRoom(io, socket, data));
        socket.on('joinAuctionRoom', (roomId) => joinAuctionRoom(io, socket, roomId));
        socket.on('placeBid', (data) => placeBid(io, socket, data));
        socket.on('endAuction', (roomId) => endAuction(io, socket, roomId));
        socket.on('disconnect', () => handleDisconnect(socket));
    });
};

const createAuctionRoom = asyncHandler(async (io, socket, data) => {
    const { roomId, productInfo, startTime, endTime } = data;
    
    try {
        await redisClient.hmset(`auction:${roomId}`, {
            productInfo: JSON.stringify(productInfo),
            startTime,
            endTime,
            currentBid: 0,
            highestBidder: ''
        });

        socket.join(roomId);
        io.to(roomId).emit('roomCreated', { roomId, productInfo });
    } catch (error) {
        console.error('Lỗi khi tạo phòng đấu giá:', error);
        socket.emit('error', { message: 'Không thể tạo phòng đấu giá' });
    }
});

const joinAuctionRoom = asyncHandler(async (io, socket, roomId) => {
    try {
        socket.join(roomId);
        const roomInfo = await redisClient.hGetAll(`auction:${roomId}`);
        if (roomInfo) {
            socket.emit('roomInfo', roomInfo);
        } else {
            socket.emit('error', { message: 'Không tìm thấy phòng đấu giá' });
        }
    } catch (error) {
        console.error('Lỗi khi tham gia phòng đấu giá:', error);
        socket.emit('error', { message: 'Không thể tham gia phòng đấu giá' });
    }
});

const placeBid = asyncHandler(async (io, socket, data) => {
    const { roomId, userId, bidAmount } = data;
    
    try {
        const roomInfo = await redisClient.hgetall(`auction:${roomId}`);
        if (bidAmount > parseFloat(roomInfo.currentBid)) {
            await redisClient.hmset(`auction:${roomId}`, {
                currentBid: bidAmount,
                highestBidder: userId
            });
            
            io.to(roomId).emit('bidUpdated', { roomId, currentBid: bidAmount, highestBidder: userId });
        } else {
            socket.emit('error', { message: 'Giá đặt phải cao hơn giá hiện tại' });
        }
    } catch (error) {
        console.error('Lỗi khi đặt giá:', error);
        socket.emit('error', { message: 'Không thể đặt giá' });
    }
});

const endAuction = asyncHandler(async (io, socket, roomId) => {
    try {
        const roomInfo = await redisClient.hgetall(`auction:${roomId}`);
        io.to(roomId).emit('auctionEnded', {
            roomId,
            winner: roomInfo.highestBidder,
            winningBid: roomInfo.currentBid
        });
        
        await redisClient.del(`auction:${roomId}`);
    } catch (error) {
        console.error('Lỗi khi kết thúc đấu giá:', error);
        socket.emit('error', { message: 'Không thể kết thúc đấu giá' });
    }
});

const handleDisconnect = (socket) => {
    console.log('Người dùng đã ngắt kết nối:', socket.id);
    // Thêm logic xử lý ngắt kết nối nếu cần
};

module.exports = {
    initializeSocket,
    createAuctionRoom,
    joinAuctionRoom,
    placeBid,
    endAuction,
    handleDisconnect
};