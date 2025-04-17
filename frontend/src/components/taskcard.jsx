// TaskCard.js
import React from 'react';
import { Box, Text, Flex, Badge, Progress, IconButton, Tooltip, HStack, Tag, TagLabel, Collapse } from '@chakra-ui/react';
import { CalendarIcon, EditIcon, LockIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useColorModeValue } from '@chakra-ui/react';

const TaskCard = ({ task, expandedTask, handleToggle, handleEdit }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.600', 'gray.400');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'green.100', text: 'green.800', border: 'green.500' };
      case 'in_progress':
        return { bg: 'blue.100', text: 'blue.800', border: 'blue.500' };
      case 'not_started':
        return { bg: 'gray.100', text: 'gray.800', border: 'gray.500' };
      case 'blocked':
        return { bg: 'red.100', text: 'red.800', border: 'red.500' };
      default:
        return { bg: 'purple.100', text: 'purple.800', border: 'purple.500' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return { bg: 'red.500', text: 'white' };
      case 'high':
        return { bg: 'orange.500', text: 'white' };
      case 'medium':
        return { bg: 'yellow.500', text: 'gray.800' };
      case 'low':
        return { bg: 'green.500', text: 'white' };
      default:
        return { bg: 'gray.500', text: 'white' };
    }
  };

  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 },
  };

  const formattedDate = (task) => {
    return task.assigned_at
      ? new Date(task.assigned_at).toLocaleDateString()
      : 'Unassigned';
  };

  const statusColors = getStatusColor(task.status);
  const priorityColors = getPriorityColor(task.priority);
  const isBlocked = task.status === 'blocked';

  return (
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
      <Box
        p={6}
        borderRadius="xl"
        bg={cardBg}
        borderLeft="6px solid"
        borderColor={statusColors.border}
        boxShadow="lg"
        _hover={{ boxShadow: '2xl', transform: 'translateY(-4px)' }}
        transition="all 0.3s ease"
        cursor="pointer"
        onClick={() => handleToggle(task.id)}
        position="relative"
      >
        {isBlocked && (
          <Box position="absolute" top={10} right={20}>
            <Tooltip label="This task is blocked">
              <LockIcon color="red.500" boxSize={4} />
            </Tooltip>
          </Box>
        )}

        <Flex justify="space-between" align="center" flexWrap="wrap">
          <Flex align="center" flex={1} minW={0} mb={4}>
            <Box
              mr={4}
              px={3}
              py={1}
              borderRadius="md"
              bg="blue.50"
              color="blue.600"
              fontSize="sm"
              fontWeight="medium"
            >
              {task.team_name || 'No Team'}
            </Box>
            <Box minW={0}>
              <Flex align="center" mb={2}>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color={textColor}
                  noOfLines={1}
                  mr={2}
                >
                  {task.title}
                </Text>
                <Badge
                  px={2}
                  py={1}
                  bg={statusColors.bg}
                  color={statusColors.text}
                  borderRadius="full"
                  textTransform="capitalize"
                  fontSize="xs"
                  fontWeight="medium"
                >
                  {task.status.replace('_', ' ')}
                </Badge>
              </Flex>
              <HStack spacing={4}>
                <Text fontSize="sm" color="gray.500">priority:</Text>
                <Tag
                  size="sm"
                  variant="subtle"
                  bg={priorityColors.bg}
                  color={priorityColors.text}
                  borderRadius="full"
                >
                  <TagLabel>{task.priority || 'unknown'}</TagLabel>
                </Tag>
                <Flex align="center" color={secondaryText}>
                  <CalendarIcon boxSize={4} />
                  <Text fontSize="sm">{task.due_date
                    ? new Date(task.due_date).toLocaleDateString('en-GB') // Using 'en-GB' for dd-mm-yyyy format
                    : 'No due date'}</Text>
                </Flex>
              </HStack>
            </Box>
          </Flex>

          <Flex align="center" flexDirection="column" width="120px">
            <Progress
              value={(task.progress || 0) * 100}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              mb={4}
            />
            {!isBlocked && (
              <Tooltip label="Edit Task">
                <IconButton
                  icon={<EditIcon />}
                  onClick={(e) => handleEdit(task, e)}
                  isDisabled={isBlocked}
                  variant="ghost"
                  colorScheme="teal"
                  size="lg"
                />
              </Tooltip>
            )}
          </Flex>
        </Flex>

        <Collapse in={expandedTask === task.id}>
          <Box pt={4} pb={2}>
            <Text color={textColor} fontSize="sm" mb={2}>
              Description :  {task.description || 'No description available.'}
            </Text>
            <Flex justify="space-between" align="center">
              <Text color={secondaryText} fontSize="sm">
                Deadline : {task.due_date
                  ? new Date(task.due_date).toLocaleDateString('en-GB') // Using 'en-GB' for dd-mm-yyyy format
                  : 'No due date'}
              </Text>
              <Text color={secondaryText} fontSize="sm">
                Assigned on : {formattedDate(task)}
              </Text>
            </Flex>
          </Box>
        </Collapse>
      </Box>
    </motion.div>
  );
};

export default TaskCard;
