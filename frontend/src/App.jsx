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
import Createuser from './components/createuser'
import Creationstatus from './components/creationstatus'
function App() {
  const { isAuthenticated, logout, userdata, profile ,isstaff} = useContext(AuthContext);
  // console.log(userdata,profile);

  const style1={display: "block", width: "100%", height: "100%", padding: "5px 10px"}
  return (

    <div >
  <div style={{ padding: "10px 20px", display: "flex", borderBottom: "1px solid gray" }}>
    <Box className="rounded-md hover:bg-gray-400 p-1 bg-blue-100">
      <Link to={'/Home'} style={style1}>Home</Link>
    </Box>

    {isstaff && (
      <Box className="rounded-md hover:bg-gray-400 p-1 bg-blue-100 ml-10">
        <Link to="/Createuser" style={style1}>
          CreateUser
        </Link>
      </Box>
    )}

    <Box className="ml-auto mr-5 rounded-md hover:bg-gray-400 p-1 bg-blue-100">
      {isAuthenticated ? (
        <button onClick={logout} style={style1}>Logout</button>
      ) : (
        <Link to="/login" style={style1}>
          Login
        </Link>
      )}
    </Box>

    {isAuthenticated && (
      <Box className="pt-1">
        <Link to="/profile">
          <Avatar src="https://www.w3schools.com/w3images/avatar3.png" width={30} />
        </Link>
      </Box>
    )}
  </div>
      <div>
        <Routes>
          <Route path="/Home" element={<Test />} />
          <Route path="/Login" element={<Login />} />
          <Route path='/profile' element={<Userprofile/>}/>
          <Route path='/Createuser' element={<Createuser/>}/>
          <Route path='/Createuser/status' element={<Creationstatus/>}/> 
        </Routes></div>
    </div>

  );
}

export default App
