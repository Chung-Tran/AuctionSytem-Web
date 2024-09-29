import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" />;
    }
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // Kiểm tra xem token  hết hạn
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            return <Navigate to="/" />;
        }
        return <Outlet />;
    } catch (error) {
        console.error("Token không hợp lệ", error);
        localStorage.removeItem('token');
        return <Navigate to="/" />;
    }
};

export default PrivateRoute;
