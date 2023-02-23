import AuthModal from "@/components/Modal/Auth/AuthModal";
import { Flex, Button } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import AuthButtons from "./AuthButtons";
import { auth } from "@/firebase/clientApp";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = (props) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {props.user ? <Icons /> : <AuthButtons />}
        <UserMenu user={props.user} />
      </Flex>
    </>
  );
};
export default RightContent;
