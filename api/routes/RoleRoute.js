const express = require('express');
const router = express.Router();

const { createRole,
        createPermission,
        createRolePermission,
        getAllRolePermissions,
        get_Rolename_By_Id_RolePermissions,
    } = require('../controllers/RoleController');

router.post('/createRole', createRole);
router.post('/createPermission', createPermission);
router.post('/createRolePermission', createRolePermission);
router.get('/getAllRolePermission', getAllRolePermissions);
router.get('/getRoleName/:id_User', get_Rolename_By_Id_RolePermissions);


module.exports = router;