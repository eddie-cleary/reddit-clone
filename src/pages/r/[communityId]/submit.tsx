import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Post/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useRecoilValue } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);

  return (
    <PageContent>
      <>
        <Box py="14px" borderBottom="1px solid white">
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>{/* AboutComponent */}</>
    </PageContent>
  );
};
export default SubmitPostPage;
