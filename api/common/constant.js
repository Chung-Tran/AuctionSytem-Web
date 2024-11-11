const UserStatus = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
});

const EmailType = Object.freeze({
    RESET_PASSWORD_OTP: "reset-password-otp"
});

const REDIS_KEYS = {
    AUCTION_ROOM: (roomId) => `auction:${roomId}`,
    BID_HISTORY: (roomId) => `auction:${roomId}:bids`,
    AUCTION_CHAT: (roomId) => `auction:${roomId}:chat`,
    SCHEDULED_AUCTIONS: (roomId) => `auction_schedule:${roomId}`,
  };


module.exports = {
    UserStatus,
    EmailType,
    REDIS_KEYS
};