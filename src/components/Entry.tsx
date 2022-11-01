import { Button } from "@chakra-ui/react";

export interface EntryProps {
  title: String;
  desc: String;
  start_time: String;
  end_time: String;
}

export const Entry = (props: EntryProps): JSX.Element => {
  return <Button colorScheme="teal" size="sm">{props.title + " " + props.start_time}</Button>;
}
