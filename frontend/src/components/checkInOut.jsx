import { Box, Button, HStack, VStack, Text, Center, Spinner } from "@chakra-ui/react";
import { AuthContext } from "./authcontext";
import { useContext, useEffect, useRef, useState } from "react";
import { motion} from "framer-motion";

const MotionButton = motion(Button);

const CheckInOut = () => {
    const {
        checkintime,
        checkouttime,
        checkin,
        ischeckedin,
        checkout,
        ischeckedout,
        isAuthenticated,
    } = useContext(AuthContext);

    const [timePassed, setTimePassed] = useState("");
    const intervalRef = useRef(null);

    const handleCheckin = () => {
        checkin(localStorage.getItem("token"));
    };

    const handleCheckout = () => {
        checkout(localStorage.getItem("token"));
    };

    const calculateWorkedHours = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "";

        const [h1, m1, s1] = checkIn.split(":").map(Number);
        const [h2, m2, s2] = checkOut.split(":").map(Number);

        const checkInDate = new Date(0, 0, 0, h1, m1, s1);
        const checkOutDate = new Date(0, 0, 0, h2, m2, s2);

        let diffMs = checkOutDate - checkInDate;
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        if (ischeckedin && checkintime && !ischeckedout) {
            const updateTimePassed = () => {
                const now = new Date();
                const [h, m, s] = checkintime.split(":").map(Number);
                const checkInDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    h,
                    m,
                    s
                );
                const diffMs = now - checkInDate;
                if (diffMs >= 0) {
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
                    const seconds = Math.floor((diffMs / 1000) % 60);
                    setTimePassed(`${hours}h ${minutes}m ${seconds}s`);
                }
            };

            updateTimePassed();
            intervalRef.current = setInterval(updateTimePassed, 1000);

            return () => clearInterval(intervalRef.current);
        }
    }, [ischeckedin, checkintime, ischeckedout]);

    if (ischeckedin == null) {
        return (
            <Center minH="70vh">
                <VStack spacing={4}>
                    <Spinner size="xl" color="blue.500" thickness="4px" speed="0.65s" />
                    <Text fontSize="lg" color="gray.600">
                        Authenticating...
                    </Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Center minH="70vh">
            <VStack spacing={6} p={6} borderRadius="lg" boxShadow="md" w="full" maxW="sm" bg='teal.50'>
                <Text fontSize="2xl" fontWeight="bold">
                Check-In Panel


                </Text>

                <VStack spacing={2}>
                    {ischeckedin && (
                        <Text color="green.500" fontSize="lg">
                            Checked in at: {checkintime}
                        </Text>
                    )}
                    {ischeckedout && (
                        <Text color="red.500" fontSize="lg">
                            Checked out at: {checkouttime}
                        </Text>
                    )}
                    {ischeckedin && !ischeckedout && (
                        <Text color="blue.500" fontSize="lg">
                            Working for: {timePassed}
                        </Text>
                    )}
                    {ischeckedin && ischeckedout && (
                        <Text color="purple.500" fontSize="lg">
                            Worked: {calculateWorkedHours(checkintime, checkouttime)}
                        </Text>
                    )}
                </VStack>

                {console.log(ischeckedin)}
                {
                    (!ischeckedin || (ischeckedin && !ischeckedout)) && (
                        <MotionButton
                            onClick={ischeckedin ? handleCheckout : handleCheckin}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            colorScheme={ischeckedin ? "red" : "green"}
                            size="lg"
                            w="full"
                        >
                            {ischeckedin ? "Check Out" : "Check In"}
                        </MotionButton>
                    )
                }
            </VStack>
        </Center>
    );
};

export default CheckInOut;
