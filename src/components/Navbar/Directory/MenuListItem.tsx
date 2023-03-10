import { Flex, Icon, Image, MenuItem } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type MenuListItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const MenuListItem: React.FC<MenuListItemProps> = (props) => (
  <MenuItem
    width="100%"
    fontSize="10pt"
    _hover={{ bg: "gray.100" }}
    onClick={() => {}}
  >
    <Flex align="center">
      {props.imageURL ? (
        <Image
          alt={props.displayText}
          src={props.imageURL}
          borderRadius="full"
          boxSize="18px"
          mr={2}
        />
      ) : (
        <Icon as={props.icon} fontSize={20} mr={2} color={props.iconColor} />
      )}
      {props.displayText}
    </Flex>
  </MenuItem>
);
export default MenuListItem;
