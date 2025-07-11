// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API from "../api/axios";

export const AuthContext = createContext();

let socket;
export const getSocket = () => socket;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardVersion, setDashboardVersion] = useState(0);

  const BACKEND_URL = import.meta.env.VITE_API_URL|| 'http://localhost:4000';

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/login', { email, password });
      if (data.success) {
        setUser(data.user);
        return { success: true, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed.";
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await API.get('/logout');
    } catch {
      console.error("Logout API failed, but logging out on client-side.");
    } finally {
      setUser(null);
    }
  };

  const fetchLoggedInUser = async () => {
    try {
      const { data } = await API.get('/me');
      if (data.success) setUser(data.user);
      else setUser(null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await fetchLoggedInUser();
      setIsLoading(false);
    };
    initialLoad();
  }, []);

  useEffect(() => {
    if (user) {
      socket = io(BACKEND_URL, { withCredentials: true });

      socket.on('connect', () => console.log(`✅ Socket connected for user: ${user.name}`));

      socket.on('userUpdated', () => {
        console.log('🔥 Real-time event: User data updated, re-fetching...');
        fetchLoggedInUser();
      });

      socket.on('dashboardUpdate', () => {
        console.log('🔥 Real-time event: Dashboard needs refresh.');
        setDashboardVersion(prev => prev + 1);
      });

      return () => {
        if (socket) {
          socket.off('userUpdated');
          socket.off('dashboardUpdate');
          socket.disconnect();
        }
      };
    } else {
      if (socket) {
        socket.disconnect();
        console.log("❌ User logged out, socket disconnected.");
      }
    }
  }, [user]);

  const value = { user, isLoading, login, logout, fetchLoggedInUser, dashboardVersion };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
