/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || null
  ); // Initialize userRole

  const login = (token, role) => {
    // Accept role as a parameter
    localStorage.setItem("token", token);
    localStorage.setItem("role", role); // Store role in localStorage
    setIsAuthenticated(true);
    setUserRole(role); // Set userRole in state
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Remove role from localStorage
    setIsAuthenticated(false);
    setUserRole(null); // Reset userRole in state
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
