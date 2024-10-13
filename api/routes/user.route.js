const express = require('express');
const router = express.Router();

const { validateBodyRequest, validateParamsRequest,validateQueryRequest } = require("../middlewares/validation.middleware")
const { idSchema, createUserSchema, updateUserSchema, pagingSchema } = require("../validations")
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/user.controller');

router.get('/', validateQueryRequest(pagingSchema), getUsers);
router.get('/:id', validateParamsRequest(idSchema), getUserById);
router.post('/', validateBodyRequest(createUserSchema), createUser);
router.patch('/:id', validateParamsRequest(idSchema), validateBodyRequest(updateUserSchema), updateUser);
router.delete('/:id', validateParamsRequest(idSchema), deleteUser);

module.exports = router;