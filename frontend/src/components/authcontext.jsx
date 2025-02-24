import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null); // ✅ Ensure context is created

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [userdata, setUserdata] = useState(null);

    // ✅ Automatically fetch user data if logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://127.0.0.1:8000/api/Profile", {
                headers: { Authorization: `Token ${token}` },
            })
            .then((response) => {
                setUserdata(response.data);
            })
            .catch((error) => {
                console.error("Failed to fetch user data", error);
                logout(); // Logout if token is invalid
            });
        }
    }, [isAuthenticated]); // ✅ Refetch user data when authentication state changes

    // ✅ Update authentication state if token changes in another tab
    useEffect(() => {
        const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserdata(null); // ✅ Clear user data on logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userdata }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
