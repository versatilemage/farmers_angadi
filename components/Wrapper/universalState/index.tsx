"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [selectedUserData, setSelectedUserdata] = useState(null); // User data state
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedAddress, setSelectedAddress] = useState(null); // Address state

  return (
    <AuthContext.Provider
      value={{
        selectedUserData,
        setSelectedUserdata,
        loading,
        setLoading,
        selectedAddress,
        setSelectedAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
