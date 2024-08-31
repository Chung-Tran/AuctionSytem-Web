import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5151/api",
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials:true
    
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) return response.data
    },
    (err) => {
        return Promise.reject(err)
    }
);
export default axiosClient;