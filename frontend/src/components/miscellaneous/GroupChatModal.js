import React, { useState } from "react";
import { Dialog, Input, Button, Box, Badge } from "@chakra-ui/react";
import { ChatState } from "../../context/chatContext";
import { toaster } from "../ui/toaster";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import ChatLoading from "./ChatLoading";

const GroupChatModal = ({ children, isOpen: isOpenProp, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const open = isOpenProp !== undefined ? isOpenProp : isOpen;
    const handleClose = (e) => {
        if (onClose) onClose();
        else setIsOpen(e?.open ?? false);
    };

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
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false);
            toaster.create({
                title: "Failed to load search results.",
                type: "error",
                placement: "bottom-left",
            });
        }
    };

    const handleAddUser = (userToAdd) => {
        if (selectedUsers.find((u) => u._id === userToAdd._id)) {
            toaster.create({ title: "User already added.", type: "warning", placement: "top" });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleRemoveUser = (userToRemove) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length === 0) {
            toaster.create({ title: "Please fill all the fields.", type: "warning", placement: "top" });
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(
                "/api/chat/group",
                { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) },
                config
            );
            setChats([data, ...chats]);
            setGroupChatName("");
            setSelectedUsers([]);
            setSearchResult([]);
            handleClose({ open: false });
            toaster.create({ title: "New Group Chat Created!", type: "success", placement: "bottom" });
        } catch (error) {
            toaster.create({
                title: "Failed to create the Group Chat.",
                description: error.response?.data?.message,
                type: "error",
                placement: "bottom",
            });
        }
    };

    return (
        <>
            {isOpenProp === undefined && (
                <span onClick={() => setIsOpen(true)}>{children}</span>
            )}

            <Dialog.Root open={open} onOpenChange={handleClose}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg={"white"} color={"black"}>
                        <Dialog.Header display={"flex"} justifyContent={"center"}>
                            <Dialog.Title fontSize={"35px"} fontFamily={"Work sans"}>
                                Create Group Chat
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger color={"black"} />
                        <Dialog.Body display={"flex"} flexDir={"column"} alignItems={"center"} gap={3}>
                            <Input
                                placeholder="Chat Name"
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Input
                                placeholder="Add Users e.g. John, Jane"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {/* Selected users badges */}
                            {selectedUsers.length > 0 && (
                                <Box w={"100%"} display={"flex"} flexWrap={"wrap"} gap={1}>
                                    {selectedUsers.map((u) => (
                                        <Badge
                                            key={u._id}
                                            px={2}
                                            py={1}
                                            borderRadius={"lg"}
                                            bg={"purple.500"}
                                            color={"white"}
                                            cursor={"pointer"}
                                            onClick={() => handleRemoveUser(u)}
                                        >
                                            {u.name} ✕
                                        </Badge>
                                    ))}
                                </Box>
                            )}
                            {/* Search results */}
                            {loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult.slice(0, 4).map((u) => (
                                    <UserListItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleAddUser(u)}
                                    />
                                ))
                            )}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button bg={"black"} color={"white"} onClick={handleSubmit}>
                                Create Chat
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    );
};

export default GroupChatModal;