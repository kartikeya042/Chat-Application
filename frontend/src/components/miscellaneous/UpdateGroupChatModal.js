import React, { useState } from "react";
import { Dialog, Input, Button, Box, Badge, Text, IconButton, Icon, Spinner } from "@chakra-ui/react";
import { AiOutlineSetting } from "react-icons/ai";
import { ChatState } from "../../context/chatContext";
import { toaster } from "../ui/toaster";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import ChatLoading from "./ChatLoading";

const UpdateGroupChatModal = ({ children, fetchMessages }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const isAdmin = selectedChat?.groupAdmin?._id === user._id ||
                    selectedChat?.groupAdmin === user._id;

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            setSearchResult([]);
            return;
        }
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResult(data);
        } catch (error) {
            toaster.create({
                title: "Failed to load search results.",
                type: "error",
                placement: "bottom-left",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName.trim()) return;
        try {
            setRenameLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.patch(
                "/api/chat/rename",
                { chatId: selectedChat._id, chatName: groupChatName },
                config
            );
            setSelectedChat(data);
            setChats(chats.map((c) => (c._id === data._id ? data : c)));
            setGroupChatName("");
            toaster.create({ title: "Group renamed successfully.", type: "success", placement: "top" });
        } catch (error) {
            toaster.create({
                title: "Failed to rename the group.",
                description: error.response?.data?.message,
                type: "error",
                placement: "bottom-left",
            });
        } finally {
            setRenameLoading(false);
        }
    };

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toaster.create({ title: "User already in the group.", type: "warning", placement: "top" });
            return;
        }
        if (!isAdmin) {
            toaster.create({ title: "Only admins can add users.", type: "warning", placement: "top" });
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.patch(
                "/api/chat/addToGroup",
                { chatId: selectedChat._id, userId: userToAdd._id },
                config
            );
            setSelectedChat(data);
            setChats(chats.map((c) => (c._id === data._id ? data : c)));
            setSearch("");
            setSearchResult([]);
            toaster.create({ title: `${userToAdd.name} added to the group.`, type: "success", placement: "top" });
        } catch (error) {
            toaster.create({
                title: "Failed to add user.",
                description: error.response?.data?.message,
                type: "error",
                placement: "bottom-left",
            });
        }
    };

    const handleRemoveUser = async (userToRemove) => {
        const isSelf = userToRemove._id === user._id;
        if (!isSelf && !isAdmin) {
            toaster.create({ title: "Only admins can remove users.", type: "warning", placement: "top" });
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.patch(
                "/api/chat/removeFromGroup",
                { chatId: selectedChat._id, userId: userToRemove._id },
                config
            );
            if (isSelf) {
                setSelectedChat(null);
                setChats(chats.filter((c) => c._id !== selectedChat._id));
                setIsOpen(false);
                toaster.create({ title: "You left the group.", type: "info", placement: "top" });
            } else {
                setSelectedChat(data);
                setChats(chats.map((c) => (c._id === data._id ? data : c)));
                toaster.create({ title: `${userToRemove.name} removed from the group.`, type: "success", placement: "top" });
            }
        } catch (error) {
            toaster.create({
                title: "Failed to remove user.",
                description: error.response?.data?.message,
                type: "error",
                placement: "bottom-left",
            });
        }
    };

    const handleOpen = () => {
        setGroupChatName(selectedChat?.chatName || "");
        setSearch("");
        setSearchResult([]);
        setIsOpen(true);
    };

    return (
        <>
            <span onClick={handleOpen}>
                {children || (
                    <IconButton variant="ghost" aria-label="Group settings">
                        <Icon><AiOutlineSetting /></Icon>
                    </IconButton>
                )}
            </span>

            <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="white" color="black">
                        <Dialog.Header display="flex" justifyContent="center">
                            <Dialog.Title fontSize="30px" fontFamily="Work sans">
                                {selectedChat?.chatName}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger color="black" />

                        <Dialog.Body display="flex" flexDir="column" gap={4}>
                            {/* Current Members */}
                            <Box>
                                <Text fontWeight="semibold" mb={2} color="gray.600" fontSize="sm">
                                    Members ({selectedChat?.users?.length})
                                </Text>
                                <Box display="flex" flexWrap="wrap" gap={2}>
                                    {selectedChat?.users?.map((u) => (
                                        <Badge
                                            key={u._id}
                                            px={2}
                                            py={1}
                                            borderRadius="lg"
                                            bg={u._id === selectedChat?.groupAdmin?._id ? "purple.500" : "gray.600"}
                                            color="white"
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            {u.name}
                                            {u._id === selectedChat?.groupAdmin?._id && (
                                                <Text as="span" fontSize="9px" ml={1}>(admin)</Text>
                                            )}
                                            {(isAdmin || u._id === user._id) && (
                                                <Text
                                                    as="span"
                                                    cursor="pointer"
                                                    ml={1}
                                                    onClick={() => handleRemoveUser(u)}
                                                >
                                                    ✕
                                                </Text>
                                            )}
                                        </Badge>
                                    ))}
                                </Box>
                            </Box>

                            {/* Rename */}
                            <Box display="flex" gap={2}>
                                <Input
                                    placeholder="Rename group..."
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleRename()}
                                    disabled={!isAdmin}
                                />
                                <Button
                                    bg="black"
                                    color="white"
                                    onClick={handleRename}
                                    loading={renameLoading}
                                    disabled={!isAdmin || !groupChatName.trim()}
                                    flexShrink={0}
                                >
                                    Update
                                </Button>
                            </Box>

                            {/* Add Users */}
                            <Box>
                                <Input
                                    placeholder="Search users to add..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    disabled={!isAdmin}
                                />
                                {loading ? (
                                    <Box display="flex" justifyContent="center" mt={2}>
                                        <Spinner size="sm" />
                                    </Box>
                                ) : (
                                    <Box mt={2} maxH="150px" overflowY="auto">
                                        {searchResult.slice(0, 4).map((u) => (
                                            <UserListItem
                                                key={u._id}
                                                user={u}
                                                handleFunction={() => handleAddUser(u)}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Dialog.Body>

                        <Dialog.Footer justifyContent="space-between">
                            <Button
                                colorScheme="red"
                                bg="red.500"
                                color="white"
                                onClick={() => handleRemoveUser(user)}
                            >
                                Leave Group
                            </Button>
                            <Button variant="ghost" onClick={() => setIsOpen(false)}>
                                Close
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    );
};

export default UpdateGroupChatModal;
