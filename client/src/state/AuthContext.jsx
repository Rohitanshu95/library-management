import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // Navigation: 'home', 'courses', 'library', 'pdfs', 'tests', 'gallery', 'inquiry', 'student_dashboard', 'admin_dashboard'

  // Load user from session
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    if (userData.role === 'STUDENT') {
      setActiveTab('student_dashboard');
    } else {
      setActiveTab('admin_dashboard');
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('home');
  };

  const switchDemoRole = async (role) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(role);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        if (res.user.role === 'STUDENT') {
          setActiveTab('student_dashboard');
        } else {
          setActiveTab('admin_dashboard');
        }
      }
    } catch (err) {
      console.error('Demo switch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        activeTab,
        setActiveTab,
        loginUser,
        logoutUser,
        switchDemoRole,
        isAdmin: user && user.role !== 'STUDENT',
        isStudent: user && user.role === 'STUDENT',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
