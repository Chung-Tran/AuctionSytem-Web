import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const userApi = {
    getAllUser: async () => {
        const userList = await axiosClient.get('/user');
        if (!userList) {
            toast.error("Không tìm thấy người dùng");
            return;
        }
        return userList;
    },
    getByID: async (id) => {
        const userInfo = await axiosClient.get(`/user/${id}`);
        if (!userInfo) {
            toast.error("Không tìm thấy người dùng");
            return;
        }
        return userInfo;
    },
    create: async (values) => {
        try {
            const result = await axiosClient.post(`/user/createnew`, values);
    
            if (result.user.success === false) {
                toast.error(result.data.message);
                return false;
            } else {
                const createUserToRole = {
                    UserID: Number(result.user.data.userID),
                    RoleID: Number(values.RoleID)
                };
    
                const result2 = await axiosClient.post('/usertorole/createnew', createUserToRole);
    
                if (!result2.success) {
                    toast.error(result2.data.message);
                    return false;
                }
    
                toast.success(result.message);
                return true;
            }
        } catch (error) {
            toast.error("An error occurred while creating the user.");
            return false;
        }
    },
    delete: async (id) => {
        return await axiosClient.delete(`/user/delete/${id}`).then(result => {
            if (!result.success) {
                toast.error(result.message);
                return false
            }
            toast.success(result.message);
            return true
        })
    },
    update: async (values) => {
        var model = {
            ...values,
            status:values.StatusActive
        }
        return await axiosClient.put('user/update-user', model).then(result => {
            if (!result.success) 
                toast.error(result.message);
            toast.success(result.message);
        })
        
    }
    


}

export default userApi