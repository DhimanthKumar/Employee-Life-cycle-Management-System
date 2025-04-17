import { useContext, useEffect } from "react";
import { AuthContext } from "./authcontext";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Badge,
  Button,
  Spinner,
  Divider,
  Flex,
  useColorModeValue,
  Icon
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserShield, FaUserTie, FaPhone, FaEnvelope, FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionFlex = motion(Flex);

const Userprofile = () => {
  const { userdata, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  // console.log(userdata)
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/Login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated && userdata ? (
    <MotionFlex
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      justify="center"
      align="center"
      minH="100vh"
      p={4}
    >
      <VStack
        bg={cardBg}
        p={8}
        rounded="2xl"
        shadow="xl"
        spacing={6}
        w="100%"
        maxW="500px"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
      >
        <Heading
          size="lg"
          textAlign="center"
          color={accentColor}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Icon as={FaUserShield} boxSize={6} />
          User Profile
        </Heading>

        <Avatar
          src="https://www.w3schools.com/w3images/avatar2.png"
          size="2xl"
          border={`4px solid ${accentColor}`}
          shadow="md"
          _hover={{ transform: "scale(1.05)" }}
          transition="all 0.3s ease"
        />

        <VStack w="100%" spacing={4} divider={<Divider borderColor="gray.200" />}>
          <ProfileRow
            icon={FaUserTie}
            label="Full Name"
            value={userdata.name}
            color={accentColor}
          />
          <ProfileRow
            icon={FaEnvelope}
            label="Email"
            value={userdata.email}
            color={accentColor}
          />
          <ProfileRow
            icon={FaPhone}
            label="Phone"
            value={userdata.phone || "Not provided"}
            color={accentColor}
          />
          <ProfileRow
            icon={FaUserShield}
            label="Manager"
            value={userdata.manager || <Badge colorScheme="red">Unassigned</Badge>}
            color={accentColor}
          />
        </VStack>

        <HStack spacing={3} w="100%" justify="center">
          {userdata.Staff && (
            <Badge
              colorScheme="green"
              px={3}
              py={1}
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FaUserTie} />
              Staff Member
            </Badge>
          )}
          {userdata.Admin && (
            <Badge
              colorScheme="purple"
              px={3}
              py={1}
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon as={FaCrown} />
              Administrator
            </Badge>
          )}
        </HStack>
      </VStack>
    </MotionFlex>
  ) : (
    <Flex justify="center" align="center" minH="100vh" p={4}>
      <VStack spacing={6}>
        <Spinner
          size="xl"
          thickness="3px"
          speed="0.65s"
          color={accentColor}
          emptyColor="gray.200"
        />
        <Button
          as={Link}
          to="/Login"
          colorScheme="teal"
          size="lg"
          leftIcon={<FaUserShield />}
          shadow="md"
          _hover={{ transform: "translateY(-2px)" }}
          transition="all 0.3s ease"
        >
          Sign In to View Profile
        </Button>
      </VStack>
    </Flex>
  );
};

const ProfileRow = ({ icon, label, value, color }) => (
  <Flex w="100%" align="center" justify="space-between" p={2}>
    <HStack spacing={3}>
      <Icon as={icon} boxSize={5} color={color} />
      <Text fontSize="lg" fontWeight="600" color="gray.600">
        {label}
      </Text>
    </HStack>
    <Text fontSize="lg" color="gray.800" fontWeight="500">
      {value}
    </Text>
  </Flex>
);

export default Userprofile;
