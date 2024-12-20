const PAYMENT_STATUS  = {
    DRAFT: 'draft',
    SUCCESSED: 'successed',
    FAILURE: 'failure'
};
const POLLING_CONFIG = {
    INTERVAL: 2000, // 2 seconds
    TIMEOUT: 300000, // 5 minutes
  };
const REGISTER_STATUS = {
    NOT_ALLOW: -1,//Cho phep dki
    ALLOW: 0,//Cho phep dki
    NOT_REGISTERED: 1,//User chưa đăng ký
    REGISTERED: 2, //Đã nằm trong list đăng ký
    EXPIRED: 3, //Quá hạn cho phép đăng ký
}
const AUCTION_STATUS = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    WINNER_PAYMENTED: 'Winner_Paymented',
    DONE: 'Done',
    CANCELED: 'Canceled',
    REJECTED: 'Rejected',
};
const PRODUCT_CATEGORY_DATASOURCE = [
    { value: 'Electronics', label: 'Các sản phẩm điện tử' },
    { value: 'Fashion', label: 'Quần áo, phụ kiện' },
    { value: 'Jewelry', label: 'Đồ trang sức, kim hoàn' },
    { value: 'Art', label: 'Tranh ảnh, điêu khắc' },
    { value: 'Real Estate', label: 'Đất đai, nhà cửa' },
    { value: 'Vehicle', label: 'Xe cộ, phương tiện' },
    { value: 'Collector Items', label: 'Đồ sưu tầm' },
    { value: 'Furniture', label: 'Đồ đạc, nội thất' },
    { value: 'Antiques', label: 'Các vật phẩm cổ' },
    { value: 'Sports Equipment', label: 'Dụng cụ thể thao' },
    { value: 'Books', label: 'Sách, tài liệu' },
    { value: 'Other', label: 'Các loại khác' }
];

const PRODUCT_CONDITION_DATASOURCE = [
    { value: 'New', label: 'Mới' },
    { value: 'Used', label: 'Đã qua sử dụng' },
    { value: 'Refurbished', label: 'Tân trang' }
];

const PRODUCT_TYPE_DATASOURCE = [
    { value: 'Personal Item', label: 'Vật dụng cá nhân' },
    { value: 'Collectible', label: 'Đồ sưu tầm' },
    { value: 'Rare', label: 'Vật phẩm hiếm' },
    { value: 'Limited', label: 'Sản phẩm phát hành giới hạn' },
    { value: 'Vintage', label: 'Đồ cổ, thuộc thế hệ cũ' },
    { value: 'Standard', label: 'Sản phẩm tiêu chuẩn' },
    { value: 'Premium', label: 'Sản phẩm cao cấp' }
];
export {
    PAYMENT_STATUS,
    POLLING_CONFIG,
    REGISTER_STATUS,
    AUCTION_STATUS,
    PRODUCT_CATEGORY_DATASOURCE,
    PRODUCT_CONDITION_DATASOURCE,
    PRODUCT_TYPE_DATASOURCE
}