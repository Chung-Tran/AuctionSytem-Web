import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const roleApi={
    getAllrole : async ()=> {
        const roleList =await axiosClient.get('/role');
        if (!roleList)
        {
            toast.error("Không tìm thấy vai trò nào");
            return;
        }
        return roleList;
    },
    getByID: async (id) => {
        const roleInfo = await axiosClient.get(`/role/${id}`);
        if (!roleInfo)
        {
            toast.error("Không tìm thấy người dùng");
            return;
        }
        return roleInfo;
    },
    create: async (values) => {
        values.RoleID = Number(values.RoleID);
        const newRole = await axiosClient.post('/role/createnew', values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Tạo vai trò thất bại");
                return false;
            }
            toast.success(result.message || "Tạo vai trò thành công");
            return true;
        })
    },
    update: async (values) => {
        const updateRole = await axiosClient.put(`/role/update/${values.RoleID}`, values).then(result => {
            if (!result.success) {
                
                toast.error(result.message || "Cập nhật vai trò thất bại");
                return false;
            }
            toast.success(result.message || "Cật nhật vai trò thành công");
            return true;
        })
    },
    getPermissionByRole: async (id) => {
        return await axiosClient.get(`/roletopermission/${id}`).then(result => {
            console.log('fetch',result)
            if (!result.success) {
                toast.error( "Lấy danh sách quyền hạn thất bại");
                return false;
            }
            return result.data.permissionID
            // toast.success(result.message || "Cật nhật vai trò thành công");
           
        })
    },
    createRoleToPermission: async (values) => {
        const updateRole = await axiosClient.post(`roletopermission/createnew`, values);
        if (!updateRole.success) {
            toast.error(result.message || "Cập nhật vai trò thất bại");
            return false;
        }
        toast.success(updateRole.message || "Cật nhật vai trò thành công");
        return true;
    }

}

export default roleApi