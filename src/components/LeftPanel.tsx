import { Accordion, Box, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Entry } from "./Entry";
import { Today } from "./Today";
import { CalendarViewSelector, CalendarView } from "./CalendarViewSelector";
import { useDailyEntriesStore, useTodayStore } from "../utils/GlobalState";

const LeftPanel = () => {
  const [dailyEntries, setDailyEntries] = useState([]);
  const [calendarView, setCalendarView] = useState(CalendarView.daily);
  const today = useTodayStore(state => state.today);
  const entries = useDailyEntriesStore(state => state.dailyEntries);

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

  useEffect(() => {
    entries.then(entries => setDailyEntries(entries[today]));
  }, []);

  return (
    <div className="left-panel panel">
      <Today today={today} />
      <Accordion allowToggle>
        {
          dailyEntries.map(entry => {
            return (
              <React.Fragment key={entry.id}>
                <Entry {...entry} />
                <Box mt={2} />
              </React.Fragment>
            );
          })
        }
      </Accordion>
      <Spacer />
      <CalendarViewSelector title={calendarView} onClick={changeCalendarView} />
    </div>
  );
}

export default LeftPanel;
