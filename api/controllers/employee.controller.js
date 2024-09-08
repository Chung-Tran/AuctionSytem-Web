const asyncHandle = require('express-async-handler');
const bcrypt = require('bcrypt');

const { formatResponse } = require('../common/MethodsCommon');
const { Employee } = require('../models/employee.model');

const createEmployee = asyncHandle(async (req, res) => {
    const { fullName, username, email, phoneNumber, password, status } = req.body;

    // check is duplicate info of employee in db
    const existingEmployee = await Employee.findOne({
        $or: [
            { username: username },
            { email: email.toLowerCase() }
        ]
    });

    if (existingEmployee) {
        const validationError = new Error();
        validationError.name = 'ValidationError';
        validationError.errors = "";

        if (existingEmployee.username === username) {
            validationError.errors += 'Username already exists. ';
        }
        if (existingEmployee.email === email.toLowerCase()) {
            validationError.errors += 'Email already exists.';
        }

        throw validationError;
    }

    // save new employee into db
    const hashedPassword = await bcrypt.hash(password, 10)
    const employee = await Employee.create({ fullName, username, email, phoneNumber, hashedPassword, status });
    const employeeResponse = employee.toObject();
    delete employeeResponse.hashedPassword;


    res.status(200).json(formatResponse(true, employeeResponse, "Create Employee Successed!"));
});

const getEmployeeById = asyncHandle(async (req, res) => {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
        return res.status(404).json(formatResponse(false, null, "Employee not found"));
    }

    const employeeResponse = employee.toObject();
    delete employeeResponse.hashedPassword;

    res.status(200).json(formatResponse(true, employeeResponse, "Employee retrieved successfully!"));
});

const updateEmployee = asyncHandle(async (req, res) => {
    const { id } = req.params;
    const { fullName, username, email, phoneNumber, password, status } = req.body;

    const updates = { fullName, username, email, phoneNumber, status };
    if (password) {
        updates.hashedPassword = await bcrypt.hash(password, 10);
    }

    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!employee) {
        return res.status(404).json(formatResponse(false, null, "Employee not found"));
    }

    const employeeResponse = employee.toObject();
    delete employeeResponse.hashedPassword;

    res.status(200).json(formatResponse(true, employeeResponse, "Employee updated successfully!"));
});


const deleteEmployee = asyncHandle(async (req, res) => {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
        return res.status(404).json(formatResponse(false, null, "Employee not found"));
    }

    res.status(200).json(formatResponse(true, null, "Employee deleted successfully!"));
});


module.exports = { getEmployeeById, createEmployee, updateEmployee, deleteEmployee };