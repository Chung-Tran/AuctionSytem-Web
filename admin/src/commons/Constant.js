export const AUCTION_STATUS = {
    NEW: 'new',
    PENDING: 'pending',
    ACTIVE: 'active',
    ENDED: 'ended',
    CANCELLED: 'cancelled',
}
export const MODAL_TYPES = {
    VIEW: 'VIEW',
    UPDATE: 'UPDATE',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    CANCEL: 'CANCEL',
    RECOVER: 'RECOVER',
    END: 'END'
};

export const AuctionStatus = Object.freeze({
    new: 'Chờ duyệt',
    pending: 'Sắp đấu giá',
    active: 'Đang đấu giá',
    ended: 'Kết thúc',
    cancelled: 'Phiên đấu giá bị từ chối',
})

export const ProductCategory = Object.freeze({
    Art_Collectibles: 'Nghệ thuật và Sưu tập',
    Jewelry_Watches: 'Trang sức và Đồng hồ',
    Furniture_HomeDecor: 'Đồ nội thất và Trang trí',    
    Vehicles: 'Xe cộ',
    Real_Estate: 'Bất động sản',
    Electronics_Technology: 'Đồ điện tử và Công nghệ',
    Fashion_Accessories: 'Thời trang và Phụ kiện',
    Wine_Beverages: 'Rượu và Đồ uống',
    Books_RareDocuments: 'Sách và Tài liệu quý',
    EventTickets_Experiences: 'Vé sự kiện và Trải nghiệm',
});

export const ProductCondition = Object.freeze({
    new: 'Mới',
    used: 'Đã sử dụng',
    refurbished: 'Tân trang',    
});

export const ProductStatus = Object.freeze({
    pending: 'Đang chờ đấu giá',
    active: 'Đang đấu giá',
    sold: 'Đã bán', 
    cancelled: 'Đã hủy',
});