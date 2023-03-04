import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Post/PostItem";
import usePosts from "@/hooks/usePosts";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

const PostPage: React.FC = () => {
  const { postStateValue, onDeletePost, onVote } = usePosts();
  const [user] = useAuthState(auth);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.posts.find(
                (item) => item.id === postStateValue.selectedPost?.id
              )?.voteStatus
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        {/* <SelectedPost /> */}
        {/* <Comments /> */}
      </>
      <>{/* <About /> */}</>
    </PageContent>
  );
};
export default PostPage;
