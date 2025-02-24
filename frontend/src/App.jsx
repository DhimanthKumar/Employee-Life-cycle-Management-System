import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, HStack, Flex } from '@chakra-ui/react'
import { Route, Router, Link, Routes } from 'react-router-dom'
import Test from './components/test'
import Login from './components/Login'
import { useContext } from 'react'
import AuthContext from './components/authcontext'
import { Avatar } from '@chakra-ui/react'
import Userprofile from './components/userprofile'
function App() {
  const { isAuthenticated, logout, userdata, profile } = useContext(AuthContext);
  // console.log(userdata,profile);
  console.log(userdata);
  return (

    <div >
      <div style={{ padding: "10px 20px", display: "flex", borderBottom: "1px solid gray" }}>
        <Box className='rounded-md  hover:bg-gray-400 p-2 bg-blue-100'>
          <Link to={'/Home'}>Home</Link></Box>
        <Box className='ml-auto mr-5 rounded-md  hover:bg-gray-400 p-2 bg-blue-100 ' >
          {isAuthenticated ? (
            <button onClick={logout}>Logout</button> // ✅ Show logout when logged in
          ) : (
            <Link to="/login">Login</Link> // ✅ Show login when logged out
          )}
        </Box>
        <Box className='pt-1'>
          <Link to="/profile"><Avatar src='https://www.w3schools.com/w3images/avatar3.png' width={30}></Avatar></Link>
        </Box>
      </div>
      <div>
        <Routes>
          <Route path="/Home" element={<Test />} />
          <Route path="/Login" element={<Login />} />
          <Route path='/profile' element={<Userprofile/>}/>
        </Routes></div>
    </div>

  );
}

export default App
