import { toast } from "react-toastify";
import axiosClient from "utils/axiosConfig";

const auctionAPI = {

    getNewAuction: async () => {
        const newAuctionAPI = await axiosClient.get(`/auction?status=${'new'}`, { withCredentials: true })
            if (!newAuctionAPI.success) {
                return toast.error(newAuctionAPI?.message || "Lấy danh sách phiên đấu giá đang chờ phê duyệt");
            }
        return newAuctionAPI 
    },

    getPendingAuction: async () => {
        const pendingAuctionAPI = await axiosClient.get(`/auction/ongoing?status=${'pending'}`, { withCredentials: true })
            if (!pendingAuctionAPI.success) {
                return toast.error(pendingAuctionAPI?.message || "Lấy danh sách phiên đấu giá sắp diễn ra thất bại");
            }
        return pendingAuctionAPI 
    },

    getActiveAuction: async () => {
        const activeAuctionAPI = await axiosClient.get(`/auction?status=${'active'}`, { withCredentials: true })
            if (!activeAuctionAPI.success) {
                return toast.error(activeAuctionAPI?.message || "Lấy danh sách phiên đấu giá đang diễn ra thất bại");
            }
        return activeAuctionAPI 
    },

    getEndedAuction: async () => {
        const endedAuctionAPI = await axiosClient.get(`/auction?status=${'ended'}`, { withCredentials: true })
            if (!endedAuctionAPI.success) {
                return toast.error(endedAuctionAPI?.message || "Lấy danh sách phiên đấu giá đã kết thúc thất bại");
            }
        return endedAuctionAPI 
    },
    getCancelledAuction: async () => {
        const cancelAuctionAPI = await axiosClient.get(`/auction?status=${'cancelled'}`, { withCredentials: true })
            if (!cancelAuctionAPI.success) {
                return toast.error(cancelAuctionAPI?.message || "Lấy danh sách phiên đấu giá từ chối thất bại");
            }
        return cancelAuctionAPI 
    },

    approve: async (id, values) => {
        try {
            if (!id || typeof id !== 'string') {
                throw new Error("Invalid Auction ID: ID must be a valid string");
            }

            const approveAPI = await axiosClient.put(`/auction/approve/${id}`, values, 
                { 
                    withCredentials: true, 
                    headers: { 
                        'Content-Type': 'application/json'  
                    } 
                })
                if (!approveAPI.success) {
                    return toast.error(approveAPI?.message || "Phê duyệt thất bại");
                }
            return approveAPI 
        } catch (error) {
            console.error("Error in approve API:", error);
            throw error; // Để handleSubmit xử lý lỗi
        }
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
                return toast.error(rejectAPI?.message || "Từ chối thất bạiii");
            }
        return rejectAPI 
    },

    updateAuction: async (id, values) => {
        try {
            const updateAuctionAPI = await axiosClient.put(`/auction/update/${id}`, values, 
                { 
                    withCredentials: true, 
                    headers: { 
                        'Content-Type': 'application/json'  
                    } 
                })
                if (!updateAuctionAPI.success) {
                    return toast.error(updateAuctionAPI?.message || "Điều chỉnh thất bại");
                }
            return updateAuctionAPI 
        } catch (error) {
            console.error("Error in update API:", error);
            throw error; // Để handleSubmit xử lý lỗi
        }
    },

    endAuction: async (id, reason) => {
        const endAuctionAPI = await axiosClient.put(`/auction/end/${id}`,{ reason },
            { 
                withCredentials: true, 
                headers: { 
                    'Content-Type': 'application/json'  
                } 
            })
            if (!endAuctionAPI.success) {
                return toast.error(endAuctionAPI?.message || "Từ chối thất bạiii");
            }
        return endAuctionAPI 
    },

    kickCustomerOutOfAuction: async (auctionId, customerId) => {
        const kickCustomerOutOfAuctionAPI = await axiosClient.delete(`/auction/kickCustomer/${auctionId}/${customerId}`, { withCredentials: true })
            if (!kickCustomerOutOfAuctionAPI.success) {
                return toast.error(kickCustomerOutOfAuctionAPI?.message || "Xóa khách hàng khỏi phiên đấu giá thất bại");
            }
        return kickCustomerOutOfAuctionAPI 
    },

    getDetailAuction: async (auctionSlug) => {
        const detailAuctionAPI = await axiosClient.get(`/auction/${auctionSlug}`, { withCredentials: true })
            if (!detailAuctionAPI.success) {
                return toast.error(detailAuctionAPI?.message || "Lấy chi tiết phiên đấu giá thất bại");
            }
        return detailAuctionAPI 
    },
}



export default auctionAPI
