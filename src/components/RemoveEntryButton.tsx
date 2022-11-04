import { Button } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

interface Props {
  onClick: MouseEventHandler;
}

export const RemoveEntryButton = ({onClick}: Props) => {
  return <Button onClick={onClick}>{"Remove entry"}</Button>;
}
