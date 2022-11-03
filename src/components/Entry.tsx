import { AccordionButton, Text, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Heading, Divider } from "@chakra-ui/react";
import { CalendarEntry } from "./CalendarEntry";
import { useEntryStore } from "../utils/GlobalState";
import { useEffect, useState } from "react";

export const Entry = (props: CalendarEntry): JSX.Element => {
  const currentEntry = useEntryStore((state) => state.currentEntry);
  const [active, setActive] = useState(false);
  const desc = props.description.replace("\\n", "\n");

  const start = new Date(props.start);
  const startHours = start.getHours() >= 10 ? start.getHours() : "0" + start.getHours();
  const startMinutes = start.getMinutes() >= 10 ? start.getMinutes() : "0" + start.getMinutes();

  const end = new Date(props.end);
  const endHours = end.getHours() >= 10 ? end.getHours() : "0" + end.getHours();
  const endMinutes = end.getMinutes() >= 10 ? end.getMinutes() : "0" + end.getMinutes();

  const startTime = startHours + ":" + startMinutes;
  const endTime = endHours + ":" + endMinutes;

  useEffect(() => {
    setActive(props.id === currentEntry);
  }, [currentEntry]);


  return (
    <AccordionItem key={props.id} bgGradient={active ? "linear(to-l, #7928CA, #FF0080)" : ""} rounded={15}>
      <Heading>
        <AccordionButton fontWeight="bold">
          <Box flex="1" textAlign="left">
            <Flex direction="row" justify="flex-end">
              <Box flex="2" textAlign="left">
                {props.summary}
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
          <br />
          <Flex direction="column" justify="space-between" mt={3}>
            <>
              <Flex direction="row" justify="space-between">
                <>
                  <Text fontWeight="semibold">{"Location: "}</Text>
                  {props.location}
                </>
              </Flex>
              <Divider my={2} colorScheme="teal"/>
              <Flex direction="row" justify="space-between">
                <>
                  <Text fontWeight="semibold"> {"Category: "}</Text>
                  {props.entry_type}
                </>
              </Flex>
            </>
          </Flex>
        </div>
      </AccordionPanel>
    </AccordionItem >
  );
}
