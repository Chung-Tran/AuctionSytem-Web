const { formatResponse } = require('../common/MethodsCommon');
const Role_Permission = require('../models/Role&Permission');
const asyncHandle = require('express-async-handler');
const { User } = require('../models/user.model');

const createRole = asyncHandle(async (req, res) => {
    const { name, description, permissions, createdBy } = req.body;

    try {
        const validPermissions = await Role_Permission.Permission.find({ 
            '_id': { $in: permissions } 
        });

        if (validPermissions.length !== permissions.length) {
            return res.status(400).json(formatResponse(false, null, "One or more permissions are invalid"));
        }
        
        const role = await Role_Permission.Role.create({
            name: name,
            description: description,
            permissions: permissions, 
            createdBy: createdBy,
        });

        const data = {
            _id: role._id,
            name: role.name,
            description: role.description,
            permissions: role.permissions, 
            createdBy: role.createdBy,
        };

       
        return res.status(200).json(formatResponse(true, data, "Create Role Successfully"));

    } catch (error) {
        return res.status(500).json(formatResponse(false, null, error.message));
    }
});


const createPermission = asyncHandle( async (req, res)=> {
    const name = req.body.name;
    const description = req.body.description;

    const permission = await Role_Permission.Permission.create({
        name: name,
        description: description,
    })
    const data = {
        _id: permission._id,
        name: permission.name,
        description: permission.description,
    }
    return res.status(200).json(formatResponse(true, data, "Create Permission Successfully"));
    // return res.status(200).json(formatResponse());


});

const createRolePermission = asyncHandle( async (req, res)=> {
    const id_Role = req.body.id_Role;
    const id_Permission = req.body.id_Permission;
    const createdBy = req.body.createdBy;

    const existingRolePermission = await Role_Permission.RolePermission.findOne({
        role: id_Role,
        permissions: id_Permission,
    });

    if (existingRolePermission) {
        return res.status(400).json(formatResponse(false, null, "Role and Permission combination already exists"));
    }

    const RolePermission = await Role_Permission.RolePermission.create({
        role: id_Role,
        permissions: id_Permission,
        createdBy: createdBy,
    })

    const data = {
        _id: RolePermission._id,
        _id_Role: RolePermission.role,
        _id_Permission: RolePermission.permissions,
        createdBy: RolePermission.createdBy,
    }
    return res.status(200).json(formatResponse(true, data, "Create RolePermission Successfully"));

});

const getAllRolePermissions = asyncHandle(async (req, res) => {
    try {
        const allRolePermissions = await Role_Permission.RolePermission.find().populate('role permissions');
        
        const data = allRolePermissions.map(rolePermission => ({
            _id: rolePermission._id,
            role: rolePermission.role,
            permissions: rolePermission.permissions,
            createdBy: rolePermission.createdBy,
        }));

        return res.status(200).json(formatResponse(true, data, "Retrieve all RolePermissions successfully"));
    } catch (error) {
        return res.status(500).json(formatResponse(false, null, error.message));
    }
});

const get_Rolename_By_Id_RolePermissions = asyncHandle(async (req, res) => {
    const { id_User } = req.params;
    try {
        const user = await User.findById(id_User);
        const id_RolePermission = user.rolePermission;
        const rolePermission = await Role_Permission.RolePermission.findById(id_RolePermission).populate('role', 'name');

        if (!rolePermission || !rolePermission.role) {
            return res.status(404).json(formatResponse(false, null, 'Không tìm thấy RolePermission'))
        }

        const id_Role = rolePermission.role;

        const role = await Role_Permission.Role.findById(id_Role)

        const roleName = role.name;

        return res.status(200).json(formatResponse(true, roleName, 'Lấy tên chức vụ thành công'))

    } catch (error) {
        return res.status(500).json(formatResponse(false, null, error.message));
    }
});

module.exports = {
    createRole,
    createPermission,
    createRolePermission,
    getAllRolePermissions,
    get_Rolename_By_Id_RolePermissions,
}