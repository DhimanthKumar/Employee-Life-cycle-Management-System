import { useContext } from "react";
import AuthContext from "./authcontext";
import { Box, HStack, Image, VStack } from "@chakra-ui/react";
const Userprofile = () => {
    const { userdata } = useContext(AuthContext);
    console.log(userdata)
    
    return (
        <div className="flex justify-center  m-10 h-screen">
            <div className="flex flex-col w-fit ">
                <p style={{ textAlign: "center" }}>Personal Details</p>
                <VStack className="bg-blue-200 p-5 rounded-xl ">
                    <HStack>
                        <Image
                            src="https://www.w3schools.com/w3images/avatar2.png"
                            alt="John Doe"
                            boxSize="100px"
                            borderRadius="full"
                            objectFit="cover"
                        />
                    </HStack>
                    <HStack justifyContent="flex-start" className="w-full" >
                        <Box>Name: </Box>
                        <Box>{userdata.name}</Box>
                    </HStack>
                    <HStack justifyContent="flex-start" className="w-full"> 
                        <Box>Email : </Box>
                        <Box>{userdata.email}</Box>
                    </HStack>
                    <HStack justifyContent="flex-start" className="w-full"> 
                        <Box>Phone Num : </Box>
                        <Box>{userdata.phone}</Box>
                    </HStack>
                    {userdata.Staff && <HStack justifyContent="flex-start" className="w-full"> 
                        <Box>Staff : ✅ </Box>
                        
                    </HStack>}
                    {userdata.Admin && <HStack justifyContent="flex-start" className="w-full"> 
                        <Box>Admin : ✅ </Box>
                        
                    </HStack>}
                    
                </VStack>
            </div>
        </div>
    );
    
}
export default Userprofile;