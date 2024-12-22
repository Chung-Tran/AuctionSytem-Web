import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProfileService from './services/ProfileService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [openLoginModal, setOpenLoginModal] = useState(null);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    const setUserData = (user) => {
        const { fullName, email, username, _id } = user;
        setUser({
            fullName,
            email,
            username,
            userId: _id,
        });
    };
    const toggleLoginModal = (value) => {
        value == undefined
            ? setOpenLoginModal(!openLoginModal)
            : setOpenLoginModal(value)
    }
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

        //get language
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) setLanguage(storedLanguage);

    }, []);
    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    useEffect(() => {

    }, []);

    return (
        <AppContext.Provider value={{ user, setUserData, openLoginModal, toggleLoginModal, language, changeLanguage }}>
            {children}
        </AppContext.Provider>
    );
};
