import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            cursor={'pointer'}
            bg={'gray.100'}
            _hover={{ bg: 'black', color: 'white' }}
            w={'100%'}
            display={'flex'}
            alignItems={'center'}
            color={'black'}
            px={3}
            py={2}
            mb={2}
            borderRadius={'lg'}
        >
            <Avatar.Root size='sm' mr={2}>
                <Avatar.Image src={user?.pic} />
                <Avatar.Fallback name={user?.name} />
            </Avatar.Root>
            <Box>
                <Text fontWeight={'bold'} fontSize={'sm'}>{user?.name}</Text>
                <Text fontSize={'xs'}>Email: {user?.email}</Text>
            </Box>
        </Box>
    );
}

export default UserListItem;
