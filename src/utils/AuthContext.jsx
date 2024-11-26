import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

// Create a provider to wrap the app and provide global state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(''); 

  const logout = () => {
    console.log('User logged out.');
    setIsLoggedIn(false);
    setEmail(''); 
    exponea.anonymize();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, email, setEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};