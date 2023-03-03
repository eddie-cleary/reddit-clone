import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);

  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {props.selectedFile ? (
        <>
          <Image
            src={props.selectedFile}
            alt="Preview of the user's post image"
            maxWidth="400px"
            maxHeight="400px"
          />
          <Stack mt={4} direction="row">
            <Button height="28px" onClick={() => props.setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => props.setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => selectedFileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type="file"
            hidden
            onChange={props.onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
