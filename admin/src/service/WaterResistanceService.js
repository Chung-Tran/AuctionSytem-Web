import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const waterResistanceApi={
    getAll : async ()=> {
        const waterresistance =await axiosClient.get('/waterresistance');
        if (!waterresistance)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return waterresistance;
    },
    getByID: async (id) => {
        const waterresistance = await axiosClient.get(`/waterresistance/${id}`);
        if (!waterresistance)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return waterresistance;
    },
    create: async (values) => {
        const model = {
            WaterresistanceName: values.WaterResistanceName,
            Description:values.Description
        }
        
        return await axiosClient.post('/waterresistance/create', model).then(result => {
            if (!result.success) {
                toast.error(result.message || "Tạo thông số thất bại");
                return false;
            }
            toast.success(result.message || "Tạo thông số thành công");
            return result;
        })
    },
    update: async (values) => {
        return await axiosClient.put(`/waterresistance/update`, values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Cập nhật thông số thất bại");
                return false;
            }
            toast.success(result.message || "Cật nhật thông số thành công");
        return result;
        });
        
        
    },
    delete: async (id) => {
        return await axiosClient.delete(`/waterresistance/delete/${id}`).then(result => {
            if (!result.success)
            {
               return toast.error(result.message || "Xóa thông số thất bại")
            }
            toast.success("Xóa thông số thành công");
            return result;
        })
    }
}

export default waterResistanceApi