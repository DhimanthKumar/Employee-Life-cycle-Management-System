import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Select,
  Progress,
  Box,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";

const MotionModalContent = motion(ModalContent);

const TaskEditingModal = ({ isOpen, onClose, task, onSave }) => {
  const [status, setStatus] = useState("not_started");
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && task) {
      setStatus(task.status || "not_started");
      setProgress(task.progress || 0);
    }
  }, [isOpen, task]);

  // Automatically update progress when status is set to "not_started"
  useEffect(() => {
    if (status === "not_started") {
      setProgress(0);
    } else if (status === "completed") {
      setProgress(100); // If status is completed, set progress to 100
    }
  }, [status]);

  // Change status when progress changes (but don't change status when progress is set to 0)
  useEffect(() => {
    if (progress === 100) {
      setStatus("completed");
    } else if (progress > 0 && status === "not_started") {
      setStatus("in_progress");
    }
  }, [progress]);

  const handleUpdate = async () => {
    if (!task) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${task.id}/update`,
        {
          status,
          progress,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        onSave({ ...task, status, progress });
        toast({
          title: "Task Updated",
          description: "The task has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
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

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <MotionModalContent
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        borderRadius="xl"
        boxShadow="xl"
      >
        <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
          Edit Task
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={5} align="stretch">
            {/* Task Name */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                Task Name
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                {task.title}
              </Text>
            </Box>

            {/* Status Selector */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                Status
              </Text>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                rounded="md"
                focusBorderColor="blue.400"
                bg="white"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </Box>

            {/* Progress Bar */}
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.500">
                  Progress
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {progress}%
                </Text>
              </HStack>
              <Progress
                value={progress}
                size="lg"
                rounded="md"
                colorScheme={progress === 100 ? "green" : "blue"}
              />
              {status !== "completed" && (
                <HStack mt={3} spacing={2} justify="center">
                  {[0, 25, 50, 75, 100].map((val) => (
                    <Button
                      key={val}
                      size="sm"
                      variant={progress === val ? "solid" : "outline"}
                      colorScheme="blue"
                      onClick={() => setProgress(val)}
                    >
                      {val}%
                    </Button>
                  ))}
                </HStack>
              )}
            </Box>
          </VStack>
        </ModalBody>

        {/* Footer Buttons */}
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleUpdate}>
            Save Changes
          </Button>
        </ModalFooter>
      </MotionModalContent>
    </Modal>
  );
};

export default TaskEditingModal;
