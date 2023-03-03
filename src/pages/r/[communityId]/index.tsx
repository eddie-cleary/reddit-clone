import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { firestore } from "@/firebase/clientApp";
import { Community, communityState } from "../../../atoms/communitiesAtom";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "@/components/Community/NotFound";
import Header from "@/components/Community/Header";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "@/components/Post/Posts";
import { useSetRecoilState } from "recoil";
import About from "@/components/Community/About";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = (props) => {
  const setCommunityStateValue = useSetRecoilState(communityState);

  useEffect(() => {
    if (props.communityData) {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: props.communityData,
      }));
    }
  }, [props.communityData, setCommunityStateValue]);

  if (!props.communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={props.communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={props.communityData} />
        </>
        <>
          <About communityData={props.communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass it to client
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    // Todo: Could add error page from Next.js here
    console.error(error);
  }
}

export default CommunityPage;
