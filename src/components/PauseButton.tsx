import { Button } from "@chakra-ui/react"
import { MouseEventHandler } from "react";

type PauseButtonProps = {
  onClick?: MouseEventHandler
};

export const PauseButton = ({ onClick }: PauseButtonProps): JSX.Element => {
  return <Button onClick={onClick}>{"Pause"}</Button>;
}
