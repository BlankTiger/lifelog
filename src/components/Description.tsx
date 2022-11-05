import { Checkbox, Flex, Text } from "@chakra-ui/react";

interface Props {
  description: string;
}

export const Description = ({ description }: Props) => {
  const generateLine = (content: string, isTodo: boolean) => {
    return isTodo ?
      <Flex direction="row" align="center">
        <Checkbox colorScheme="red" mx={2}>
          <Text mt={1}>{content.split("]")[1]}</Text>
        </Checkbox>
      </Flex>
      : <Flex direction="row">{content}</Flex>;
  }


  return <>{description.split("\\n").map((line) => {
    return generateLine(line, line.includes("- [ ]"));
  })}
  </>;
}
