import React, { createContext, useState, useContext } from "react";

// Create AuthContext
const AuthContext = createContext();

// Create a provider to wrap the app and provide global state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // console.log("AuthProvider rendered. isLoggedIn:", isLoggedIn);

  const logout = () => {
    console.log('User logged out.')
    setIsLoggedIn(false);
    exponea.anonymize();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("useAuth called. Context:", context);
  return context;
};