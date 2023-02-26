import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { TabItemType } from "./NewPostForm";

type TabItemProps = {
  item: TabItemType;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = (props) => {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      py="14px"
      fontWeight={700}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      color={props.selected ? "blue.500" : "gray.500"}
      borderWidth={props.selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={props.selected ? "blue.500" : "gray.200"}
      borderRightColor="gray.200"
      onClick={() => props.setSelectedTab(props.item.title)}
    >
      <Flex alignItems="center" height="20px" mr={2}>
        <Icon as={props.item.icon} />
      </Flex>
      <Text fontSize="10pt">{props.item.title}</Text>
    </Flex>
  );
};
export default TabItem;
