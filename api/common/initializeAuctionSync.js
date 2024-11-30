const cron = require('node-cron');
const Bull = require('bull');
const { Auction, BidHistory } = require('../models/auction.model');
const redisClient = require('../config/redis');
const { REDIS_KEYS } = require('./constant');
const { endAuction } = require('../controllers/socket.controller');

const auctionQueue = new Bull('auction-management', {
  redis: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  }
});

const initializeAuctionSystem = async () => {
  try {
    const pendingAuctions = await Auction.find({
      status: 'pending',
      startTime: { $gt: new Date() }
    }).populate('product');

    const activeAuctions = await Auction.find({
      status: 'active',
      endTime: { $gt: new Date() }
    }).populate('product');

    for (const auction of pendingAuctions) {
      const alreadyScheduled = await redisClient.sIsMember(REDIS_KEYS.SCHEDULED_AUCTIONS(auction._id), auction._id.toString());
      if (!alreadyScheduled) {
        console.log("Add auction to start queue, room:", auction._id)
        scheduleAuctionStart(auction);
        await redisClient.sAdd(REDIS_KEYS.SCHEDULED_AUCTIONS(auction._id), auction._id.toString());
      }
    }

    for (const auction of activeAuctions) {
      const alreadyScheduled = await redisClient.sIsMember(REDIS_KEYS.SCHEDULED_AUCTIONS(auction._id), auction._id.toString());
      if (!alreadyScheduled) {
        console.log("Add auction to cancel queue, room:", auction._id)
        scheduleAuctionEnd(auction);
        await redisClient.sAdd(REDIS_KEYS.SCHEDULED_AUCTIONS(auction._id), auction._id.toString());
      }
    }

    // Sync job mỗi ngày
    cron.schedule('0 0 * * *', async () => {
      await checkNewAuctions();
    });

  } catch (error) {
    console.error('Error:', error);
  }
};


const scheduleAuctionStart = async (auction) => {
  const timeUntilStart = auction.startTime - new Date();
  if (timeUntilStart > 0) {
    auctionQueue.add(
      'start-auction',
      { auctionId: auction._id },
      { delay: timeUntilStart }
    );
    await redisClient.sAdd(REDIS_KEYS.SCHEDULED_AUCTIONS(auction._id), auction._id.toString());
  }
};

const scheduleAuctionEnd = async (auction) => {
  const timeUntilEnd = auction.endTime - new Date();
  console.log('time end auction: ', auction._id, 'time remain', timeUntilEnd)
  if (timeUntilEnd > 0) {
    auctionQueue.add(
      'end-auction',
      { auctionId: auction._id },
      { delay: timeUntilEnd }
    );
    await redisClient.sAdd(REDIS_KEYS.SCHEDULED_AUCTIONS(auction._id), auction._id.toString());
  }
};

// check các phiên đấu giá mới
const checkNewAuctions = async () => {
  const newAuctions = await Auction.find({
    status: 'pending',
    startTime: {
      $gt: new Date(),
      $lt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });

  for (const auction of newAuctions) {
    scheduleAuctionStart(auction);
  }
};

//Task implement
auctionQueue.process('start-auction', async (job) => {
  const { auctionId } = job.data;
  await activateAuction(auctionId);
});

auctionQueue.process('end-auction', async (job) => {
  const { auctionId } = job.data;
  await handleEndAuction(auctionId);
});

const activateAuction = async (auctionId) => {
  try {
    const auction = await Auction.findById(auctionId).populate('product');
    if (auction && auction.status === 'pending') {
      console.log("start auction ", auctionId);
      auction.status = 'active';
      await auction.save();
      await redisClient.hSet(REDIS_KEYS.AUCTION_ROOM(auctionId), 'status', 'active');
      await redisClient.hSet(REDIS_KEYS.AUCTION_ROOM(auctionId), 'auction', JSON.stringify(auction));

      // Lập lịch kết thúc
      scheduleAuctionEnd(auction);
    }
  } catch (error) {
    console.error('Error activating auction:', error);
  }
};

// Kết thúc phiên đấu giá
const handleEndAuction = async (auctionId) => {
  try {

    // Sync data bidHistory
    const { highestBidder, auctionData } = await syncFinalAuctionData(auctionId);

    //Emit auction end
    endAuction(auctionId, highestBidder);
    const auction = await Auction.findById(auctionId);
    if (auction && auction.status === 'active') {
      auction.status = 'ended';
      await auction.save();

      //Delete cache
      await redisClient.del(REDIS_KEYS.AUCTION_ROOM(auctionId));
      await redisClient.del(REDIS_KEYS.BID_HISTORY(auctionId));
      await redisClient.del(REDIS_KEYS.AUCTION_CHAT(auctionId));
      await redisClient.sRem(REDIS_KEYS.SCHEDULED_AUCTIONS(auctionId), auctionId.toString());
    }
  } catch (error) {
    console.error('Error ending auction:', error);
  }
};

const syncFinalAuctionData = async (auctionId) => {
  try {
    let auction = await redisClient.hGetAll(REDIS_KEYS.AUCTION_ROOM(auctionId));
    let auctionData = JSON.parse(auction.auction);
    const bidList = await redisClient.lRange(REDIS_KEYS.BID_HISTORY(auctionId), 0, -1);
    let highestBidder = null;
    const bidHistoryIds = [];

    // SYNC lịch sử đấu giá
    for (const bidJson of bidList) {
      const bid = JSON.parse(bidJson);
      const bidHistory = await BidHistory.create({
        auction: auctionId,
        bidder: bid.userId,
        amount: bid.bidAmount,
        time: new Date(bid.timestamp)
      });

      bidHistoryIds.push(bidHistory._id);

      if (
        !highestBidder ||
        bid.bidAmount > highestBidder.amount ||
        (bid.bidAmount === highestBidder.amount && new Date(bid.timestamp) > new Date(highestBidder.time))
      ) {
        highestBidder = {
          userCode: bid.userCode,
          userId: bid.userId,
          amount: bid.bidAmount,
          time: new Date(bid.timestamp)
        };
      }
    }

    if (auctionData) {
      await Auction.findByIdAndUpdate(auctionId, {
        winner: highestBidder?.userId || null,
        winningPrice: highestBidder?.amount || null,
        bids: bidHistoryIds 
      });
    }

    return { highestBidder, auctionData }
  } catch (error) {
    console.error('Error syncing final auction data:', error);
  }
};


module.exports = {
  initializeAuctionSystem
};