import { AccordionButton, Text, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Heading, Divider, Checkbox } from "@chakra-ui/react";
import { MinusIcon } from "@chakra-ui/icons";
import { CalendarEntry } from "./CalendarEntry";
import { useCalendarEntriesStore } from "../utils/GlobalState";
import { useEffect, useState } from "react";
import { Description } from "./Description";

export const Entry = (props: CalendarEntry): JSX.Element => {
  const [currentEntry, pushEntryForRemoval, popEntryForRemoval] = useCalendarEntriesStore(state =>
    [state.currentEntry, state.pushEntryForRemoval, state.popEntryForRemoval, state.entriesForRemoval]);
  const [active, setActive] = useState(false);
  const desc = props.description;

  const start = new Date(props.start);
  const startHours = start.getHours() >= 10 ? start.getHours() : "0" + start.getHours();
  const startMinutes = start.getMinutes() >= 10 ? start.getMinutes() : "0" + start.getMinutes();

  const end = new Date(props.end);
  const endHours = end.getHours() >= 10 ? end.getHours() : "0" + end.getHours();
  const endMinutes = end.getMinutes() >= 10 ? end.getMinutes() : "0" + end.getMinutes();

  const startTime = startHours + ":" + startMinutes;
  const endTime = endHours + ":" + endMinutes;

  const onCheckboxChanged = (ev: any) => {
    ev.target.checked ? pushEntryForRemoval(props.id) : popEntryForRemoval(props.id);
  }

  useEffect(() => {
    setActive(props.id === currentEntry);
  }, [currentEntry]);

  return (
    <AccordionItem
      key={props.id}
      border="1px"
      bgGradient={active ? "linear(to-l, #DA4453, #89216B)" : ""}
      rounded={15}>
      <Heading>
        <AccordionButton fontWeight="bold">
          <Box flex="1" textAlign="left">
            <Flex direction="row" justify="space-between" align="center">
              <Checkbox onChange={onCheckboxChanged}
                mb={1}
                mr={1.5}
                size="md"
                colorScheme="red"
                icon={<MinusIcon />}
              />
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
          <Description description={desc} />
          <br />
          <Flex direction="column" justify="space-between" mt={5}>
            <>
              <Flex direction="row" justify="space-between">
                <>
                  <Text fontWeight="semibold">{"Location: "}</Text>
                  {props.location}
                </>
              </Flex>
              <Divider my={2} colorScheme="teal" />
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
