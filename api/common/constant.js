const EmployeeStatus = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
});

const TransactionStatus = Object.freeze({
    DRAFT: 'draft',
    SUCCESSED: 'successed',
    FAILURE: 'failure'
});

const PaymentGateways = Object.freeze({
    VNPAY: 'vnpay',
    MOMO: 'momo',
    PAYPAL: 'paypal'
});

const EmailType = Object.freeze({
    RESET_PASSWORD_OTP: "reset-password-otp"
});

const VNPayResponse = Object.freeze({
    SUCCESS: { RspCode: "00", Message: "Giao dịch thành công" },
    SUSPECTED_FRAUD: { RspCode: "07", Message: "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)." },
    NOT_REGISTERED: { RspCode: "09", Message: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng." },
    AUTHENTICATION_FAILED: { RspCode: "10", Message: "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần." },
    PAYMENT_TIMEOUT: { RspCode: "11", Message: "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch." },
    ACCOUNT_LOCKED: { RspCode: "12", Message: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa." },
    OTP_INCORRECT: { RspCode: "13", Message: "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch." },
    CUSTOMER_CANCELED: { RspCode: "24", Message: "Giao dịch không thành công do: Khách hàng hủy giao dịch." },
    INSUFFICIENT_FUNDS: { RspCode: "51", Message: "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch." },
    DAILY_LIMIT_EXCEEDED: { RspCode: "65", Message: "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày." },
    BANK_MAINTENANCE: { RspCode: "75", Message: "Ngân hàng thanh toán đang bảo trì." },
    MAX_RETRY_EXCEEDED: { RspCode: "79", Message: "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch." },
    OTHER_ERROR: { RspCode: "99", Message: "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)." }
});

const  IpnResponse = Object.freeze({
    IpnSuccess : { RspCode: '00', Message: 'Confirm Success' },
    IpnOrderNotFound : { RspCode: '01', Message: 'Order not found' },
    IpnInvalidAmount : { RspCode: '04', Message: 'Invalid amount' },
    IpnFailChecksum : { RspCode: '97', Message: 'Fail checksum' },
    IpnUnknownError : { RspCode: '99', Message: 'Unknown error' },
})


module.exports = { EmployeeStatus, EmailType, TransactionStatus, PaymentGateways, VNPayResponse, IpnResponse };