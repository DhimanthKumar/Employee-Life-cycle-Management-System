import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authcontext"; // ✅ Import AuthContext
import Wrongdetail from "./incorrectdetails";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, isAuthenticated,userdata,profile } = useContext(AuthContext); // ✅ Use context
    const navigate = useNavigate(); 
    const [incorrectdetails,setIncorrectdetails]=useState(false);
    // ✅ Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log("User is logged in, navigating...");
            navigate("/Home");
        }
    }, [isAuthenticated, navigate]);
    console.log(userdata);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/generateToken", {
                username,
                password,
            });

            login(response.data.token); // ✅ Update global state
            navigate("/Home"); // ✅ Navigate after login
            setIncorrectdetails(false)
               
            
        } catch (error) {
            console.error("Login failed", error);
            setIncorrectdetails(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="border border-white p-6 rounded-md shadow-xl w-80 bg-gray-100">
                <h2>Enter Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="text-sm">Enter Username:</div>
                    <input
                        style={{border:"1px solid black" , padding: " 1px 3px"}}

                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />

                    <div className="text-sm mt-2">Enter Password:</div>
                    <input
                        type="password"
                        style={{border:"1px solid black",padding:"1px 3px"}}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    {incorrectdetails && <Wrongdetail/>}
                    <div className="bg-gray-400 hover:bg-gray-600 mt-3 p-2 rounded-md shadow-xl text-center">
                        <button type="submit" className="w-full text-white">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
