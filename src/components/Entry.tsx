import { AccordionButton, Text, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Heading } from "@chakra-ui/react";
import { CalendarEntry } from "./CalendarEntry";

export const Entry = (props: CalendarEntry): JSX.Element => {
  const desc = props.desc.replace("\\n", "\n");

  const start = new Date(props.start);
  const startHours = start.getHours() > 10 ? start.getHours() : "0" + start.getHours();
  const startMinutes = start.getMinutes() > 10 ? start.getMinutes() : "0" + start.getMinutes();

  const end = new Date(props.end);
  const endHours = end.getHours() > 10 ? end.getHours() : "0" + end.getHours();
  const endMinutes = end.getMinutes() > 10 ? end.getMinutes() : "0" + end.getMinutes();

  const startTime = startHours + ":" + startMinutes;
  const endTime = endHours + ":" + endMinutes;

  return (
    <AccordionItem key={props.id}>
      <Heading>
        <AccordionButton fontWeight="bold">
          <Box flex="1" textAlign="left">
            <Flex direction="row" justify="flex-end">
              <Box flex="1" textAlign="left">
                {props.title}
              </Box>
              <Box flex="1" textAlign="right">
                {startTime}{" - "}{endTime}
              </Box>
            </Flex>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel>
        <div className="display-linebreak">
          {desc}
        </div>
      </AccordionPanel>
    </AccordionItem >
  );
}
