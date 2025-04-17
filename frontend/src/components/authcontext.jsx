import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [userdata, setUserdata] = useState(null);
    const navigate = useNavigate();
    const [isstaff, setIsstaff] = useState(false);
    const [isadmin, setIsadmin] = useState(false);
    const [allowedroles, setAllowedroles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [checkintime, setCheckintime] = useState("");
    const [checkouttime, setCheckouttime] = useState("");
    const [ischeckedin, setIscheckedin] = useState(null);
    const [ischeckedout, setIscheckedout] = useState(false);
    const [teamsleading, setTeamsleading] = useState([]); // Default to an empty array
    const [isteamleader, setIsteamleader] = useState(false);
    const [teammemberinfo, setTeammemberinfo] = useState({}); // Default to an empty object

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            fetchUserProfile(token);
        }
    }, [isAuthenticated]);

    const fetchUserProfile = (token) => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/Profile`, {
                headers: { Authorization: `Token ${token}` },
            })
            .then((response) => {
                console.log(response.data);
                setUserdata(response.data);
                fetchDepartments(token);
                ischecked(token);
                fetchTeams(token);
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

    const fetchTeams = (token) => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/get_teams`, {
            headers: { Authorization: `Token ${token}` }
        }).then(res => {
            console.log(res.data.Teams);
            if (res.data.Teams.length > 0) {
                setIsteamleader(true);
                setTeamsleading(res.data.Teams); // Update state here
            }
        });
    };

    useEffect(() => {
        if (teamsleading.length > 0) {
            // Only fetch team members after teamsleading state has been updated
            fetchTeamMembers(localStorage.getItem("token"), teamsleading);
        }
    }, [teamsleading]); // This hook will run when teamsleading changes

    const fetchTeamMembers = (token, teamsLeading) => {
        const teamMemberInfoTemp = {}; // Temporary object to hold team member info
    
        const fetchPromises = teamsLeading.map((team) => {
            return axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/team/${team.id}/members`, {
                    headers: { Authorization: `Token ${token}` },
                })
                .then((response) => {
                    // Store the team member info temporarily
                    teamMemberInfoTemp[team.id] = response.data;
                })
                .catch((error) => {
                    console.error(`Failed to fetch members for team ${team.id}:`, error);
                    teamMemberInfoTemp[team.id] = { error: true, detail: error.response?.data?.detail || "Unknown error" };
                });
        });
    
        // After all the requests are made
        Promise.all(fetchPromises)
            .then(() => {
                // Set the state with the accumulated team member info
                setTeammemberinfo(teamMemberInfoTemp);
                console.log("Team Member Info:", teamMemberInfoTemp); // You can see the data now
            })
            .catch((error) => {
                console.error("Error with fetching some team members:", error);
            });
    };

    const ischecked = (token) => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/user-checkin-checkout/`, {
            headers: { Authorization: `Token ${token}` }
        }).then(res => {
            setIscheckedin(res.data.checked_in);
            if (res.data.checked_in) {
                setCheckintime(res.data.check_in_time);
                setCheckouttime(res.data.check_out_time);
                setIscheckedout(res.data.checked_out);
            }
        });
    };

    const checkin = (token) => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/user-checkin-checkout/`, {}, {
            headers: { Authorization: `Token ${token}` }
        }).then(res => {
            setIscheckedin(true);
            setCheckintime(res.data.check_in_time);
            setCheckouttime(res.data.check_out_time);
        }).catch(err => {
            console.log(err);
        });
    };

    const checkout = (token) => {
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/user-checkin-checkout/`, {}, {
            headers: { Authorization: `Token ${token}` }
        }).then(res => {
            setIscheckedout(true);
            setCheckouttime(res.data.check_out_time);
        }).catch(err => {
            console.log(err);
        });
    };

    const handleStaff = (token) => {
        setIsstaff(true);
        fetchAllowedRoles(token);
    };

    const fetchDepartments = (token) => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/departments`, {
            headers: { Authorization: `Token ${token}` },
        }).then(res => {
            setDepartments(res.data.Departments);
        });
    };

    const fetchAllowedRoles = (token) => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/get_all_roles`, {
            headers: { Authorization: `Token ${token}` },
        }).then((res) => {
            setAllowedroles(res.data.roles);
        }).catch((error) => {
            console.error("Failed to fetch allowed roles", error);
        });
    };

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
        setUserdata(null);
        setIsstaff(false);
        setIsadmin(false);
        navigate('/login');
        setAllowedroles([]);
        setDepartments([]);
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated, login, logout, userdata, isstaff, isadmin, allowedroles, departments, checkintime, checkouttime,
            checkin, ischeckedin, checkout, ischeckedout, isteamleader, teamsleading, teammemberinfo
        }}>
            {children}
        </AuthContext.Provider>
    );
};
