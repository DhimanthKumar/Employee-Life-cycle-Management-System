import { Box, Heading, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

const Createteam = () => {
  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading size="md" mb={6} textAlign="center">Create Team</Heading>
      
      <FormControl mb={4}>
        <FormLabel>Team Name</FormLabel>
        <Input placeholder="Enter team name" />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Description</FormLabel>
        <Input placeholder="Enter team description" />
      </FormControl>

      <Button colorScheme="blue" w="full">Create</Button>
    </Box>
  );
};

export default Createteam;
