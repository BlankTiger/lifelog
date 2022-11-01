import { Button } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

type ResumeButtonProps = {
  onClick?: MouseEventHandler 
};

export const ResumeButton = ({ onClick }: ResumeButtonProps): JSX.Element => {
  return <Button onClick={onClick}>{"Resume"}</Button>;
}
