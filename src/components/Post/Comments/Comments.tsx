import { Post, postState } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/clientApp";
import { Box, Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import CommentInput from "./commentInput";
import { useSetRecoilState } from "recoil";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  commentText: string;
  createdAt: Timestamp;
};

type commentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<commentsProps> = (props) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    try {
      setCreateLoading(true);
      const batch = writeBatch(firestore);
      // create a comment doc in db
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: props.user.uid,
        creatorDisplayText: props.user.email!.split("@")[0],
        communityId: props.communityId,
        postId: props.selectedPost?.id!,
        postTitle: props.selectedPost?.title!,
        commentText,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);

      // update post number of comments
      const postDocRef = doc(firestore, `posts`, props.selectedPost?.id!);
      batch.update(postDocRef, { numberOfComments: increment(1) });

      await batch.commit();

      // update client recoil state
      setCommentText("");
      setComments((prev) => ({ newComment, ...prev }));
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const onDeleteComment = async (comment: any) => {
    // delete comment doc in db
    // update post number of comments
    // update client recoil state
  };

  const getPostComments = async () => {};

  useEffect(() => {
    getPostComments();
  }, []);

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px" p={2}>
      <Flex
        direction="column"
        paddingLeft={10}
        paddingRight={4}
        marginBottom={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={props.user}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
        />
      </Flex>
    </Box>
  );
};
export default Comments;
