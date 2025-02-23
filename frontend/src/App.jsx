import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, HStack,Flex } from '@chakra-ui/react'
import { Route,Router,Link,Routes } from 'react-router-dom'
import Test from './components/test'
import Login from './components/Login'
import { useContext } from 'react'
import AuthContext from './components/authcontext'
function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);
return (
  
  <div >
    <div style={{ padding:"10px 20px", display:"flex" ,borderBottom:"1px solid gray" }}>
      <Box className='hover:rounded-md  hover:bg-gray-400 p-1'>
      <Link to={'/Home'}>Home</Link></Box>
      <Box className='ml-auto mr-5 hover:rounded-md  hover:bg-gray-400 p-1' >
      {isAuthenticated ? (
                <button onClick={logout}>Logout</button> // ✅ Show logout when logged in
            ) : (
                <Link to="/login">Login</Link> // ✅ Show login when logged out
            )}
      </Box>
    </div>
    <div>
    <Routes>
      <Route path="/Home" element={<Test />} />
      <Route path="/Login" element={<Login />} />
    </Routes></div>
  </div>

);
}

export default App
