const express = require('express');
const router = express.Router();

const { createRole,
        createPermission,
        createRolePermission,
        getAllRolePermissions,
    } = require('../controllers/RoleController');

router.post('/createRole', createRole);
router.post('/createPermission', createPermission);
router.post('/createRolePermission', createRolePermission);
router.get('/getAllRolePermission', getAllRolePermissions);


module.exports = router;