import { Accordion, Box, Button, Flex, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Entry } from "./Entry";
import { Today } from "./Today";
import { CalendarViewSelector, CalendarView } from "./CalendarViewSelector";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useCalendarEntriesStore, useShouldRefreshStore, useTodayStore } from "../utils/GlobalState";
import { CalendarEntry } from "./CalendarEntry";
import { RefreshButton } from "./RefreshButton";

const LeftPanel = () => {
  const [dailyEntries, setDailyEntries] = useState<CalendarEntry[]>([]);
  const [calendarView, setCalendarView] = useState(CalendarView.daily);
  const [today, todayShowable, setToday] = useTodayStore(state =>
    [state.today, state.todayShowable, state.setToday]);
  const entries = useCalendarEntriesStore(state => state.calendarEntries);
  const refreshEntries = useCalendarEntriesStore(state => state.refreshEntries);
  const [shouldRefresh, setShouldRefresh] = useShouldRefreshStore(state =>
    [state.shouldRefresh, state.setShouldRefresh]);


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

  const refreshCalendarEntries = () => {
    setShouldRefresh();
    refreshEntries();
  }

  useEffect(() => {
    entries.then((entries: any) => setDailyEntries(entries[todayShowable]));
  }, [today, shouldRefresh]);

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
      <Flex direction="row" align="center" justify="space-evenly">
        <Box flex={0.1} />
        <CalendarViewSelector flex={0.5} title={calendarView} onClick={changeCalendarView} />
        <Box flex={0.1} />
        <RefreshButton flex={0.5} onClick={refreshCalendarEntries} />
        <Box flex={0.1} />
      </Flex>
    </div>
  );
}

export default LeftPanel;
