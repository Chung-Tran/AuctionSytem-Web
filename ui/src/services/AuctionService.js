import { handleResponse, handleResponseError, openNotify } from "../commons/MethodsCommons";
import axiosClient from "../config/axiosClient";

const AuctionService = {
    register: async (auctionInfo) => {
        if (!auctionInfo) {
            openNotify('error','auctionInfo is required')
            return;
        }
        const payload = JSON.stringify(
            auctionInfo,
        );

        try {
            const response = await axiosClient.post('/auctions/register', payload);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
           handleResponseError(error)
        }
    },
    getList: async ({limit,page,status}) => {
        try {
            const response = await axiosClient.get('/auctions/',{  params: { limit, page, status }});
            const data = await handleResponse(response);
            return data;
        } catch (error) {
           handleResponseError(error)
        }
    },
    getDetail: async (auctionSlug) => {
        try {
            const response = await axiosClient.get(`/auctions/${auctionSlug}`);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
           handleResponseError(error)
        }
    },
    getOutstanding: async () => {
        try {
            const response = await axiosClient.get(`auctions/outstanding`);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
           handleResponseError(error)
        }
    },
}

export default AuctionService;
