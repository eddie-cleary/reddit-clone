import { Post } from "@/atoms/postsAtom";
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import moment from "moment";
import { useRouter } from "next/router";
import Link from "next/link";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = (props) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(false);
  const singlePostPage = !props.onSelectPost;

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    try {
      setError(false);
      setLoadingDelete(true);
      const success = await props.onDeletePost(props.post);

      if (!success) {
        throw new Error("Failed to delete post");
      }

      if (singlePostPage) {
        router.push(`/r/${props.post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
      cursor={singlePostPage ? "unset" : "pointer"}
      onClick={() => props.onSelectPost && props.onSelectPost(props.post)}
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePostPage ? "none" : "gray.100"}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? "" : "3px 0px 0px 3px"}
      >
        <Icon
          as={
            props.userVoteValue === 1
              ? IoArrowUpCircleSharp
              : IoArrowUpCircleOutline
          }
          color={props.userVoteValue === 1 ? "brand.100" : "gray.400 "}
          fontSize={22}
          onClick={(event) =>
            props.onVote(event, props.post, 1, props.post.communityId)
          }
          cursor="pointer"
        />
        <Text fontSize="9pt">{props.post.voteStatus}</Text>
        <Icon
          as={
            props.userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={props.userVoteValue === -1 ? "#4379ff" : "gray.400 "}
          fontSize={22}
          onClick={(event) =>
            props.onVote(event, props.post, -1, props.post.communityId)
          }
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>{error}</Text>
          </Alert>
        )}
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {props.homePage && (
              <>
                {props.post.communityImageURL ? (
                  <Image
                    src={props.post.communityImageURL}
                    borderRadius="full"
                    boxSize="18px"
                    mr={2}
                    alt={props.post.communityId}
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="18pt" mr={1} color="blue.500" />
                )}
                <Link
                  onClick={(event) => event.stopPropagation()}
                  href={`r/${props.post.communityId}`}
                >
                  <Text
                    fontWeight={700}
                    _hover={{ textDecoration: "underline" }}
                  >{`r/${props.post.communityId}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize={8} />
              </>
            )}
            <Text>
              Posted by u/{props.post.creatorDisplayName}
              {moment(new Date(props.post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight="600">
            {props.post.title}
          </Text>
          <Text fontSize="10pt">{props.post.body}</Text>
          {props.post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={props.post.imageURL}
                alt={props.post.title}
                maxHeight="460px"
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{props.post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {props.userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
