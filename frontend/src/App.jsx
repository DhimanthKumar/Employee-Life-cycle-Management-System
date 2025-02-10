import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HStack } from '@chakra-ui/react'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-gray-500'>
      <HStack>
        <p>hello</p>
        <p>1</p>
        <p>2</p>
      </HStack>
    </div>
  )
}

export default App
