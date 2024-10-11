import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import ProfileService from './services/ProfileService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setUserData = (user) => {
        const { fullName, email, username, _id } = user;
        setUser({
            fullName,
            email,
            username,
            userId: _id,
        });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    // Decode token để lấy thông tin và thời gian tạo token
                    const decodedToken = jwtDecode(token);
                    const createdAt = new Date(decodedToken.createdAt);
                    const now = new Date();

                    if (
                        createdAt.getDate() !== now.getDate() ||
                        createdAt.getMonth() !== now.getMonth() ||
                        createdAt.getFullYear() !== now.getFullYear()
                    ) {
                        localStorage.removeItem('token');
                        setUser(null);
                    } else {
                        // Gọi API để lấy thông tin người dùng
                        const userInfo = await ProfileService.getById(decodedToken.userId);
                        setUserData(userInfo);
                    }
                } catch (error) {
                    console.error("Session expired", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
        };

        fetchUserData(); 
    }, []); 

    return (
        <AppContext.Provider value={{ user, setUserData }}>
            {children}
        </AppContext.Provider>
    );
};
