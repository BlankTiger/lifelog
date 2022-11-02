import { Button, Flex } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

export enum CalendarView {
  daily = "Daily",
  weekly = "Weekly",
  monthly = "Monthly",
}

interface Props {
  title: CalendarView;
  onClick: MouseEventHandler;
}

export const CalendarViewSelector = ({ title, onClick }: Props) => {
  return (
    <Flex direction="row" justify="center">
      <Button onClick={onClick}>{title}</ Button>
    </ Flex>
  );
}
