const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define các quyền hạn trong system
const PermissionSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' }
});

// Role Schema
const RoleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }], //List permission
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User'},
    updatedAt: { type: Date}
});


module.exports = {
    Role: mongoose.model('Role', RoleSchema),
    Permission: mongoose.model('Permission', PermissionSchema),
};