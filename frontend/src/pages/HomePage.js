import React from "react";
import { Tabs, Box, Container, Text } from '@chakra-ui/react';
import { LuUser } from "react-icons/lu";
import Login from "../components/authentication/login";
import SignUp from "../components/authentication/signup";

const HomePage = () => {
    return (
        <Container maxW={"xl"} centerContent>
            <Box
                d='flex'
                justifyContent={"center"}
                alignItems={"center"}
                p={3}
                bg={"white"}
                w={"100%"}
                m={"40px 0 15px 0"}
                borderRadius={"lg"}
                borderWidth={"1px"}
            >
                <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"} textAlign={"center"} fontWeight={"bold"}>
                    Chat Application
                </Text>
            </Box>
            <Box
                bg={"white"}
                w={"100%"}
                p={4}
                borderRadius={"lg"}
                borderWidth={"1px"}
            >
                <Tabs.Root defaultValue="members" variant="enclosed" color={"black"}>
                    <Tabs.List bg="blackAlpha.200" rounded="l3" p="1" width={"100%"} >
                        <Tabs.Trigger value="Login" width={"50%"} >
                            <LuUser />
                            Login
                        </Tabs.Trigger>
                        <Tabs.Trigger value="Sign-Up" width={"50%"}>
                            <LuUser />
                            Sign-Up
                        </Tabs.Trigger>
                        {/* <Tabs.Trigger value="tasks">
                            <LuSquareCheck />
                            Settings
                        </Tabs.Trigger> */}
                        <Tabs.Indicator rounded="l2" />
                    </Tabs.List>
                    <Tabs.Content value="Login">
                        <Login/>
                    </Tabs.Content>
                    <Tabs.Content value="Sign-Up">
                        <SignUp/>
                    </Tabs.Content>
                    {/* <Tabs.Content value="tasks">
                        Manage your tasks for freelancers
                    </Tabs.Content> */}
                </Tabs.Root>

            </Box>
        </Container>
    )
}

export default HomePage;