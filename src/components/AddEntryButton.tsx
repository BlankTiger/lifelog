import { Button } from "@chakra-ui/react"
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler;
}

export const AddEntryButton = ({ onClick }: Props) => {
  return <Button onClick={onClick}>{"Add entry"}</Button>;
}
