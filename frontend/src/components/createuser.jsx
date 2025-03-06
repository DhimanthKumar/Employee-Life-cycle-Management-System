import { useContext, useEffect, useState } from "react";
import AuthContext from "./authcontext";
import { Box, Button, Flex, FormControl, FormLabel, Heading, HStack, Input, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import { Form, Link, useNavigate } from "react-router-dom";

const Createuser = () => {
    const { isAuthenticated, logout, userdata, isstaff ,isadmin} = useContext(AuthContext);
    const navigator = useNavigate();
    const [username,setUsername]=useState('');
    
    const [password,setPassword]=useState('');
    const [email,setEmail]=useState('');
    const [phone,setPhone]=useState('');
    const [userstaff,setUserstaff]=useState(false);
    const [useradmin,setUseradmin]=useState(false);
    const [role,setRole]=useState('');
    const [triedadmin,setTriedadmin]=useState(false);
    return isstaff? (
        <Box maxWidth="400px" margin="auto" mt={10} className="w-fit" >
            <form>
                <VStack
                    className="space-y-9 bg-blue-300 p-8 rounded-xl shadow-md w-full"
                >
                    <Heading size="md" textAlign="center">Enter New User Details</Heading>

                    <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input placeholder="Enter your name" bg="white" value={username} onChange={ (e)=>setUsername(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input type="password" bg="white"  placeholder="Enter password" value={password} onChange={ e=>setPassword(e.target.value)}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" bg="white" placeholder="Enter email" value={email} onChange={e=>setEmail(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Phone Number</FormLabel>
                        <Input type="tel" bg="white" placeholder="Enter MobileNumber" value={phone} onChange={e=>setPhone(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                    <HStack>
                    <FormLabel>Role</FormLabel>
                        <select className="bg-white" value={role} onChange={e=>setRole(e.target.value)}>
                            <option>TeamMember</option>
                            <option>TeamLeader</option>
                        </select>
                        
                    </HStack></FormControl>
                    <VStack>
                        <label>Staff : <input type="checkbox"/></label>
                        {isadmin&& <label>Admin : <input type="checkbox"/></label>}
                    </VStack>

                    <div className="bg-white hover:bg-gray-600  p-1 rounded-md shadow-xl text-center w-full">
                        <button type="submit" className="w-full text-white">CreateUser</button>
                    </div>
                </VStack>
            </form>
        </Box>
    ) : (<VStack>
        <p>You are not Authorised to use</p>
        <Link to={'/Home'}>Home</Link>
    </VStack>);
}

export default Createuser;
