import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authcontext"; // ✅ Import AuthContext

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, authToken } = useContext(AuthContext); // ✅ Use context
    const navigate = useNavigate(); 

    // ✅ Redirect if already authenticated
    useEffect(() => {
        if (authToken) {
            console.log("User is logged in, navigating...");
            navigate("/Home");
        }
    }, [authToken, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/generateToken", {
                username,
                password,
            });

            login(response.data.token); // ✅ Update global state
            navigate("/Home"); // ✅ Navigate after login
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="border border-white p-6 rounded-md shadow-xl w-80 bg-gray-100">
                <h2>Enter Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="text-sm">Enter Username:</div>
                    <input
                        className="border border-black p-1 w-full"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />

                    <div className="text-sm mt-2">Enter Password:</div>
                    <input
                        type="password"
                        className="border border-black p-1 w-full"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <div className="bg-gray-400 hover:bg-gray-600 mt-3 p-2 rounded-md shadow-xl text-center">
                        <button type="submit" className="w-full text-white">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
