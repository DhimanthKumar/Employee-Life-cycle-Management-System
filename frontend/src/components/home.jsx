import { Box, Flex, Text } from "@chakra-ui/react";
import CheckInOut from "./checkInOut";
import ViewTasks from "./viewtasks";
import { AuthContext } from "./authcontext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Flex minH="80vh">
      {/* Left Section - 70% */}
      <Box w="90%" p={4}>
        <ViewTasks />
      </Box>

      {/* Right Section - 30% */}
      <Box
        w={{ base: "90%", md: "50%", lg: "30%" }}
        p={1}
        borderLeft="2px solid"
        borderColor="gray.300"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
          <CheckInOut />

      </Box>
    </Flex>
  );
};

export default Home;
