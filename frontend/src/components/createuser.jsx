import { useContext, useEffect, useState } from "react";
import AuthContext from "./authcontext";
import { Box, Button, Flex, FormControl, FormLabel, Heading, HStack, Input, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import { Form, Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
    const handlesubmit = (e)=>{
        e.preventDefault();
        let reqbody ={
            "username": username,
            "email": email,
            "password": password,
            "role": role == 'TeamMember' ? 'member' : 'leader',
                "is_staff":userstaff,
            "is_superuser":useradmin,
        }
        if(phone.length==10){
        reqbody = {...reqbody ,'phone' : phone}}
        console.log(reqbody);
        axios.post('http://127.0.0.1:8000/api/create', reqbody, {headers: { 
            "Authorization": `Token ${localStorage.getItem("token")}`  // ❌ "Headers:" is incorrect
        }})
                    .then(Response => {if(Response.status==201) {                navigator("status" , {
                        "message" : Response.message
                    })
                    }}
                )
            .catch(e=>{
                navigator("status",{
                    "message" : e.Error
                })
            })
        
    }
    const handleadmin = (e)=>{
        
        if(!userstaff){setUseradmin(e.target.checked); 
            setUserstaff(e.target.checked);
        }
        else{setUseradmin(e.target.checked);
            setTriedadmin(false);
        }
    }
    const handlestaff = (e)=>{
        setUserstaff(e.target.checked);
        setUseradmin(false);
    }
    const inputstyle= {'padding' : '1px 2px'}
    return isstaff? (
        <Box maxWidth="400px" margin="auto" mt={10} className="w-fit" >
            <form onSubmit={handlesubmit}>
                <VStack
                    className="space-y-9 bg-blue-300 p-8 rounded-xl shadow-md w-full"
                >
                    <Heading size="md" textAlign="center">Enter New User Details</Heading>

                    <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input style={inputstyle} placeholder="Enter your name" bg="white" minLength={8} maxLength={50} value={username} onChange={ (e)=>setUsername(e.target.value)} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input style={inputstyle} type="password" bg="white" minLength={8} maxLength={50} placeholder="Enter password" value={password} onChange={ e=>setPassword(e.target.value)}/>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input style={inputstyle} type="email" bg="white"  placeholder="Enter email" value={email} onChange={e=>setEmail(e.target.value)} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Phone Number</FormLabel>
                        <Input style={inputstyle} type="tel" bg="white" minLength={10} maxLength={10} placeholder="Enter MobileNumber" value={phone} onChange={e=>setPhone(e.target.value)} />
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
                        <label>Staff : <input type="checkbox" checked={userstaff} onChange={handlestaff}/></label>
                        {isadmin&& <label>Admin : <input type="checkbox" onChange={handleadmin} checked={useradmin} /></label>}
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
