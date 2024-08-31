import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const partnerApi={
    getAll : async ()=> {
        const partner =await axiosClient.get('/partner');
        if (!partner)
        {
            toast.error("Không tìm thấy đối tác");
            return;
        }
        return partner;
    },
    getByID: async (id) => {
        const partner = await axiosClient.get(`/partner/${id}`);
        if (!partner)
        {
            toast.error("Không tìm thấy đối tác");
            return;
        }
        return partner;
    },
    create: async (values) => {
        values.PartnerID=Number(values.PartnerID)
        return await axiosClient.post('/partner/create', values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Tạo đối tác thất bại");
                return false;
            }
            toast.success(result.message || "Tạo đối tác thành công");
            return result;
        })
    },
    update: async (values) => {
        return await axiosClient.put(`/partner/update`, values).then(result => {
            if (!result.success) {
                toast.error(result.message || "Cập nhật đối tác thất bại");
                return false;
            }
            toast.success(result.message || "Cật nhật đối tác thành công");
        return result;
        });
        
        
    },
    delete: async (id) => {
        return await axiosClient.delete(`/partner/delete/${id}`).then(result => {
            if (!result.success)
            {
               return toast.error(result.message || "Xóa đối tác thất bại")
            }
            toast.success("Xóa đối tác thành công");
            return result;
        })
    }
}

export default partnerApi