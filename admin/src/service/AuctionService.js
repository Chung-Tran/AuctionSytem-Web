import { toast } from "react-toastify";
import axiosClient from "utils/axiosConfig";

const auctionAPI = {

    getNewAuction: async () => {
        const newAuctionAPI = await axiosClient.get(`/auction?status=${'new'}`, { withCredentials: true })
            if (!newAuctionAPI.success) {
                return toast.error(login?.message || "Lấy danh sách phiên đấu giá đang chờ phê duyệt");
            }
        return newAuctionAPI 
    },

    getPendingAuction: async () => {
        const ongoingAPI = await axiosClient.get(`/auction/ongoing?status=${'pending'}`, { withCredentials: true })
            if (!ongoingAPI.success) {
                return toast.error(login?.message || "Lấy danh sách phiên đấu giá sắp diễn ra thất bại");
            }
        return ongoingAPI 
    },

    getActiveAuction: async () => {
        const ongoingAPI = await axiosClient.get(`/auction?status=${'active'}`, { withCredentials: true })
            if (!ongoingAPI.success) {
                return toast.error(login?.message || "Lấy danh sách phiên đấu giá đang diễn ra thất bại");
            }
        return ongoingAPI 
    },

    approve: async (id, values) => {
        const approveAPI = await axiosClient.put(`/auction/approve/${id}`, values, { withCredentials: true })
            if (!approveAPI.success) {
                return toast.error(login?.message || "Phê duyệt thất bại");
            }
        return approveAPI 
    },

    reject: async (id, reason) => {
        const rejectAPI = await axiosClient.put(`/auction/reject/${id}`,{ reason },
            { 
                withCredentials: true, 
                headers: { 
                    'Content-Type': 'application/json'  
                } 
            })
            if (!rejectAPI.success) {
                return toast.error(send?.message || "Từ chối thất bạiii");
            }
        return rejectAPI 
    },

    getDetailAuction: async (auctionSlug) => {
        const detailAuctionAPI = await axiosClient.get(`/auction/${auctionSlug}`, { withCredentials: true })
            if (!detailAuctionAPI.success) {
                return toast.error(login?.message || "Lấy chi tiết phiên đấu giá thất bại");
            }
        return detailAuctionAPI 
    },
}



export default auctionAPI
