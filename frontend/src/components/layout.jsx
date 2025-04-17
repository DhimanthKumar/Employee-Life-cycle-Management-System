import { Outlet, Link } from 'react-router-dom';
import { Box, Avatar, Button, Flex, Spacer, Image, Icon } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AuthContext } from './authcontext';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import Manageteams from "./manageteams";

const Layout = () => {
  const { isAuthenticated, logout, isstaff ,isteamleader} = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
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
          {isstaff && (
            <Button
              as={Link}
              to="/Createteam"
              colorScheme="blue"
              variant="ghost"
              size="sm"
              _hover={{ bg: 'blue.50' }}
            >
              Create Team
            </Button>
          )}
          {isteamleader &&
        <Button
              as={Link}
              to="/Teams"
              colorScheme="blue"
              variant="ghost"
              size="sm"
              _hover={{ bg: 'blue.50' }}
            >
              Manage Teams
            </Button>}
        </Flex>

        <Spacer />

        <Flex align="center" gap={3}>
          {isAuthenticated ? (
            <Menu
              isOpen={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}>
              <MenuButton display="flex" alignItems="center">
                <Avatar
                  src="https://www.w3schools.com/w3images/avatar3.png"
                  boxSize="32px"
                  _hover={{ boxShadow: 'md' }}
                />
                <Icon
                  as={ChevronDownIcon}
                  boxSize={5}
                  transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                  transition="transform 0.3s ease"
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile "
                  _hover={{ bg: "gray.100" }}
                  _focus={{ bg: "gray.100" }}
                >Profile</MenuItem> {/* Wrap MenuItem with Link */}
                <MenuItem onClick={logout}
                  _hover={{ bg: "gray.100" }}
                  _focus={{ bg: "gray.100" }}
                >Logout</MenuItem>
              </MenuList>
            </Menu>
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


        </Flex>
      </Flex>

      <Box px={4} py={6}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
