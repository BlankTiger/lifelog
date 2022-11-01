import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Heading } from "@chakra-ui/react";

export interface EntryProps {
  id: Number;
  title: String;
  desc: String;
  start_time: String;
  end_time: String;
}

export const Entry = (props: EntryProps): JSX.Element => {
  return (
    <AccordionItem key="{props.title}">
      <Heading>
        <AccordionButton fontWeight="bold">
          <Box flex="1" textAlign="left">
            {props.title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel>
        {props.desc}
      </AccordionPanel>
    </AccordionItem >
  );
}
