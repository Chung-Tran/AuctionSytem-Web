import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig";

const authApi = {
    login: async (userinfo) => {
        const login = await axiosClient.post(`/user/login`, userinfo, { withCredentials: true })
            if (!login.success) {
                return toast.error(login?.message || "Đăng nhập thật bại");
        }
            return login
        
}
}
export default authApi
