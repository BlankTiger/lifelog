import { Button } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { MouseEventHandler } from "react";

type Props = {
  colorMode: String,
  onClick?: MouseEventHandler 
};

export const ThemeToggler = ({ colorMode, onClick }: Props): JSX.Element => {
  return (
    <Button id="theme-toggler" onClick={onClick} rounded="15">
      {colorMode === "light" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
