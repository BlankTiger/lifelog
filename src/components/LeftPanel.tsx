import { Accordion, Spacer } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import React, { SetStateAction, useEffect, useState } from "react";
import { Entry } from "./Entry";
import { Today } from "./Today";
import { CalendarViewSelector, CalendarView } from "./CalendarViewSelector";

const LeftPanel = () => {
  let now = new Date().toISOString();
  let t_index = now.indexOf("T");

  const [dailyEntries, setDailyEntries] = useState({});
  const [calendarView, setCalendarView] = useState(CalendarView.daily);
  const today = now.substring(0, t_index);


  useEffect(() => {
    const generateDailyEntries = async () => {
      let calendarEntries = await invoke("generate_from_file")
        .then((entries) => {
          return entries;
        })
        .catch((error) => {
          console.log(error);
          return {};
        });

      setDailyEntries(calendarEntries as SetStateAction<{}>);
    };

    generateDailyEntries();
  }, []);

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

  return (
    <div className="left-panel panel">
      <Today today={today} />
      <Accordion allowToggle>
        {dailyEntries[today].map((entry) => {
          return (
            <React.Fragment key={entry.id}>
              <Entry {...entry} />
            </React.Fragment>
          );
        })}
      </Accordion>
      <Spacer />
      <CalendarViewSelector title={calendarView} onClick={changeCalendarView} />
    </div>
  );
}

export default LeftPanel;
