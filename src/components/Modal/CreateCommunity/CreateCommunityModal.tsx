import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Input,
  Checkbox,
  Stack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsEyeFill, BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = (props) => {
  const [communityName, setCommunityName] = useState("");
  // Calculate chars remaining/allowed in name
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("public");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) {
      return;
    }
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };
  return (
    <Modal isOpen={props.open} onClose={props.handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          display="flex"
          flexDirection="column"
          fontSize={15}
          padding={3}
        >
          Create A Community
        </ModalHeader>
        <Box px={3}>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" py={10} px={0}>
            <Text fontWeight={600} fontSize={15}>
              Name
            </Text>
            <Text fontSize={11} color="gray.500">
              Community names including capitalization cannot be changed
            </Text>
            <Text
              position="relative"
              top="28px"
              left="10px"
              width="20px"
              color="gray.400"
            >
              r/
            </Text>
            <Input
              position="relative"
              value={communityName}
              size="sm"
              pl="22px"
              onChange={handleChange}
            />
            <Text
              fontSize="9pt"
              color={charsRemaining === 0 ? "red" : "gray.500"}
            >
              {charsRemaining} Characters remaining
            </Text>
            <Box my={4}>
              <Text fontWeight={600} fontSize={15}>
                Community Text
              </Text>
              <Stack spacing={2}>
                <Checkbox
                  name="public"
                  isChecked={communityType == "public"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr={1}>
                      Public
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Anyone can view, comment, and post to this community
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="restricted"
                  isChecked={communityType == "restricted"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr={1}>
                      Restricted
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Anyone can view this community, but only approved users
                      can post
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="private"
                  isChecked={communityType == "private"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={HiLockClosed} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr={1}>
                      Private
                    </Text>
                    <Text fontSize="8pt" color="gray.500" pt={1}>
                      Only approved users can view and submit to this community
                    </Text>
                  </Flex>
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>
        </Box>

        <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
          <Button
            variant="outline"
            height="30px"
            mr={3}
            onClick={props.handleClose}
          >
            Cancel
          </Button>
          <Button height="30px" onClick={() => {}}>
            Create Community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default CreateCommunityModal;
