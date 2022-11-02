import { Flex, Heading } from "@chakra-ui/react";

interface Props {
  today: string;
};

export const Today = ({ today }: Props) => {
  return (
    <Flex direction="row" justify="center">
      <Heading size="lg">
        {today}
      </Heading>
    </Flex>
  );
}
