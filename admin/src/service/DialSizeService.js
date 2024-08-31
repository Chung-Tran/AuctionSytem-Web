import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const dialSizeApi={
    getAll : async ()=> {
        const dialSize =await axiosClient.get('/dialsize');
        if (!dialSize)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return dialSize;
    },
    getByID: async (id) => {
        const dialSize = await axiosClient.get(`/dialsize/${id}`);
        if (!dialSize)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return dialSize;
    },
    create: async (values) => {
        const model = {
            DialSizeName: values.DialSizeName,
            Description:values.Description
        }
        
        return await axiosClient.post('/dialsize/create', model).then(result => {
            if (!result.success) {
                toast.error(result.message || "Tạo thông số thất bại");
                return false;
            }
            toast.success(result.message || "Tạo thông số thành công");
            return result;
        })
    },
    update: async (values) => {
        return await axiosClient.put(`/dialsize/update`, values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Cập nhật thông số thất bại");
                return false;
            }
            toast.success(result.message || "Cật nhật thông số thành công");
        return result;
        });
        
        
    },
    delete: async (id) => {
        return await axiosClient.delete(`/dialsize/delete/${id}`).then(result => {
            if (!result.success)
            {
               return toast.error(result.message || "Xóa thông số thất bại")
            }
            toast.success("Xóa thông số thành công");
            return result;
        })
    }
}

export default dialSizeApi