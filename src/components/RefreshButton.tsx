import { Button } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler;
  flex: number;
};

export const RefreshButton = ({ flex, onClick }: Props) => {
  return <Button flex={flex} onClick={onClick}>Refresh</Button>;
};
