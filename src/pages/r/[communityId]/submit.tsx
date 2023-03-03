import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);

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
