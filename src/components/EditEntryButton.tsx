import { EditIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler;
}

export const EditEntryButton = ({ onClick }: Props) => {
  return <Button onClick={onClick}><EditIcon /></Button>;
}
