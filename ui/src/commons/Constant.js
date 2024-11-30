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
    NOT_REGISTERED: 1,//User chưa đăng ký
    REGISTERED: 2, //Đã nằm trong list đăng ký
    EXPIRED: 3, //Quá hạn cho phép đăng ký
}
export {
    PAYMENT_STATUS,
    POLLING_CONFIG,
    REGISTER_STATUS
}