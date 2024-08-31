import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const strapMaterialApi={
    getAll : async ()=> {
        const strapmaterial =await axiosClient.get('/strapmaterial');
        if (!strapmaterial)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return strapmaterial;
    },
    getByID: async (id) => {
        const strapmaterial = await axiosClient.get(`/strapmaterial/${id}`);
        if (!strapmaterial)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return strapmaterial;
    },
    create: async (values) => {
        const model = {
            StrapMaterialName: values.StrapMaterialName,
            Description:values.Description
        }
        
        return await axiosClient.post('/strapmaterial/create', model).then(result => {
            if (!result.success) {
                toast.error(result.message || "Tạo thông số thất bại");
                return false;
            }
            toast.success(result.message || "Tạo thông số thành công");
            return result;
        })
    },
    update: async (values) => {
        return await axiosClient.put(`/strapmaterial/update`, values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Cập nhật thông số thất bại");
                return false;
            }
            toast.success(result.message || "Cật nhật thông số thành công");
        return result;
        });
        
        
    },
    delete: async (id) => {
        return await axiosClient.delete(`/strapmaterial/delete/${id}`).then(result => {
            if (!result.success)
            {
               return toast.error(result.message || "Xóa thông số thất bại")
            }
            toast.success("Xóa thông số thành công");
            return result;
        })
    }

}

export default strapMaterialApi