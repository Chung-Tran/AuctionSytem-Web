const { model } = require("mongoose");

const EmployeeStatus = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
});

module.exports = { EmployeeStatus };