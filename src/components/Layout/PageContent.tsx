import { Flex } from "@chakra-ui/react";
import React from "react";
import { PropsWithChildren } from "react";

type PageContentProps = {
  children?: React.ReactNode[];
};

const PageContent: React.FC<PageContentProps> = (props) => {
  return (
    <Flex justify="center" p="16px 8px">
      <Flex width="95%" justify="center" maxWidth="860px">
        {/* LHS */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {props.children && props.children[0]}
        </Flex>
        {/* RHS */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {props.children && props.children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
