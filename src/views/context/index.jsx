import React, { createContext, useState, useEffect } from 'react';

export const MainContext = createContext();

const MainProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [adminRole, setAdminRole] = useState("");
    const [adminName, setAdminName] = useState("");


    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    const getUserRoleFromToken = () => {
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("adminToken="))
            ?.split("=")[1];

        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return {
                role: payload.role || null,
                name: payload.name || null
            };
        } catch (error) {
            return null;
        }
    };


    useEffect(() => {
        const userInfo = getUserRoleFromToken();

        if (userInfo) {
            setAdminRole(userInfo.role);
            setAdminName(userInfo.name);
            console.log(userInfo.role);
        }
        console.log(adminName);
        console.log(adminRole);
        if (BASE_URL) fetchCategories();
    }, []);

    return (
        <MainContext.Provider value={{ categories, adminRole, adminName, fetchCategories, setAdminRole, setAdminName }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainProvider;
