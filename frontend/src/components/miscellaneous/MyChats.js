import React, { useEffect, useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { ChatState } from "../../context/chatContext";
import { toaster } from "../ui/toaster";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import { MdAdd } from "react-icons/md";
import GroupChatModal from "../miscellaneous/GroupChatModal";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('/api/chat', config);
            setChats(data);
        } catch (error) {
            toaster.create({
                title: 'Error fetching chats.',
                description: error.message,
                type: 'error',
                placement: 'bottom-left',
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
    }, []);

    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir={'column'}
            alignItems={'center'}
            p={3}
            bg={'white'}
            w={{ base: '100%', md: '31%' }}
            borderRadius={'lg'}
            borderWidth={'1px'}
        >
            {/* Header */}
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: '30px' }}
                fontFamily={'Work sans'}
                display={'flex'}
                w={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
                color={'black'}
            >
                My Chats
                <GroupChatModal>

                <Button
                    display={'flex'}
                    fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                    bg={'black'}
                    color={'white'}
                    size={'sm'}
                    >
                    <MdAdd />
                    New Group Chat
                </Button>
                </GroupChatModal>
            </Box>

            {/* Chat List */}
            <Box
                display={'flex'}
                flexDir={'column'}
                p={3}
                bg={'#F8F8F8'}
                w={'100%'}
                h={'100%'}
                borderRadius={'lg'}
                overflowY={'hidden'}
            >
                {chats ? (
                    chats.map((chat) => (
                        <Box
                            onClick={() => setSelectedChat(chat)}
                            cursor={'pointer'}
                            bg={selectedChat === chat ? 'black' : '#E8E8E8'}
                            color={selectedChat === chat ? 'white' : 'black'}
                            px={3}
                            py={2}
                            borderRadius={'lg'}
                            key={chat._id}
                            mb={2}
                        >
                            <Text fontWeight={'bold'}>
                                {!chat.isGroupChat
                                    ? getSender(loggedUser, chat.users)
                                    : chat.chatName}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;