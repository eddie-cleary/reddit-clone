import { Community } from "@/atoms/communitiesAtom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Post } from "@/atoms/postsAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import { Stack } from "@chakra-ui/react";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = (props) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const getPosts = useCallback(async () => {
    try {
      // get posts for this community
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", props.communityData.id),
        orderBy("createdAt", "desc")
      );
      const postsDocs = await getDocs(postsQuery);

      // Store in post state
      const posts = postsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.error(error.message);
    }
  }, [props.communityData.id, setPostStateValue]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <Stack>
      {postStateValue.posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          userIsCreator={user?.uid === post.creatorId}
          userVoteValue={undefined}
          onVote={onVote}
          onSelectPost={onSelectPost}
          onDeletePost={onDeletePost}
        />
      ))}
    </Stack>
  );
};
export default Posts;
