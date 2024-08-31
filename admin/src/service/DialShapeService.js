import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const dialShapeApi={
    getAll : async ()=> {
        const dialshape =await axiosClient.get('/dialshape');
        if (!dialshape)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return dialshape;
    },
    getByID: async (id) => {
        const dialshape = await axiosClient.get(`/dialshape/${id}`);
        if (!dialshape)
        {
            toast.error("Không tìm thấy thông số");
            return;
        }
        return dialshape;
    },
    create: async (values) => {
        const model = {
            DialshapeName: values.DialShapeName,
            Description:values.Description
        }
        
        return await axiosClient.post('/dialshape/create', model).then(result => {
            if (!result.success) {
                toast.error(result.message || "Tạo thông số thất bại");
                return false;
            }
            toast.success(result.message || "Tạo thông số thành công");
            return result;
        })
    },
    update: async (values) => {
        return await axiosClient.put(`/dialshape/update`, values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Cập nhật thông số thất bại");
                return false;
            }
            toast.success(result.message || "Cật nhật thông số thành công");
        return result;
        });
        
        
    },
    delete: async (id) => {
        return await axiosClient.delete(`/dialshape/delete/${id}`).then(result => {
            if (!result.success)
            {
               return toast.error(result.message || "Xóa thông số thất bại")
            }
            toast.success("Xóa thông số thành công");
            return result;
        })
    }
}

export default dialShapeApi