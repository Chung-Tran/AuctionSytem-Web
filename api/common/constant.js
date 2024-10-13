const EmployeeStatus = Object.freeze({
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động',
    SUSPENDED: 'Cấm'
});

const EmailType = Object.freeze({
    RESET_PASSWORD_OTP: "reset-password-otp"
});


module.exports = { EmployeeStatus, EmailType };