import { VStack, Text, Button, Box, Input } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const Creationstatus = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // This will get the message passed via navigate
    const message = location.state?.message || "No status available";

    return (
        <VStack className="flex flex-col justify-center items-center h-screen bg-blue-100 gap-4">
            <Text fontSize="2xl" fontWeight="bold">
                {message}
            </Text>

            <Button variant="solid" colorScheme="blue" onClick={() => navigate("/createuser")}>
  Create New User
</Button>
            <Button variant="solid" colorScheme="blue" onClick={() => navigate("/createteam")}>
  Create New Team
</Button>
            <Button variant="solid" colorScheme="green" onClick={() => navigate("/")}>
                Go to Home
            </Button>
        </VStack>
    );
};

export default Creationstatus;
