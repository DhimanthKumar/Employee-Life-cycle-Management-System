import { Box, Flex, Divider, Text } from "@chakra-ui/react";
import CheckInOut from "./checkInOut";
const Home = () => {
  return (
    <Flex minH="80vh">
      {/* Left Section - 70% */}
      <Box w="90%" p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Welcome to Employee Portal
        </Text>
        {/* Add your content here */}
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
  <Text fontSize="xl" mb={4} fontWeight="semibold">
    <CheckInOut />
  </Text>
</Box>
    </Flex>
  );
};

export default Home;
