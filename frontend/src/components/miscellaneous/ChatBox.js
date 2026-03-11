import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Input, IconButton, Spinner } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { ChatState } from "../../context/chatContext";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileDialog from "./ProfileDialog";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { toaster } from "../ui/toaster";

const ChatBox = () => {
    const { user, selectedChat } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
        } catch (error) {
            toaster.create({
                title: "Error fetching messages.",
                description: error.message,
                type: "error",
                placement: "bottom-left",
            });
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            setSendingMessage(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const messageContent = newMessage;
            setNewMessage("");
            const { data } = await axios.post(
                "/api/message",
                { content: messageContent, chatId: selectedChat._id },
                config
            );
            setMessages((prev) => [...prev, data]);
        } catch (error) {
            toaster.create({
                title: "Error sending message.",
                description: error.message,
                type: "error",
                placement: "bottom-left",
            });
        } finally {
            setSendingMessage(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const isOwnMessage = (msg) => msg.sender._id === user._id;

    const isFirstInSequence = (i) =>
        i === 0 || messages[i - 1].sender._id !== messages[i].sender._id;

    const isLastInSequence = (i) =>
        i === messages.length - 1 ||
        messages[i + 1].sender._id !== messages[i].sender._id;

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            {selectedChat ? (
                <>
                    {/* Header */}
                    <Box
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottomWidth="1px"
                        borderColor="gray.200"
                        mb={2}
                    >
                        <Text fontWeight="bold" fontSize="2xl" color="black">
                            {selectedChat.isGroupChat
                                ? selectedChat.chatName
                                : getSender(user, selectedChat.users)}
                        </Text>
                        {!selectedChat.isGroupChat && (
                            <ProfileDialog user={getSenderFull(user, selectedChat.users)} />
                        )}
                        {selectedChat.isGroupChat && (
                            <UpdateGroupChatModal fetchMessages={fetchMessages} />
                        )}
                    </Box>

                    {/* Messages Area */}
                    <Box
                        flex={1}
                        display="flex"
                        flexDir="column"
                        p={3}
                        bg="#E8E8E8"
                        borderRadius="lg"
                        overflowY="auto"
                    >
                        {loading ? (
                            <Spinner size="xl" alignSelf="center" margin="auto" />
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <Box
                                        key={msg._id}
                                        display="flex"
                                        flexDir="column"
                                        alignItems={isOwnMessage(msg) ? "flex-end" : "flex-start"}
                                        mb={isLastInSequence(i) ? 2 : 0.5}
                                    >
                                        {/* Sender name for group chats */}
                                        {selectedChat.isGroupChat &&
                                            !isOwnMessage(msg) &&
                                            isFirstInSequence(i) && (
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.500"
                                                    ml="40px"
                                                    mb={0.5}
                                                >
                                                    {msg.sender.name}
                                                </Text>
                                            )}
                                        <Box display="flex" alignItems="flex-end">
                                            {/* Avatar for other users */}
                                            {!isOwnMessage(msg) && (
                                                isLastInSequence(i) ? (
                                                    <Avatar.Root size="sm" mr={2} flexShrink={0}>
                                                        <Avatar.Image src={msg.sender.pic} />
                                                        <Avatar.Fallback>
                                                            {msg.sender.name[0]}
                                                        </Avatar.Fallback>
                                                    </Avatar.Root>
                                                ) : (
                                                    <Box w="32px" mr={2} flexShrink={0} />
                                                )
                                            )}
                                            <Box
                                                bg={isOwnMessage(msg) ? "black" : "white"}
                                                color={isOwnMessage(msg) ? "white" : "black"}
                                                borderRadius={
                                                    isOwnMessage(msg)
                                                        ? "18px 18px 4px 18px"
                                                        : "18px 18px 18px 4px"
                                                }
                                                px={4}
                                                py={2}
                                                maxW="75%"
                                                fontSize="sm"
                                                boxShadow="sm"
                                            >
                                                {msg.content}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </Box>

                    {/* Message Input */}
                    <Box display="flex" w="100%" mt={3} gap={2} alignItems="center">
                        <Input
                            placeholder="Enter a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            bg="#E0E0E0"
                            color="black"
                            borderRadius="full"
                            px={4}
                            flex={1}
                            border="none"
                            _placeholder={{ color: "gray.500" }}
                        />
                        <IconButton
                            bg="black"
                            color="white"
                            borderRadius="full"
                            onClick={sendMessage}
                            loading={sendingMessage}
                            disabled={!newMessage.trim()}
                            aria-label="Send message"
                        >
                            <IoSend />
                        </IconButton>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                >
                    <Text fontSize="3xl" fontFamily="Work sans" color="gray.400">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default ChatBox;