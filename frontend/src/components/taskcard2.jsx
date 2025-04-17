import {
    Box,
    Text,
    Button,
    Badge,
    Flex,
    HStack,
    Progress,
    useToast,
    Tooltip,
  } from "@chakra-ui/react";
  
  const TaskCard = ({ task, onEdit, onToggleStatus }) => {
    const toast = useToast();
  
    const handleStatusToggle = () => {
      let newStatus, newProgress;
      
      if (task.status === "not_started") {
        newStatus = "in_progress";
        newProgress = 50;
      } else if (task.status === "in_progress") {
        newStatus = "completed";
        newProgress = 100;
      } else {
        newStatus = "not_started";
        newProgress = 0;
      }
  
      onToggleStatus(newStatus, newProgress);
    };
  
    const getPriorityColor = () => {
      switch (task.priority) {
        case "low": return "green";
        case "medium": return "blue";
        case "high": return "orange";
        case "urgent": return "red";
        default: return "gray";
      }
    };
  
    const getStatusColor = () => {
      switch (task.status) {
        case "completed": return "green";
        case "in_progress": return "blue";
        default: return "gray";
      }
    };
  
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
        <Flex direction="column" gap={3}>
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" fontSize="lg">{task.title}</Text>
            <HStack>
              <Badge colorScheme={getPriorityColor()}>
                {task.priority}
              </Badge>
              <Badge colorScheme={getStatusColor()}>
                {task.status.replace("_", " ")}
              </Badge>
            </HStack>
          </Flex>
  
          {task.description && (
            <Text fontSize="sm" color="gray.600">
              {task.description}
            </Text>
          )}
  
          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm">Progress</Text>
              <Text fontSize="sm" fontWeight="medium">{task.progress}%</Text>
            </Flex>
            <Progress
              value={task.progress}
              size="sm"
              colorScheme={
                task.progress === 100 ? "green" : 
                task.progress >= 75 ? "blue" : 
                task.progress >= 50 ? "orange" : "gray"
              }
              borderRadius="full"
            />
          </Box>
  
          <Flex justify="space-between" mt={2}>
            <Text fontSize="sm">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </Text>
            <HStack spacing={2}>
              <Tooltip label="Quick status update">
                <Button
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  onClick={handleStatusToggle}
                >
                  {task.status === "not_started" ? "Start" : 
                   task.status === "in_progress" ? "Complete" : "Reset"}
                </Button>
              </Tooltip>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={onEdit}
              >
                Edit
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Box>
    );
  };
  
  export default TaskCard;