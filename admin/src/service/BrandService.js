import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const brandApi={
    getAll : async ()=> {
        const brand =await axiosClient.get('/brand');
        if (!brand)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return brand;
    },
    getByID: async (id) => {
        const brand = await axiosClient.get(`/brand/${id}`);
        if (!brand)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return brand;
    },
    create: async (values) => {
        const model = {
            BrandName: values.BrandName,
            Description: values.Description,
            Origin: values.Origin
        }
        
        return await axiosClient.post('/brand/create', model).then(result => {
            if (!result.success) {
                toast.error(result.message || "Tạo thông số thất bại");
                return false;
            }
            toast.success(result.message || "Tạo thông số thành công");
            return result;
        })
    },
    update: async (values) => {
        return await axiosClient.put(`/brand/update`, values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Cập nhật thông số thất bại");
                return false;
            }
            toast.success(result.message || "Cật nhật thông số thành công");
        return result;
        });
        
        
    },
    delete: async (id) => {
        return await axiosClient.delete(`/brand/delete/${id}`).then(result => {
            if (!result.success)
            {
               return toast.error(result.message || "Xóa thông số thất bại")
            }
            toast.success("Xóa thông số thành công");
            return result;
        })
    }
}

export default brandApi