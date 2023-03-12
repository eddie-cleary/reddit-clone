import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import PageContent from "@/components/Layout/PageContent";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import usePosts from "@/hooks/usePosts";
import { Post, PostVote } from "@/atoms/postsAtom";
import CreatePostLink from "@/components/Community/CreatePostLink";
import PostLoader from "@/components/Post/PostLoader";
import PostItem from "@/components/Post/PostItem";
import { Stack } from "@chakra-ui/react";
import { communityState } from "@/atoms/communitiesAtom";
import useCommunityData from "@/hooks/useCommunityData";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onSelectPost,
    onDeletePost,
    onVote,
  } = usePosts();
  const { communityStateValue } = useCommunityData();

  const buildNoUserHomeFeed = useCallback(async () => {
    try {
      setLoading(true);
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [setPostStateValue]);

  const buildUserHomeFeed = useCallback(async () => {
    try {
      setLoading(true);
      if (communityStateValue.mySnippets.length) {
        // get posts from user's communities
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(10)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [buildNoUserHomeFeed, communityStateValue.mySnippets, setPostStateValue]);

  const getUserPostVotes = useCallback(async () => {
    try {
      const postIds = postStateValue.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error: any) {
      console.error(error.message);
    }
  }, [postStateValue.posts, setPostStateValue, user?.uid]);

  // useEffects

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched, buildUserHomeFeed]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser, buildNoUserHomeFeed]);

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postStateValue.posts, getUserPostVotes, setPostStateValue]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>{/* <Recommendations /> */}</>
    </PageContent>
  );
};

export default Home;
