import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { AuthContext } from "./authcontext";
import Wrongdetail from "./errors/incorrectdetails";
import { Copy } from 'lucide-react';
import { Tooltip, IconButton } from "@chakra-ui/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [incorrectdetails, setIncorrectdetails] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(import.meta.env.VITE_API_BASE_URL)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/generateToken`, {
        username,
        password,
      });
      // console.log(response.data);
      login(response.data.token);
      navigate('/home');
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
          <Box mt={6} p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
  <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
    Guest User Credentials
  </Text>

  {/* Username */}
  <Flex align="center" justify="space-between" mb={2}>
    <Text fontSize="sm" color="gray.600">Username:</Text>
    <Flex align="center" gap={2}>
      <Text fontSize="sm" color="blue.600">guest24</Text>
      <Tooltip label="Copy Username" fontSize="xs">
        <IconButton
          size="xs"
          icon={<Copy size={14} />}
          aria-label="Copy username"
          onClick={() => navigator.clipboard.writeText('guest')}
          variant="ghost"
        />
      </Tooltip>
    </Flex>
  </Flex>

  {/* Password */}
  <Flex align="center" justify="space-between">
    <Text fontSize="sm" color="gray.600">Password:</Text>
    <Flex align="center" gap={2}>
      <Text fontSize="sm" color="blue.600">trythis@123</Text>
      <Tooltip label="Copy Password" fontSize="xs">
        <IconButton
          size="xs"
          icon={<Copy size={14} />}
          aria-label="Copy password"
          onClick={() => navigator.clipboard.writeText('guest123')}
          variant="ghost"
        />
      </Tooltip>
    </Flex>
  </Flex>
  <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
    ⚠️ The server may take up to 50 seconds to start after the first request.
  </Text>
</Box>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;