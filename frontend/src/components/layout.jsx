import { Outlet, Link } from 'react-router-dom';
import { Box, Avatar, Button, Flex, Spacer, Image } from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from './authcontext';

const Layout = () => {
  const { isAuthenticated, logout, isstaff } = useContext(AuthContext);

  return (
    <>
      <Flex
        p="12px 24px"
        borderBottom="1px solid"
        borderColor="gray.200"
        align="center"
        bg="white"
        boxShadow="sm"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Flex align="center" gap={3}>
          <Link to="/Home">
            <Image
              src="https://img.icons8.com/fluency/48/business.png"  // free to use logo
              alt="Logo"
              boxSize="32px"
              cursor="pointer"
            />
          </Link>

          <Button
            as={Link}
            to="/Home"
            colorScheme="blue"
            variant="ghost"
            size="sm"
            _hover={{ bg: 'blue.50' }}
          >
            Home
          </Button>

          {isstaff && (
            <Button
              as={Link}
              to="/Createuser"
              colorScheme="blue"
              variant="ghost"
              size="sm"
              _hover={{ bg: 'blue.50' }}
            >
              Create User
            </Button>
          )}
        </Flex>

        <Spacer />

        <Flex align="center" gap={3}>
          {isAuthenticated ? (
            <Button
              onClick={logout}
              colorScheme="red"
              variant="solid"
              size="sm"
            >
              Logout
            </Button>
          ) : (
            <Button
              as={Link}
              to="/login"
              colorScheme="blue"
              variant="solid"
              size="sm"
            >
              Login
            </Button>
          )}

          {isAuthenticated && (
            <Link to="/profile">
              <Avatar
                src="https://www.w3schools.com/w3images/avatar3.png"
                boxSize="32px"
                _hover={{ boxShadow: 'md' }}
              />
            </Link>
          )}
        </Flex>
      </Flex>

      <Box px={4} py={6}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
