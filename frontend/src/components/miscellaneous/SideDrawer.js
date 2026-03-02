import { Box, Button, Menu, Text, Icon, Avatar, Drawer, Input } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { Tooltip } from "../ui/tooltip";
import React, { useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { ChatState } from "../../context/chatContext";
import ProfileDialog from "./ProfileDialog"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState();
    const [profileOpen, setProfileOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
    }

    const handleSearch = async () => {
        if (!search) {
            toaster.create({
                title: 'Please Enter Something.',
                type: 'warning',
                placement: 'top-left',
            });
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }

            const {data} = await axios.get(`/api/user?search=${search}`, config)

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toaster.create({
                title: 'Failed to load the search results.',
                type: 'error',
                placement: 'bottom-left',
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
            };

            const {data} = await axios.post('/api/chat', {userId}, config);
            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setDrawerOpen(false);
        } catch (error) {
            toaster.create({
                title: 'Error fetching the message.',
                description: error.message,
                type: 'error',
                placement: 'bottom-left',
            })
        }
    }

    return (
        <>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'gray.400'}
                w={'100%'}
                p={'5px 10px 5px 10px'}
                borderWidth={'5px'}>

                {/* Search Button */}
                <Tooltip content="Search Users to Chat!" showArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={'1'}>
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>

                {/* Title */}
                <Text fontSize={'2xl'} fontFamily={'Work sans'}>
                    Chat Application
                </Text>

                {/* Right Side Icons */}
                <div>
                    {/* Notifications Menu */}
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <Button variant="ghost" p={'1'}>
                                <Icon>
                                    <IoMdNotifications />
                                </Icon>
                            </Button>
                        </Menu.Trigger>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item value="no-notifications">
                                    No New Messages
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Menu.Root>

                    {/* Profile Menu */}
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <Button variant="ghost">
                                <Avatar.Root size='sm' cursor='pointer'>
                                    <Avatar.Image src={user?.pic} />
                                    <Avatar.Fallback name={user?.name} />
                                </Avatar.Root>
                                <Icon>
                                    <FaChevronDown />
                                </Icon>
                            </Button>
                        </Menu.Trigger>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item value="profile" onClick={() => setProfileOpen(true)}>My Profile</Menu.Item>
                                <Menu.Item value="logout" onClick={logoutHandler}>Logout</Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Menu.Root>
                </div>
            </Box>

            <Drawer.Root open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)} placement={'start'}>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content bg={'white'} color={'black'}>
                        <Drawer.Header>
                            <Drawer.Title>Search Users</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Box display={'flex'} gap={2} pb={2}>
                                <Input
                                    placeholder="Search by name or email"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    color={'black'}
                                    borderColor={'gray.300'}
                                />
                                <Button
                                    bg={'black'}
                                    color={'white'}
                                    onClick={handleSearch}
                                    loading={loading}
                                >
                                    Go
                                </Button>
                            </Box>
                            {loading? (
                                <ChatLoading/>
                            ):(
                                searchResult?.map(user=>(
                                    <UserListItem
                                        key = {user._id}
                                        user = {user}
                                        handleFunction = {() => accessChat(user._id)}>
                                    </UserListItem>
                                ))
                            )}
                        </Drawer.Body>
                        <Drawer.CloseTrigger />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>

            {/* Profile Dialog - outside menu so it doesn't get unmounted */}
            <ProfileDialog user={user} isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </>
    );
}

export default SideDrawer;