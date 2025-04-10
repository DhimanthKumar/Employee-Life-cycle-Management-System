import { useContext, useEffect } from "react";
import { AuthContext } from "./authcontext";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Heading,
  Badge,
  Button,
  Spinner,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const Userprofile = () => {
  const { userdata, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/Login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated && userdata ? (
    <Flex justify="center" align="center" h="80vh" px={4}>
      <VStack
        bg="blue.100"
        p={6}
        rounded="xl"
        shadow="lg"
        w={{ base: "100%", sm: "90%", md: "400px" }}
        spacing={5}
      >
        <Heading size="md" textAlign="center" color="blue.700">
          Personal Details
        </Heading>

        <Image
          src="https://www.w3schools.com/w3images/avatar2.png"
          alt="Profile"
          boxSize="100px"
          borderRadius="full"
          objectFit="cover"
        />

        <Divider borderColor="blue.300" />

        <ProfileRow label="Name" value={userdata.name} />
        <ProfileRow label="Email" value={userdata.email} />
        <ProfileRow label="Phone" value={userdata.phone} />
        <ProfileRow
          label="Manager"
          value={
            userdata.manager || (
              <Text color="red.500" fontWeight="medium">
                No Manager Assigned
              </Text>
            )
          }
        />
        <ProfileRow label="Role" value={userdata.role} />

        <HStack spacing={3} pt={2}>
          {userdata.Staff && <Badge colorScheme="green">Staff</Badge>}
          {userdata.Admin && <Badge colorScheme="purple">Admin</Badge>}
        </HStack>
      </VStack>
    </Flex>
  ) : (
    <Flex justify="center" align="center" h="80vh" px={4}>
      <VStack spacing={4}>
        <Spinner size="lg" color="blue.500" />
        <Text>Loading...</Text>
        <Button as={Link} to="/Login" colorScheme="blue" size="sm">
          Sign In
        </Button>
      </VStack>
    </Flex>
  );
};

const ProfileRow = ({ label, value }) => (
  <HStack w="full" justifyContent="space-between" py={1}>
    <Text fontWeight="medium" color="gray.700">
      {label}:
    </Text>
    <Text color="gray.800">{value}</Text>
  </HStack>
);

export default Userprofile;
