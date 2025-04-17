import { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Stack,
  Button,
  Select,
  Collapse,
  useColorModeValue,
  useToast,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Checkbox,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import { AuthContext } from "./authcontext";
import TaskCard from "./taskcard";
import TaskEditingModal from "./taskeditingmodal";

const Manageteams = () => {
  const { isteamleader, teamsleading, teammemberinfo, userdata } = useContext(AuthContext);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [expandedMemberId, setExpandedMemberId] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.50");
  const [editingTask, setEditingTask] = useState(null);
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();

  // Fetch team data whenever selectedTeam changes
  useEffect(() => {
    if (selectedTeam) {
      fetchTeamData(selectedTeam);
    } else {
      // Reset team data when no team is selected
      setTeamData(null);
      setExpandedMemberId(null);
    }
  }, [selectedTeam]);

  const fetchTeamData = async (teamId) => {
    setIsLoadingTeam(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/team/${teamId}/tasks`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setTeamData(response.data);
      setExpandedMemberId(null); // Reset expanded member when team changes
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team tasks",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setTeamData(null);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const handleTeamSelect = (event) => {
    const teamId = event.target.value;
    setSelectedTeam(teamId);
  };

  const toggleMemberTasks = (memberId) => {
    setExpandedMemberId((prev) => (prev === memberId ? null : memberId));
  };

  const handleTaskCreate = async () => {
    if (!selectedTeam) {
      toast({
        title: "Error",
        description: "Please select a team first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (assignedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please assign the task to at least one user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsCreatingTasks(true);

    try {
      const creationPromises = assignedUsers.map(userId =>
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/create_task`, {
          title: taskTitle,
          description: taskDescription,
          due_date: dueDate,
          priority: priority,
          assigned_to: userId,
          team: Number(selectedTeam),
        }, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
      );

      await Promise.all(creationPromises);

      toast({
        title: "Tasks Created",
        description: `Successfully created tasks for ${assignedUsers.length} user(s)`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setDueDate("");
      setPriority("medium");
      setAssignedUsers([]);
      onCreateModalClose();

      // Refresh team data
      fetchTeamData(selectedTeam);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create some tasks",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreatingTasks(false);
    }
  };

  const toggleUserAssignment = (userId) => {
    setAssignedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleTaskUpdate = (updatedTask) => {
    setTeamData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
  };

  const handleToggleTaskStatus = async (taskId, newStatus, newProgress) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}/update`,
        {
          status: newStatus,
          progress: newProgress,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setTeamData(prev => ({
          ...prev,
          tasks: prev.tasks.map(task => 
            task.id === taskId ? { ...task, status: newStatus, progress: newProgress } : task
          )
        }));

        toast({
          title: "Task Updated",
          description: "Task status changed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update task",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    onEditModalOpen();
  };

  const renderTeamMembers = () => {
    if (!selectedTeam || !teamData) {
      return isLoadingTeam ? (
        <Flex justify="center" py={8}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Text>Select a team to view members.</Text>
      );
    }

    const teamInfo = teammemberinfo[selectedTeam];
    if (!teamInfo) return <Text>No member information available for this team.</Text>;

    const allMembers = [
      {
        id: userdata.id,
        username: userdata.username,
        email: userdata.email,
        role: "Team Leader",
        isLeader: true
      },
      ...(teamInfo.members || []).map(member => ({
        ...member,
        role: "Member",
        isLeader: false
      }))
    ];

    return allMembers.map((member) => {
      const memberTasks = teamData.tasks.filter(task =>
        task.assigned_to && task.assigned_to.id === member.id
      );

      return (
        <Box
          key={member.id}
          mb={4}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="md"
          bg={cardBg}
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Flex align="center">
                <Text fontSize="xl" fontWeight="bold" color="teal.500" mr={2}>
                  {member.username}
                </Text>
                <Badge
                  colorScheme={member.isLeader ? "purple" : "teal"}
                  variant="subtle"
                >
                  {member.role}
                </Badge>
              </Flex>
              <Stack spacing={1} mt={1}>
                <Text fontSize="sm">Email: {member.email}</Text>
                <Text fontSize="sm">Team: {teamData.team_name}</Text>
              </Stack>
            </Box>
            <Button
              size="sm"
              colorScheme="teal"
              variant="outline"
              onClick={() => toggleMemberTasks(member.id)}
              isDisabled={memberTasks.length === 0}
            >
              {expandedMemberId === member.id ? "Hide Tasks" : "View Tasks"}
            </Button>
          </Flex>

          <Collapse in={expandedMemberId === member.id} animateOpacity>
            <Box mt={3}>
              {memberTasks.length > 0 ? (
                memberTasks.map((task) => (
                  <Box key={task.id} w="90%" mx="auto" mb={4}>
                    <TaskCard 
                      task={task} 
                      onEdit={() => handleEditTask(task)}
                      onToggleStatus={(newStatus, newProgress) => 
                        handleToggleTaskStatus(task.id, newStatus, newProgress)
                      }
                    />
                  </Box>
                ))
              ) : (
                <Text fontStyle="italic" p={3}>No tasks assigned</Text>
              )}
            </Box>
          </Collapse>
        </Box>
      );
    });
  };

  return isteamleader ? (
    <Box p={6} bg="gray.50" borderRadius="lg" boxShadow="lg">
      <Text fontSize="2xl" fontWeight="bold" mb={4} color="teal.600">
        Manage Teams
      </Text>

      <Select
        placeholder="Select a team"
        onChange={handleTeamSelect}
        mb={6}
        borderColor="teal.300"
        focusBorderColor="teal.500"
        size="lg"
        value={selectedTeam || ""}
        isLoading={isLoadingTeam}
      >
        {teamsleading.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </Select>

      <Button
        colorScheme="teal"
        size="md"
        mb={4}
        onClick={onCreateModalOpen}
        isDisabled={!selectedTeam || isLoadingTeam}
      >
        Create New Task
      </Button>

      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Task Title</FormLabel>
              <Input
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                isRequired
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Enter task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                isRequired
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Priority</FormLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Assign To (Multiple Selection)</FormLabel>
              <Box maxH="200px" overflowY="auto">
                {teammemberinfo[selectedTeam]?.members.map((member) => (
                  <Checkbox
                    key={member.id}
                    isChecked={assignedUsers.includes(member.id)}
                    onChange={() => toggleUserAssignment(member.id)}
                    mr={3}
                    mb={2}
                    display="block"
                  >
                    {member.username}
                  </Checkbox>
                ))}
                <Checkbox
                  isChecked={assignedUsers.includes(userdata.id)}
                  onChange={() => toggleUserAssignment(userdata.id)}
                  mr={3}
                  mb={2}
                  display="block"
                >
                  {userdata.username} (You)
                </Checkbox>
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCreateModalClose}>Cancel</Button>
            <Button
              colorScheme="teal"
              onClick={handleTaskCreate}
              isLoading={isCreatingTasks}
              isDisabled={assignedUsers.length === 0}
            >
              Create {assignedUsers.length > 1 ? `${assignedUsers.length} Tasks` : 'Task'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {renderTeamMembers()}

      <TaskEditingModal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        task={editingTask}
        onSave={handleTaskUpdate}
      />
    </Box>
  ) : (
    <Text fontSize="xl" color="red.500" textAlign="center">
      You must be a team leader to access this page.
    </Text>
  );
};

export default Manageteams;