const common = require("./common.validation")
const employee = require("./employee.validation")

module.exports = {
    ...common,
    ...employee,
};