const common = require("./common.validation")
const auth = require("./auth.validation")
const employee = require("./employee.validation")

module.exports = {
    ...common,
    ...auth,
    ...employee,
};