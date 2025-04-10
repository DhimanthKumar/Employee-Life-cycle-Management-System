import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { AuthContext } from "./authcontext";
import Wrongdetail from "./errors/incorrectdetails";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [incorrectdetails, setIncorrectdetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/generateToken", {
        username,
        password,
      });

      login(response.data.token);
      navigate(-1);
      setIncorrectdetails(false);
    } catch (error) {
      console.error("Login failed", error);
      setIncorrectdetails(true);
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      py="100px"
      maxH="70vh"
      px={4}
      bg="white" // clean background
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
        maxW="360px"
        borderTop="4px solid"
        borderColor="blue.400"
      >
        <Heading size="lg" textAlign="center" mb={6} color="blue.600">
          Welcome Back
        </Heading>

        <form onSubmit={handleSubmit}>
          <Text fontSize="sm" mb={1} color="gray.600">
            Username
          </Text>
          <Input
            placeholder="Enter username"
            size="md"
            mb={4}
            borderRadius="md"
            focusBorderColor="blue.400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Text fontSize="sm" mb={1} color="gray.600">
            Password
          </Text>
          <Input
            placeholder="Enter password"
            type="password"
            size="md"
            mb={4}
            borderRadius="md"
            focusBorderColor="blue.400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {incorrectdetails && <Wrongdetail />}

          <Button
            mt={4}
            colorScheme="blue"
            type="submit"
            w="100%"
            size="md"
            borderRadius="md"
          >
            Login
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
