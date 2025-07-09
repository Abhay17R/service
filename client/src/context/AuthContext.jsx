import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import API from "../api/axios"; // Hamara central axios instance

// 1. Context banaya
const AuthContext = createContext();

// 2. Custom Hook banaya (Best Practice)
// Ab components me sirf `useAuth()` call karna hai
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Socket instance ko context ke bahar rakha
let socket;
export const getSocket = () => socket;

// 4. Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardVersion, setDashboardVersion] = useState(0); // For real-time updates

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    // --- FUNCTION 1: LOGIN LOGIC ---
    const login = async (email, password) => {
        try {
            const { data } = await API.post('/login', { email, password });
            if (data.success) {
                setUser(data.user); // Global user state update hua
                return { success: true, message: data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed.";
            return { success: false, message: errorMessage };
        }
    };
    
    // --- FUNCTION 2: LOGOUT LOGIC ---
    const logout = async () => {
        try {
            // Hardcoded URL ki jagah central API instance use kiya
            await API.get('/logout');
        } catch (error) {
            console.error("Logout API call failed, but logging out on client-side.");
        } finally {
            setUser(null); // User state ko null kiya
        }
    };

    // --- FUNCTION 3: CURRENT USER FETCH LOGIC ---
    const fetchLoggedInUser = async () => {
        try {
            const { data } = await API.get('/me');
            if (data.success) setUser(data.user);
            else setUser(null);
        } catch (error) {
            setUser(null);
        }
    };

    // --- EFFECT #1: INITIAL APP LOAD ---
    // Sirf ek baar chalta hai, yeh check karne ke liye ki user pehle se logged in hai ya nahi.
    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);
            await fetchLoggedInUser();
            setIsLoading(false);
        };
        initialLoad();
    }, []);

    // --- EFFECT #2: SOCKET CONNECTION MANAGEMENT ---
    // Yeh tab chalta hai jab user login ya logout hota hai.
    useEffect(() => {
        if (user) {
            // User login hua -> Naya socket connection banao
            socket = io(BACKEND_URL, { withCredentials: true });
            
            socket.on('connect', () => console.log(`✅ Socket connected for user: ${user.name}`));
            
            // Real-time events suno
            socket.on('userUpdated', () => {
                console.log('🔥 Real-time event: User data updated, re-fetching...');
                fetchLoggedInUser();
            });
            socket.on('dashboardUpdate', () => {
                console.log('🔥 Real-time event: Dashboard needs refresh.');
                setDashboardVersion(prev => prev + 1);
            });

            // Cleanup function jo component unmount hone par chalega
            return () => {
                if (socket) {
                    socket.off('userUpdated');
                    socket.off('dashboardUpdate');
                    socket.disconnect();
                }
            };
        } else {
            // User logout hua -> Socket disconnect karo
            if (socket) {
                socket.disconnect();
                console.log("❌ User logged out, socket disconnected.");
            }
        }
    }, [user]); // Yeh effect 'user' state par depend karta hai

    // Saari cheezein value prop se poori app ko provide karo
    const value = { user, isLoading, login, logout, fetchLoggedInUser, dashboardVersion };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};  