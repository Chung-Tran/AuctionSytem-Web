import dayjs from "dayjs";
import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const voucherApi={
    getAll : async ()=> {
        const data =await axiosClient.get('/voucher');
        if (!data)
        {
            toast.error("Không tìm thấy khuyến mãi nào");
            return;
        }
        return data;
    },
    getByID: async (id) => {
        const data = await axiosClient.get(`/voucher/${id}`);
        if (!data)
        {
            toast.error("Không tìm thấy người dùng");
            return;
        }
        return data;
    },
    create: async (values) => {
        const newVoucher = await axiosClient.post('/voucher/create', values);
        return newVoucher
        
    },
    // update: async (values) => {
    //     const updateRole = await axiosClient.put(`/role/update/${values.RoleID}`, values).then(result => {
    //         if (!result.success) {
                
    //             toast.error(result.message || "Cập nhật vai trò thất bại");
    //             return false;
    //         }
    //         toast.success(result.message || "Cật nhật vai trò thành công");
    //         return true;
    //     })
    // },
    // getPermissionByRole: async (id) => {
    //     return await axiosClient.get(`/roletopermission/${id}`).then(result => {
    //         console.log('fetch',result)
    //         if (!result.success) {
    //             toast.error( "Lấy danh sách quyền hạn thất bại");
    //             return false;
    //         }
    //         return result.data.permissionID
    //         // toast.success(result.message || "Cật nhật vai trò thành công");
           
    //     })
    // },
    // createRoleToPermission: async (values) => {
    //     const updateRole = await axiosClient.post(`roletopermission/createnew`, values);
    //     if (!updateRole.success) {
    //         toast.error(result.message || "Cập nhật vai trò thất bại");
    //         return false;
    //     }
    //     toast.success(updateRole.message || "Cật nhật vai trò thành công");
    //     return true;
    // }

}

export default voucherApi