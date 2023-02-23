import React from "react";
import { Image, Flex } from "@chakra-ui/react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";

const Navbar: React.FC = () => {
  return (
    <Flex bg="white" height="44px" padding="6px 12px">
      <Flex align="center">
        <Image
          src="/images/redditFace.svg"
          alt="Reddit Face Logo"
          height="30px"
        />
        <Image
          src="/images/redditText.svg"
          alt="Reddit Text Logo"
          height="46px"
          display={{
            base: "none",
            md: "unset",
          }}
        />
      </Flex>
      {/* <Directory /> */}
      <SearchInput />
      <RightContent />
    </Flex>
  );
};
export default Navbar;
