import { Dialog, IconButton, Image, Text, Button, Icon } from "@chakra-ui/react"
import React, { useState } from "react"
import { AiOutlineEye } from "react-icons/ai"

const ProfileDialog = ({ user, children, isOpen: isOpenProp, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = isOpenProp !== undefined ? isOpenProp : isOpen;
    const handleClose = (e) => {
        if (onClose) onClose();
        else setIsOpen(e.open);
    };

    return (
        <>
            {/* Trigger - only show if no external control */}
            {isOpenProp === undefined && (
                children ? (
                    <span onClick={() => setIsOpen(true)}>{children}</span>
                ) : (
                    <IconButton display={{ base: 'flex' }} onClick={() => setIsOpen(true)}>
                        <Icon><AiOutlineEye /></Icon>
                    </IconButton>
                )
            )}

            {/* Dialog */}
            <Dialog.Root open={open} onOpenChange={handleClose}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg={'white'} color={'black'}>
                        <Dialog.Header display={'flex'} justifyContent={'center'}>
                            <Dialog.Title
                                fontSize={'40px'}
                                fontFamily={'Work sans'}
                                color={'black'}>
                                {user?.name}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger color={'black'} />
                        <Dialog.Body
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            gap={4}>
                            <Image
                                borderRadius={'full'}
                                boxSize={'150px'}
                                src={user?.pic}
                                alt={user?.name}
                                fallbackSrc={'https://www.gravatar.com/avatar/?d=mp&s=150'}
                            />
                            <Text fontSize={'22px'} fontFamily={'Work sans'} color={'black'}>
                                Email: {user?.email}
                            </Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button bg={'black'} color={'white'} onClick={() => handleClose({ open: false })}>Close</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </>
    )
}

export default ProfileDialog