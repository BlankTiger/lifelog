import { Accordion, Box, Button, Flex, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Entry } from "./Entry";
import { Today } from "./Today";
import { CalendarViewSelector, CalendarView } from "./CalendarViewSelector";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useDailyEntriesStore, useTodayStore } from "../utils/GlobalState";
import { CalendarEntry } from "./CalendarEntry";

const LeftPanel = () => {
  const [dailyEntries, setDailyEntries] = useState<CalendarEntry[]>([]);
  const [calendarView, setCalendarView] = useState(CalendarView.daily);
  const [today, todayShowable, setToday] = useTodayStore(state =>
    [state.today, state.todayShowable, state.setToday]);
  const entries: any = useDailyEntriesStore(state => state.dailyEntries);


  const setNextDay = () => {
    let nextDay = new Date(today.setHours(today.getHours() + 24));
    setToday(nextDay);
  }

  const setPrevDay = () => {
    let prevDay = new Date(today.setHours(today.getHours() - 24));
    setToday(prevDay);
  }

  const backToCurrentDate = () => {
    setToday(new Date());
  }

  const changeCalendarView = () => {
    let newCalendarView = CalendarView.daily;
    if (calendarView === CalendarView.daily) {
      newCalendarView = CalendarView.weekly;
    } else if (calendarView === CalendarView.weekly) {
      newCalendarView = CalendarView.monthly;
    }
    setCalendarView(newCalendarView);
    console.log(calendarView);
  }

  type EntriesObject = {
    [key: string]: []
  }

  useEffect(() => {
    entries.then((entries: EntriesObject) => setDailyEntries(entries[todayShowable]));
  }, [today]);

  return (
    <div className="left-panel panel">
      <Flex direction="row" justify="space-between" align="center">
        <Button size="sm" onClick={setPrevDay} colorScheme="red">
          <ArrowLeftIcon />
        </Button>
        <Today today={todayShowable} onClick={backToCurrentDate} />
        <Button size="sm" onClick={setNextDay} colorScheme="red">
          <ArrowRightIcon />
        </Button>
      </Flex>
      <Accordion allowToggle mt={3}>
        {dailyEntries !== undefined ?
          dailyEntries.map(entry => {
            return (
              <React.Fragment>
                <Entry {...entry} />
                <Box mt={2} />
              </React.Fragment>
            );
          })
          :
          ""
        }
      </Accordion>
      <Spacer />
      <CalendarViewSelector title={calendarView} onClick={changeCalendarView} />
    </div>
  );
}

export default LeftPanel;
