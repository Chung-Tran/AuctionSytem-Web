const asyncHandle = require("express-async-handler");
const bcrypt = require("bcrypt");

const { formatResponse } = require("../common/MethodsCommon");
const { User } = require("../models/user.model");

const getUsers = asyncHandle(async (req, res) => {
  let { page, limit } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const employees = await User.find()
    .skip(skip)
    .limit(limit)
    .select("-hashedPassword -__v");

  return res.status(200).json(
    formatResponse(
      true,
      {
        list: employees,
        paing: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      ""
    )
  );
});

const createUser = asyncHandle(async (req, res) => {
  const { fullName, username, email, phoneNumber, password, rolePermission } = req.body;
  // const rolePermission = req.body.rolePermission;

  // check is duplicate info of employee in db
  const existingEmployee = await User.findOne({
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
  const employee = await User.create({ fullName, username, email, phoneNumber, hashedPassword, rolePermission });
  const employeeResponse = employee.toObject();
  delete employeeResponse.hashedPassword;


  res.status(200).json(formatResponse(true, employeeResponse, "Create Employee Successed!"));
});

const getUserById = asyncHandle(async (req, res) => {
  const { id } = req.params;

  const employee = await User.findById(id);
  if (!employee) {
    return res
      .status(404)
      .json(formatResponse(false, null, "Employee not found"));
  }

  const employeeResponse = employee.toObject();
  delete employeeResponse.hashedPassword;

  res
    .status(200)
    .json(
      formatResponse(true, employeeResponse, "Employee retrieved successfully!")
    );
});

const updateUser = asyncHandle(async (req, res) => {
  const { id } = req.params;
  const { fullName, username, email, phoneNumber, password, status } = req.body;

  const updates = { fullName, username, email, phoneNumber, status };
  if (password) {
    updates.hashedPassword = await bcrypt.hash(password, 10);
  }

  const employee = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!employee) {
    return res
      .status(404)
      .json(formatResponse(false, null, "Employee not found"));
  }

  const employeeResponse = employee.toObject();
  delete employeeResponse.hashedPassword;

  res
    .status(200)
    .json(
      formatResponse(true, employeeResponse, "Employee updated successfully!")
    );
});

const deleteUser = asyncHandle(async (req, res) => {
  const { id } = req.params;
  const employee = await User.findByIdAndDelete(id);
  if (!employee) {
    return res
      .status(404)
      .json(formatResponse(false, null, "Employee not found"));
  }

  res
    .status(200)
    .json(formatResponse(true, null, "Employee deleted successfully!"));
});

const getAllUsers = asyncHandle(async (req, res) => {
  const users = await User.find()
    .populate({
      path: 'rolePermission', 
      populate: {
        path: 'role',        
        select: 'name'        
      }
    })
    .populate({
      path: 'rolePermission',
      populate: {
        path: 'permissions',   
        select: 'name'         
      }
  });
  const employeesResponse = users.map(employee => {
      const employeeObj = employee.toObject();
      delete employeeObj.hashedPassword;
      return employeeObj;
  });
  

  res.status(200).json(formatResponse(true, employeesResponse, "All employees retrieved successfully!"));
});


module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser ,getAllUsers};
