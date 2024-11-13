import { toast } from "react-toastify";
import axiosClient from "utils/axiosConfig";

const auctionAPI = {

    getOngoing: async () => {
        const ongoingAPI = await axiosClient.get(`/auction/ongoing`, { withCredentials: true })
            if (!ongoingAPI.success) {
                return toast.error(login?.message || "Lấy danh sách phiên đấu giá đang diễn ra thất bại");
            }
        return ongoingAPI 
    },

    approve: async (id) => {
        const approveAPI = await axiosClient.put(`/auction/approve/${id}`, { withCredentials: true })
            if (!approveAPI.success) {
                return toast.error(login?.message || "Phê duyệt thất bại");
            }
        return approveAPI 
    },

    reject: async (id) => {
        const rejectAPI = await axiosClient.put(`/auction/reject/${id}`, { withCredentials: true })
            if (!rejectAPI.success) {
                return toast.error(send?.message || "Phê duyệt thất bạiii");
            }
        return rejectAPI 
    },

    
}



export default auctionAPI
