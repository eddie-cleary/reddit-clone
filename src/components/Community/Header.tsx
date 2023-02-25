import { Community } from "@/atoms/communitiesAtom";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import image from "next/image";
import React from "react";
import { FaRedditSquare } from "react-icons/fa";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = (props) => {
  const isJoined = false; // read from communitySnippets

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" backgroundColor="blue.400" />
      <Flex justify="center" backgroundColor="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {props.communityData.imageURL ? (
            <Image alt={props.communityData?.creatorId} />
          ) : (
            <Icon
              as={FaRedditSquare}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {props.communityData.id}
              </Text>
              <Text fontWeight={800} fontSize="10pt" color="gray.400">
                r/{props.communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              px={6}
              onClick={() => {}}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
