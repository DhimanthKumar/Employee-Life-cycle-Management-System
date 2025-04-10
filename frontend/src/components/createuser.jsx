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
  Checkbox,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const Createuser = () => {
  const { isstaff, isadmin, allowedroles, departments } = useContext(AuthContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/get_managers", {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    })
    .then((res) => setManagerslist(res.data.Managers));
  }, []);

  const foundRole = allowedroles.find((item) => item.role_name === role);

  const filteredManagers = managerslist.filter(
    (item) => item.role_name && role && item.authority_level > foundRole?.authority_level
  );

  const managerOptions = filteredManagers.map((item) => ({
    value: item.user.username,
    label: item.user.username,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role || !department || !manager) {
      window.alert("Please select Role, Department and Manager");
      return;
    }

    let payload = {
      username,
      email,
      password,
      role,
      is_staff: userstaff,
      is_superuser: useradmin,
      date_of_joining: dateofjoin,
      department,
      manager,
    };

    if (phone.length === 10) payload = { ...payload, phone };

    axios.post("http://127.0.0.1:8000/api/create", payload, {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (res.status === 201) {
        navigate("status", { state: { message: "User created successfully" } });
      }
    })
    .catch(() => {
      navigate("status", { state: { message: "User creation failed" } });
    });
  };

  if (!isstaff) {
    return (
      <VStack mt={20}>
        <Text fontSize="sm">You are not Authorised to use</Text>
        <Button as={Link} to="/Home" colorScheme="blue" size="sm">
          Go Home
        </Button>
      </VStack>
    );
  }

  return (
    <Box mt={10} mx="auto" maxW="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} bg="blue.100" p={5} rounded="lg" shadow="md">
          <Heading size="sm">Enter New User Details</Heading>

          {[
            { label: "Username", type: "text", value: username, setter: setUsername },
            { label: "Password", type: "password", value: password, setter: setPassword },
            { label: "Email", type: "email", value: email, setter: setEmail },
            { label: "Phone", type: "tel", value: phone, setter: setPhone },
          ].map(({ label, type, value, setter }) => (
            <FormControl key={label}>
              <FormLabel fontSize="sm">{label}</FormLabel>
              <Input
                type={type}
                size="sm"
                bg="white"
                value={value}
                minLength={type === "tel" ? 10 : 8}
                maxLength={50}
                onChange={(e) => setter(e.target.value)}
              />
            </FormControl>
          ))}

          <FormControl>
            <FormLabel fontSize="sm">Role</FormLabel>
            <ChakraSelect
              placeholder="Choose Role"
              size="sm"
              bg="white"
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

          <FormControl>
            <FormLabel fontSize="sm">Department</FormLabel>
            <ChakraSelect
              placeholder="Choose Department"
              size="sm"
              bg="white"
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

          <FormControl>
            <FormLabel fontSize="sm">Manager</FormLabel>
            <Select
              options={managerOptions}
              placeholder="Choose Manager"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '32px',
                  fontSize: 'small',
                }),
              }}
              value={managerOptions.find((opt) => opt.value === manager)}
              onChange={(selected) => setManager(selected.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm">Date of Joining</FormLabel>
            <Input
              type="date"
              size="sm"
              bg="white"
              value={dateofjoin}
              onChange={(e) => setDateofjoin(e.target.value)}
            />
          </FormControl>

          {isadmin && (
            <Flex gap={4}>
              <Checkbox
                size="sm"
                isChecked={userstaff}
                onChange={(e) => {
                  setUserstaff(e.target.checked);
                  if (!e.target.checked) setUseradmin(false);
                }}
                sx={{
                  ".chakra-checkbox__control": {
                    bg: "white",
                    borderColor: "transparent",
                    _checked: { borderColor: "blue.500" },
                  },
                }}
              >
                Staff
              </Checkbox>

              <Checkbox
                size="sm"
                isChecked={useradmin}
                onChange={(e) => {
                  if (!userstaff) {
                    setUseradmin(e.target.checked);
                    setUserstaff(e.target.checked);
                  } else {
                    setUseradmin(e.target.checked);
                  }
                }}
                sx={{
                  ".chakra-checkbox__control": {
                    bg: "white",
                    borderColor: "transparent",
                    _checked: { borderColor: "blue.500" },
                  },
                }}
              >
                Admin
              </Checkbox>
            </Flex>
          )}

          <Button type="submit" size="sm" colorScheme="blue">
            Create User
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Createuser;
