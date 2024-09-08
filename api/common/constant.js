const EmployeeStatus = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
});

const EmailType = Object.freeze({
    RESET_PASSWORD_OTP: "reset-password-otp"
});


module.exports = { EmployeeStatus, EmailType };