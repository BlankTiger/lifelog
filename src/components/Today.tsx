import { Flex, Heading } from "@chakra-ui/react";

interface Props {
  today: string;
};

export const Today = ({ today }: Props) => {
  return (
    <Flex direction="row" justify="center">
      <Heading size="lg" bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text">
        {today}
      </Heading>
    </Flex>
  );
}
