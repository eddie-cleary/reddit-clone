import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const SubmitPostPage: React.FC = () => {
  return (
    <PageContent>
      <>
        <Box py="14px" borderBottom="1px solid white">
          <Text>Create a post</Text>
        </Box>
        <NewPostForm />
      </>
      <>{/* AboutComponent */}</>
    </PageContent>
  );
};
export default SubmitPostPage;
