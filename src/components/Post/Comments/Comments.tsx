import { Post, postState } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/clientApp";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import { useSetRecoilState } from "recoil";
import CommentItem, { Comment } from "./CommentItem";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = (props) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const setPostState = useSetRecoilState(postState);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");

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

      // Update createdAt before pushing to local state, server timestamp won't work locally
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update client recoil state
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
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

  const onDeleteComment = async (comment: Comment) => {
    try {
      setLoadingDeleteId(comment.id);
      const batch = writeBatch(firestore);

      // delete comment doc in db
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update post number of comments
      const postDocRef = doc(firestore, "posts", props.selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update client recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoadingDeleteId("");
    }
  };

  const getPostComments = useCallback(async () => {
    try {
      console.log("it is ", props.selectedPost?.id);
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", props.selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setFetchLoading(false);
    }
  }, [props.selectedPost?.id]);

  useEffect(() => {
    if (!props.selectedPost) return;
    getPostComments();
  }, [getPostComments, props.selectedPost]);

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
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={props.user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading === true ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments?.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={props.user.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
