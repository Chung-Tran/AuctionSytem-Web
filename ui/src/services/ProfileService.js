import { handleResponse, handleResponseError, openNotify } from "../commons/MethodsCommons";
import axiosClient from "../config/axiosClient";

const ProfileService = {
    getById: async (id) => {
        if (!id) {
            return;
        }
        try {
            const response = await axiosClient.get(`customers/${id}`);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
            handleResponseError(error)
        }
    },
    updateProfile: async (values) => {
        if (!values) {
            return;
        }
        const payload = JSON.stringify(values)
        try {
            const response = await axiosClient.put(`customers`,payload);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
            throw new Error(error.message || 'Fetch data failed');
        }
    },
}

export default ProfileService;
