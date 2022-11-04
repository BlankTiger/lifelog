import { Button } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

export enum CalendarView {
  daily = "Daily",
  weekly = "Weekly",
  monthly = "Monthly",
}

interface Props {
  title: CalendarView;
  flex: number;
  onClick: MouseEventHandler;
}

export const CalendarViewSelector = ({ flex, title, onClick }: Props) => {
  return (
    <Button flex={flex} onClick={onClick}>{title}</ Button>
  );
}
