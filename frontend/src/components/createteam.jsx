import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authcontext";
const MotionBox = motion(Box);

const Createteam = () => {
  const [allusers, setAllusers] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { userdata, isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/employees/subordinates`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
      .then((res) => setAllusers(res.data.subordinates))
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const leaderOptions = allusers.map((user) => ({
    value: user.id,
    label: user.username,
    authority_level: user.authority_level,
  }));

  const memberOptions = useMemo(() => {
    if (!selectedLeader) return [];
    return allusers
      .filter((user) => user.authority_level < selectedLeader.authority_level)
      .map((user) => ({
        value: user.id,
        label: user.username,
      }));
  }, [selectedLeader, allusers]);

  const handleSubmit = () => {
    const teamData = {
      name: teamName,
      description: description,
      team_leader_id: selectedLeader ? selectedLeader.value : null,
      member_ids: selectedMembers.map((member) => member.value),
    };
  
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/teams/create`, teamData, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: "Success",
            description: "Team created successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("status", { state: { message: "Team created successfully" } });
        }
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to create team.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("status", { state: { message: "Team creation failed" } });
      });
  };

  return (
    <MotionBox
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bgGradient="linear(to-r, blue.50, blue.100)"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Heading size="lg" mb={6} textAlign="center" color="blue.600">
        Create Team
      </Heading>

      <FormControl mb={4}>
        <FormLabel color="blue.700">Team Name</FormLabel>
        <Input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          focusBorderColor="blue.400"
          bg="white"
          boxShadow="sm"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel color="blue.700">Description</FormLabel>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter team description"
          focusBorderColor="blue.400"
          bg="white"
          boxShadow="sm"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel color="blue.700">Team Leader</FormLabel>
        <Select
          options={leaderOptions}
          value={selectedLeader}
          onChange={(selected) => {
            setSelectedLeader(selected);
            setSelectedMembers([]); // Clear members if leader changes
          }}
          placeholder="Select team leader"
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "#3182CE",
              boxShadow: "0px 2px 4px rgba(49,130,206,0.2)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#3182CE" : "#fff",
              color: state.isSelected ? "#fff" : "#000",
            }),
          }}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel color="blue.700">Team Members</FormLabel>
        <Select
          options={memberOptions}
          isMulti
          value={selectedMembers}
          onChange={setSelectedMembers}
          placeholder="Select team members"
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "#3182CE",
              boxShadow: "0px 2px 4px rgba(49,130,206,0.2)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#3182CE" : "#fff",
              color: state.isSelected ? "#fff" : "#000",
            }),
          }}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        w="full"
        onClick={handleSubmit}
        _hover={{ transform: "scale(1.05)" }}
        transition="all 0.3s ease-in-out"
        boxShadow="md"
      >
        Create Team
      </Button>
    </MotionBox>
  );
};

export default Createteam;
