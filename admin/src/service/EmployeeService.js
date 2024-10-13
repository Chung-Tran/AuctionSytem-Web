import { toast } from "react-toastify";
import axiosClient from "src/utils/axiosConfig"

const employeeApi = {
    getAllEmployee: async () => {
        const userList = await axiosClient.get(`/employee/getall`);
        if (!userList) {
            toast.error("Không tìm thấy người dùng");
            return;
        }
        return userList;
    },
    getByID: async (id) => {
        const userInfo = await axiosClient.get(`/employee/${id}`);
        if (!userInfo) {
            toast.error("Không tìm thấy người dùng");
            return;
        }
        return userInfo;
    },
    create: async (values) => {
        try {
            const result = await axiosClient.post(`/employee`, values);
            console.log("KQ:", result);
            if (result.success === false) {
                toast.error(result.message);
                return false;
            } else {
                // const createUserToRole = {
                //     UserID: Number(result.user.data.userID),
                //     RoleID: Number(values.RoleID)
                // };
    
                // const result2 = await axiosClient.post('/usertorole/createnew', createUserToRole);
    
                // if (!result2.success) {
                //     toast.error(result2.data.message);
                //     return false;
                // }
    
                toast.success(result.message);
                return result;
            }
        } catch (error) {
            // toast.error("An error occurred while creating the user.");
            return false;
        }
    },
    delete: async (id) => {
        return await axiosClient.delete(`/employee/${id}`).then(result => {
            if (!result.success) {
                toast.error(result.message);
                return false
            }
            toast.success(result.message);
            return true
        })
    },
    update: async (id, values) => {
        var model = {
            // ...values,
            fullName: values.fullName,
            username: values.username,
            email: values.email,
            phoneNumber: values.phoneNumber,
            rolePermission: values.rolePermission,
            status: values.status,
        }

        return await axiosClient.patch(`employee/${id}`, model).then(result => {
            if (!result.success) 
                toast.error(result.message);
            toast.success(result.message);
        })
        
    }
    


}

export default employeeApi