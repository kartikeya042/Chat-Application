import { Stack, HStack, Skeleton, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
    return (
        <Stack>
            <HStack width="full">
                <SkeletonCircle size="10" />
                <SkeletonText noOfLines={2} />
            </HStack>
            <Skeleton height="100px" />
            <HStack width="full">
                <SkeletonCircle size="10" />
                <SkeletonText noOfLines={2} />
            </HStack>
            <Skeleton height="100px" />
            <HStack width="full">
                <SkeletonCircle size="10" />
                <SkeletonText noOfLines={2} />
            </HStack>
            <Skeleton height="100px" />
            <HStack width="full">
                <SkeletonCircle size="10" />
                <SkeletonText noOfLines={2} />
            </HStack>
            <Skeleton height="100px" />
        </Stack>
    )
}

export default ChatLoading