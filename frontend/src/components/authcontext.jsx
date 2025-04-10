import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null); // ✅ Ensure context is created

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [userdata, setUserdata] = useState(null);
    const navigate = useNavigate();
    const [isstaff, setIsstaff] = useState(false);
    const [isadmin, setIsadmin] = useState(false);
    const [allowedroles, setAllowedroles] = useState([]);
    const [departments,setDepartments]=useState([]);
    const [checkintime,setCheckintime] = useState("")
    const [checkouttime,setCheckouttime] = useState("")
    const [ischeckedin,setIscheckedin]=useState(null)
    const [ischeckedout , setIscheckedout] = useState(false);
    // ✅ Automatically fetch user data if logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (token) {
            fetchUserProfile(token);
        }
    }, [isAuthenticated]);
    
    const fetchUserProfile = (token) => {
        axios
            .get("http://127.0.0.1:8000/api/Profile", {
                headers: { Authorization: `Token ${token}` },
            })
            .then((response) => {
                setUserdata(response.data);
                fetchDepartments(token);
                ischecked(token);
                if (response.data.Staff) {
                    handleStaff(token);
                }
    
                if (response.data.Admin) {
                    setIsadmin(true);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch user data", error);
                logout();
            });
    };
    const ischecked = (token)=>{
        axios.get('http://127.0.0.1:8000/api/user-checkin-checkout/',
            {
                headers: { Authorization: `Token ${token}` }
            }
        ).then(res =>{
            setIscheckedin(res.data.checked_in);
            if (res.data.checked_in){
                setCheckintime(res.data.check_in_time);
            setCheckouttime(res.data.check_out_time);
            setIscheckedout(res.data.checked_out);
            }

        })
    }
    const checkin = (token)=>{
        axios.post('http://127.0.0.1:8000/api/user-checkin-checkout/', {},
            {
                headers: { Authorization: `Token ${token}` }
            }
        ).then(res => {
            setIscheckedin(true);
            setCheckintime(res.data.check_in_time);
            setCheckouttime(res.data.check_out_time);
            // console.log(res.data.check_in_time);
        }).catch(err => {
            console.log(err);
            console.log("error")
        })
    }
    const checkout = (token)=>{
        axios.put('http://127.0.0.1:8000/api/user-checkin-checkout/', {},
            {
                headers: { Authorization: `Token ${token}` }
            }
        ).then(res => {
            setIscheckedout(true);
            setCheckouttime(res.data.check_out_time);
            // console.log(res.data.check_in_time);
        }).catch(err => {
            console.log(err);
            console.log("error")
        })
    }
    const handleStaff = (token) => {
        setIsstaff(true);
        fetchAllowedRoles(token);
    };
    const fetchDepartments = token =>{
        axios.get('http://127.0.0.1:8000/api/departments' ,{
            headers: { Authorization: `Token ${token}` },
        }).then(res =>{
            setDepartments(res.data.Departments);
        })
    }
    const fetchAllowedRoles = (token) => {
        axios
            .get("http://127.0.0.1:8000/api/get_all_roles", {
                headers: { Authorization: `Token ${token}` },
            })
            .then((res) => {
                setAllowedroles(res.data.roles);
            })
            .catch((error) => {
                console.error("Failed to fetch allowed roles", error);
            });
    }; // ✅ Refetch user data when authentication state changes

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
        setIsstaff(false);
        setIsadmin(false);
        navigate('/home');
        setAllowedroles([]);
        setDepartments([]);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout,
         userdata, isstaff, isadmin , allowedroles,departments ,checkintime,checkouttime,
         checkin , ischeckedin , checkout , ischeckedout}}>
            {children}
        </AuthContext.Provider>
    );
};

