import { VStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const Creationstatus = ({message})=>{
    // console.log(props);
    console.log(message);
    return <VStack className="flex flex-col justify-center items-center bg-blue-100">
        

        {/* <p>{props}</p> */}
        {/* <Link to={'/createuser'}>Createuser</Link> */}
    </VStack>
}
export default Creationstatus;