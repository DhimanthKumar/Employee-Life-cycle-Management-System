import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Text,
  Flex,
  Badge,
  Progress,
  Spinner,
  VStack,
  Heading,
  Collapse,
  useToast,
  IconButton,
  useColorModeValue,
  Avatar,
  Tag,
  TagLabel,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditIcon, CalendarIcon, LockIcon } from '@chakra-ui/icons';
import TaskEditingModal from './taskeditingmodal';
import TaskCard from './taskcard';
const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  const fetchTasks = () => {
    const token = localStorage.getItem('token');
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/my-team-tasks`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        setTasks(response.data.Tasks || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const normalizePriority = (priority) => {
    if (!priority) return 'unknown';
    return priority.toString().trim().toLowerCase();
  };

  const priorityOrder = {
    urgent: 4, high: 3, medium: 2, low: 1, unknown: 0,
  };

  const parseDate = (dateStr) => {
    try {
      return new Date(dateStr).getTime(); 
    } catch {
      return Number.MIN_SAFE_INTEGER; 
    }
  };

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (a.status === 'blocked' && b.status !== 'blocked') return 1;
      if (b.status === 'blocked' && a.status !== 'blocked') return -1;
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (b.status === 'completed' && a.status !== 'completed') return -1;

      const priorityA = priorityOrder[normalizePriority(a.priority)] || 0;
      const priorityB = priorityOrder[normalizePriority(b.priority)] || 0;
      if (priorityA !== priorityB) return priorityB - priorityA;

      const dateA = parseDate(a.assigned_at);
      const dateB = parseDate(b.assigned_at);
      return dateA - dateB;
    });
  };

  const handleToggle = (taskId) => {
    setExpandedTask((prev) => (prev === taskId ? null : taskId));
  };

  const handleEdit = (task, e) => {
    e.stopPropagation();
    if (task.status === 'blocked') {
      toast({
        title: 'Task is blocked',
        description: 'Cannot edit a blocked task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSave = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const sortedTasks = sortTasks(tasks);

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.600', 'gray.400');

  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 },
  };

  return (
    <Box w="100%" maxW="1200px" p={{ base: 6, md: 10 }} mx="auto">
      <Heading
        size="xl"
        mb={8}
        textAlign="center"
        bgGradient="linear(to-r, blue.500, teal.400)"
        bgClip="text"
        fontWeight="extrabold"
      >
        ✨ My Task Dashboard
      </Heading>

      {loading ? (
        <Flex align="center" justify="center" h="300px">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            color="blue.500"
            emptyColor="gray.200"
          />
        </Flex>
      ) : tasks.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="xl" color={secondaryText} mb={4}>
            🎉 No tasks assigned!
          </Text>
          <Text color={secondaryText}>Enjoy your free time or create new tasks</Text>
        </Box>
      ) : (
        <VStack spacing={8} align="stretch">
          <AnimatePresence>
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={taskVariants}
                transition={{ duration: 0.3 }}
                whileHover="hover"
                layout
              >
                <TaskCard
                  task={task}
                  handleToggle={handleToggle}
                  handleEdit={handleEdit}
                  expandedTask={expandedTask}
                  textColor={textColor}
                  secondaryText={secondaryText}
                  cardBg={cardBg}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </VStack>
      )}
      <TaskEditingModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
};

export default ViewTasks;
