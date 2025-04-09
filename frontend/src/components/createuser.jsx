import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authcontext";
import { Box, Button, Flex, Heading, Input, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Createuser = () => {
    const { isstaff, isadmin, allowedroles, departments } = useContext(AuthContext);
    const navigator = useNavigate();
    const inputstyle = { padding: "1px 2px" };

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [userstaff, setUserstaff] = useState(false);
    const [useradmin, setUseradmin] = useState(false);
    const [role, setRole] = useState("");
    const [dateofjoin, setDateofjoin] = useState("")
    const [department, setDepartment] = useState("")
    const [managerslist,setManagerslist] = useState([])
    const [manager,setManager]=useState("");
    useEffect( () =>{
        axios.get('http://127.0.0.1:8000/api/get_managers',{
                  headers: { Authorization: `Token ${localStorage.getItem("token")}` },
               }).then(Response =>{
                setManagerslist(Response.data.Managers);
                console.log(Response.data.Managers);
               })


    } , [])
    const handlesubmit = (e) => {
        if (role == "" || department == "" || manager == "") {
            console.log('as')
            window.alert("Please select Role and Department");
            return;
        }
        e.preventDefault();
        console.log(role);
        let reqbody = {
            username,
            email,
            password,
            role: role,
            is_staff: userstaff,
            is_superuser: useradmin,
            date_of_joining: dateofjoin,
            department: department,
            manager:manager
        };
        if (phone.length === 10) reqbody = { ...reqbody, phone };
        console.log(reqbody)
        axios
            .post("http://127.0.0.1:8000/api/create", reqbody, {
                headers: { Authorization: `Token ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                if (res.status === 201) {
                    navigator("status", { message: res.message });
                }
            })
            .catch((e) => {
                navigator("status", { message: e.message });
            });
    };

    return isstaff ? (
        <Box mt={10} mx="auto" w="fit-content">
            <form onSubmit={handlesubmit}>
                <VStack
                    spacing={6}
                    className="bg-blue-300 p-8 rounded-xl shadow-md"
                    w="fit-content"
                >
                    <Heading size="md" textAlign="center">
                        Enter New User Details
                    </Heading>

                    {[
                        { label: "Username", type: "text", val: username, setter: setUsername },
                        { label: "Password", type: "password", val: password, setter: setPassword },
                        { label: "Email", type: "email", val: email, setter: setEmail },
                        { label: "Phone", type: "tel", val: phone, setter: setPhone },
                    ].map(({ label, type, val, setter }) => (
                        <Flex direction="column" w="fit-content" textAlign="left" key={label}>
                            <label>{label}</label>
                            <Input
                                style={inputstyle}
                                bg="white"
                                type={type}
                                minLength={type === "tel" ? 10 : 8}
                                maxLength={50}
                                value={val}
                                onChange={(e) => setter(e.target.value)}
                            />
                        </Flex>
                    ))}

                    <Flex w="100%" justifyContent="flex-start">
                        <Box>
                            <label style={{ display: "block", marginBottom: "4px" }}>Role</label>
                            <select
                                className="bg-white"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={inputstyle}
                            >
                                <option value="">-- Choose Role --</option>
                                {allowedroles.map((item) => (
                                    <option key={item.id} value={item.role_name}>
                                        {item.role_name}
                                    </option>
                                ))}
                            </select>
                        </Box>
                    </Flex>

                    <Flex w="100%" justifyContent="flex-start">
                        <Box>
                            <label style={{ display: "block", marginBottom: "4px" }}>Department</label>
                            <select
                                className="bg-white"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                style={inputstyle}
                            >
                                <option value="">-- Choose Department --</option>
                                {departments.map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </Box>
                    </Flex>
                    <Flex w="100%" justifyContent="flex-start">
                        <Box>
                            <label style={{ display: "block", marginBottom: "4px" }}>Manager</label>
                            <select
                                className="bg-white"
                                value={manager}
                                onChange={(e) => setManager(e.target.value)}
                                style={inputstyle}
                            >
                                <option value="">-- Choose Manager --</option>
                               
                                {
                                managerslist.map((item) => (
                                    <option key={item.user.username} value={item.user.username}>
                                        {item.user.username}
                                    </option>
                                ))}
                            </select>
                        </Box>
                    </Flex>

                    <Flex w="100%" justifyContent="flex-start">
                        <Box>
                            <label style={{ display: "block", marginBottom: "4px" }}>Date Of Joining</label>
                            <Input type="date" bg="white" style={inputstyle} value={dateofjoin}
                                onChange={e => { setDateofjoin(e.target.value); }
                                }
                            />
                        </Box>
                    </Flex>


                    {isadmin && (
                        <Flex direction="column" w="fit-content" textAlign="left">
                            <label>
                                Staff:{" "}
                                <input
                                    type="checkbox"
                                    checked={userstaff}
                                    onChange={(e) => {
                                        setUserstaff(e.target.checked);
                                        setUseradmin(false);
                                    }}
                                />
                            </label>
                            <label>
                                Admin:{" "}
                                <input
                                    type="checkbox"
                                    checked={useradmin}
                                    onChange={(e) => {
                                        if (!userstaff) {
                                            setUseradmin(e.target.checked);
                                            setUserstaff(e.target.checked);
                                        } else {
                                            setUseradmin(e.target.checked);
                                        }
                                    }}
                                />
                            </label>
                        </Flex>
                    )}

                    <button
                        type="submit"
                        className="!bg-gray-200 hover:!bg-gray-400 text-white font-medium py-2 px-5 rounded-lg transition duration-800 w-fit"
                        style={{ padding: '8px 12px' }}
                    >
                        Create User
                    </button>

                </VStack>
            </form>
        </Box>
    ) : (
        <VStack>
            <p>You are not Authorised to use</p>
            <Link to="/Home">Home</Link>
        </VStack>
    );
};

export default Createuser;
