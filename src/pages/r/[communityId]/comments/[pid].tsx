import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Post/PostItem";
import usePosts from "@/hooks/usePosts";
import React, { useCallback, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { Post } from "@/atoms/postsAtom";

const PostPage: React.FC = () => {
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const [user] = useAuthState(auth);
  const router = useRouter();

  const fetchPost = useCallback(
    async (postId: string) => {
      try {
        const postDocRef = doc(firestore, `posts`, postId);
        const postDoc = await getDoc(postDocRef);
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
        }));
      } catch (error: any) {
        console.error(error.message);
      }
    },
    [setPostStateValue]
  );

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [postStateValue.selectedPost, fetchPost, router.query]);

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
function useCallBack(arg0: (postId: string) => Promise<void>, arg1: never[]) {
  throw new Error("Function not implemented.");
}
