import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler;
}

export const AddEntryButton = ({ onClick }: Props) => {
  return <Button onClick={onClick}><AddIcon /></Button>;
}
