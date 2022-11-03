import { Flex, Heading } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface Props {
  today: string;
  onClick: MouseEventHandler;
};

export const Today = ({ today, onClick }: Props) => {
  return (
    <Heading cursor="pointer" mt={2.5} onClick={onClick} size="lg" bgGradient="linear(to-l, #7928CA, #FF0080)" bgClip="text">
      {today}
    </Heading>
  );
}
