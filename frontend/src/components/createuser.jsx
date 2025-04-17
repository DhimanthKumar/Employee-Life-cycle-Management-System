import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authcontext";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Select as ChakraSelect,
  Text,
  useToast,
  Checkbox
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const MotionBox = motion(Box);

const Createuser = () => {
  const { isstaff, allowedroles, departments } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  // State declarations
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userstaff, setUserstaff] = useState(false);
  const [useradmin, setUseradmin] = useState(false);
  const [role, setRole] = useState("");
  const [dateofjoin, setDateofjoin] = useState("");
  const [department, setDepartment] = useState("");
  const [managerslist, setManagerslist] = useState([]);
  const [manager, setManager] = useState("");
  
  // Fetch managers list
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/get_managers`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
      .then((res) => setManagerslist(res.data.Managers))
      .catch((err) => console.error(err));
  }, []);

  // Filter managers based on role authority level
  const foundRole = allowedroles.find((item) => item.role_name === role);
  const filteredManagers = managerslist.filter((item) => {
    if (!item.role_name || !role) return false;
    return item.authority_level > foundRole.authority_level;
  });

  // Prepare manager options for Select dropdown
  const managerOptions = filteredManagers.map((item) => ({
    value: item.username,
    label: item.username,
  }));

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role || !department || !manager) {
      toast({
        title: "Validation Error",
        description: "Please select Role, Department, and Manager",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let payload = {
      "username": username,
      "email": email,
      "password": password,
      "role": role,
      "is_staff": userstaff,
      "is_superuser": useradmin,
      "date_of_joining": dateofjoin,
      "department": department,
      "manager": manager,
    };
    // console.log(payload);
    if (phone.length === 10) payload = { ...payload, phone };

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/create`, payload, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: "Success",
            description: "User created successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("status", { state: { message: "User created successfully" } });
        }
      })
      .catch((response) => {
        toast({
          title: "Error",
          description: "User creation failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        // console.log(response)
        navigate("status", { state: { message: "User creation failed" } });
      });
  };

  // If user is not staff
  if (!isstaff) {
    return (
      <VStack mt={20}>
        <Text fontSize="sm">You are not authorized to access this page.</Text>
        <Button as={Link} to="/Home" colorScheme="blue" size="sm">
          Go Home
        </Button>
      </VStack>
    );
  }

  return (
    <MotionBox
      mt={10}
      mx="auto"
      maxW="md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <VStack
          spacing={4}
          bgGradient="linear(to-r, blue.50, blue.100)"
          p={5}
          rounded="lg"
          shadow="xl"
          borderWidth="1px"
          borderColor="blue.100"
        >
          <Heading size="md" color="blue.800">
            Create New User
          </Heading>

          {/* Input Fields */}
          {[{ label: "Username", type: "text", value: username, setter: setUsername },
            { label: "Password", type: "password", value: password, setter: setPassword },
            { label: "Email", type: "email", value: email, setter: setEmail },
            { label: "Phone", type: "tel", value: phone, setter: setPhone }].map(({ label, type, value, setter }) => (
            <FormControl key={label}>
              <FormLabel fontSize="sm" color="blue.700">{label}</FormLabel>
              <Input
                type={type}
                size="sm"
                bg="white"
                value={value}
                focusBorderColor="blue.400"
                boxShadow="sm"
                minLength={type === "tel" ? 10 : undefined}
                maxLength={50}
                onChange={(e) => setter(e.target.value)}
              />
            </FormControl>
          ))}

          {/* Role Dropdown */}
          <FormControl>
            <FormLabel fontSize="sm" color="blue.700">Role</FormLabel>
            <ChakraSelect
              placeholder="Choose Role"
              size="sm"
              bg="white"
              focusBorderColor="blue.400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {allowedroles.map((item) => (
                <option key={item.id} value={item.role_name}>
                  {item.role_name}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>

          {/* Department Dropdown */}
          <FormControl>
            <FormLabel fontSize="sm" color="blue.700">Department</FormLabel>
            <ChakraSelect
              placeholder="Choose Department"
              size="sm"
              bg="white"
              focusBorderColor="blue.400"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </ChakraSelect>
          </FormControl>

          {/* Manager Dropdown */}
          <FormControl>
            <FormLabel fontSize="sm" color="blue.700">Manager</FormLabel>
            <Select
              options={managerOptions}
              placeholder="Choose Manager"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '32px',
                  fontSize: 'small',
                  borderColor: '#3182ce',
                  boxShadow: '0px 2px rgba(49,130,206,.2)',
                  '&:hover': { borderColor: '#2b6cb0' },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor:
                    state.isSelected ? '#3182ce' : '#fff',
                  color:
                    state.isSelected ? '#fff' : '#000',
                }),
              }}
              value={manager ? { value: manager, label: manager } : null}
              onChange={(e) => setManager(e ? e.value : "")}
            />
          </FormControl>
          <Flex justify="space-between" w="100%" px={2}>
  <Checkbox
    isChecked={userstaff}
    onChange={(e) => {
      const checked = e.target.checked;
      setUserstaff(checked);
      if (!checked) {
        setUseradmin(false); // If staff is unchecked, admin must be unchecked too
      }
    }}
    colorScheme="blue"
    size="md"
    bg="white"
    border="1px solid #CBD5E0"
    borderRadius="md"
    _checked={{ bg: "white", color: "blue.500" }}
    iconColor="blue.500"
  >
    Staff
  </Checkbox>

  <Checkbox
    isChecked={useradmin}
    onChange={(e) => {
      const checked = e.target.checked;
      setUseradmin(checked);
      if (checked) {
        setUserstaff(true); // If admin is checked, staff must be checked too
      }
    }}
    colorScheme="blue"
    size="md"
    bg="white"
    border="1px solid #CBD5E0"
    borderRadius="md"
    _checked={{ bg: "white", color: "blue.500" }}
    iconColor="blue.500"
  >
    Admin
  </Checkbox>
</Flex>
          {/* Submit Button */}
          <Button type="submit" colorScheme="blue" size="lg" width="full">
            Create User
          </Button>
        </VStack>
      </form>
    </MotionBox>
  );
};

export default Createuser;
