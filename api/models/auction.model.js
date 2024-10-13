const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho đấu giá
const AuctionSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String},
    slug: { type: String, unique: true },
    description: { type: String },
    contactEmail: { type: String, required: true },
    sellerName: { type: String, required: true }, //Tên người bán sản phẩm nếu như không muốn hiển thị tên thật
    startTime: { type: Date, },
    endTime: { type: Date, },
    startingPrice: { type: Number, required: true }, // Giá khởi điểm
    reservePrice: { type: Number }, // Giá tối thiểu
    currentPrice: { type: Number },
    currentViews: { type: Number }, // Số lượng người xem
    bidIncrement: { type: Number, required: true }, // Bước giá tối thiểu
    registrationOpenDate: { type: Date }, // Thời gian bắt đầu đăng ký
    registrationCloseDate: { type: Date }, // Thời gian kết thúc đăng ký
    status: {
        type: String,
        enum: ['pending', 'active', 'ended', 'cancelled'],
        default: 'pending'
    },
    deposit: { type: Number }, // Đặt cọc
    registrationFee: { type: Number }, // Phí đăng ký
    winner: { type: Schema.Types.ObjectId, ref: 'Customer' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bids: [{ type: Schema.Types.ObjectId, ref: 'BidHistory' }],
    outstanding: { type: Boolean, default: false },//Phiên đấu giá được ghim hightlight ở website
    registeredUsers: [
        {
            customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
            registrationTime: { type: Date },
            status: {
                type: String,
                enum: ['pending', 'active'],
                default: 'active'
            },
            // transaction: { type: Schema.Types.ObjectId, ref: 'Transaction' }
        }
    ]
    
}, { timestamps: true });

// Schema cho lịch sử đặt giá
const BidHistorySchema = new Schema({
    auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
    bidder: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    time: { type: Date, default: Date.now }
});

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')      
        .replace(/[^\w\-]+/g, '')    
        .replace(/\-\-+/g, '-')     
        .replace(/^-+/, '')         
        .replace(/-+$/, '');
};

//Tạo slug cho auction
AuctionSchema.pre('save', async function (next) {
    const auction = this;
    const Auction = this.constructor;
    if (!auction.slug && auction.title) {
        let newSlug = slugify(auction.title);

        // check duplicate
        let slugExists = await Auction.findOne({ slug: newSlug });
        let suffix = 1;
        while (slugExists) {
            newSlug = `${slugify(auction.title)}-${suffix}`;
            slugExists = await Auction.findOne({ slug: newSlug });
            suffix++;
        }
        auction.slug = newSlug;
    }
    next();
});

module.exports = {
    Auction: mongoose.model('Auction', AuctionSchema),
    BidHistory: mongoose.model('BidHistory', BidHistorySchema)
};