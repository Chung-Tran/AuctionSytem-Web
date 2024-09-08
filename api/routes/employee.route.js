const express = require('express');
const router = express.Router();

const { validateBodyRequest, validateParamsRequest } = require("../middlewares/validation.middleware")
const { idSchema, createEmployeeSchema, updateEmployeeSchema } = require("../validations")
const { getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employee.controller');

router.get('/:id', validateParamsRequest(idSchema), getEmployeeById);
router.post('/', validateBodyRequest(createEmployeeSchema), createEmployee);
router.patch('/:id', validateParamsRequest(idSchema), validateBodyRequest(updateEmployeeSchema), updateEmployee);
router.delete('/:id', validateParamsRequest(idSchema), deleteEmployee);

module.exports = router;