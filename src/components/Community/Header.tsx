import { Community } from "@/atoms/communitiesAtom";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import image from "next/image";
import React from "react";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "../../hooks/useCommunityData";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (snippet) => snippet.communityId === props.communityData.id
  );

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" backgroundColor="blue.400" />
      <Flex justify="center" backgroundColor="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              alt={"Community image"}
              src={communityStateValue.currentCommunity?.imageURL}
              borderRadius="full"
              boxSize="66px"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="full"
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
              onClick={() =>
                onJoinOrLeaveCommunity(props.communityData, isJoined)
              }
              isLoading={loading}
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
