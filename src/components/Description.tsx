import { Checkbox, Flex } from "@chakra-ui/react";

interface Props {
  description: string;
}

export const Description = ({ description }: Props) => {
  const generateLine = (content: string, isTodo: boolean) => {
    return isTodo ?
      <Flex direction="row" align="center">
        <Checkbox colorScheme="red" mx={2}>
          {content.split("]")[1]}
        </Checkbox>
      </Flex>
      : <Flex direction="row">{content}</Flex>;
  }


  return <>{description.split("\n").map((line) => {
    return generateLine(line, line.includes("- [ ]"));
  })}
  </>;
}
