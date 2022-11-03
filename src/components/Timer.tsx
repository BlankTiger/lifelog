import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDailyEntriesStore, useEntryStore, useTodayStore } from "../utils/GlobalState";

export type TimerProps = {
  timerTitle: string,
};

export const Timer = ({ timerTitle }: TimerProps): JSX.Element => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shownTime, setShownTime] = useState("00:00");
  const [dailyEntries, setDailyEntries] = useState([]);
  const [currentEntryStart, setCurrentEntry] = useEntryStore(state =>
    [state.currentEntryStart, state.setCurrentEntry]);
  const entries = useDailyEntriesStore(state => state.dailyEntries);
  const today = useTodayStore(state => state.today);

  const recalculateShownTime = () => {
    let shownHours = hours > 0 ? hours < 10 ? "0" + hours + ":" : hours + ":" : "";
    let shownMinutes = minutes < 10 ? "0" + minutes : minutes;
    let shownSeconds = seconds < 10 ? "0" + seconds : seconds;
    let time = `${shownHours}${shownMinutes}:${shownSeconds}`;
    setShownTime(time);
  };

  const checker = (arr: boolean[]) => arr.every(v => v === false);

  const getTime = () => {
    let startDate = new Date(currentEntryStart);
    let isActive: boolean[] = [];
    dailyEntries.forEach(entry => {
      const start = new Date(entry["start"]).getTime();
      const end = new Date(entry["end"]).getTime();
      const now = new Date().getTime();
      const shouldBeActive = start < now && now < end;
      isActive.push(shouldBeActive);
      shouldBeActive ? setCurrentEntry(entry["id"], entry["start"]) : () => { };
    });
    const shouldAnyBeActive = !checker(isActive);
    shouldAnyBeActive ? () => { } : setCurrentEntry(0, "not_date");

    setElapsedTime(Date.now() - startDate.getTime());
    setSeconds(Math.floor(elapsedTime / 1000 % 60));
    setMinutes(Math.floor(elapsedTime / 1000 / 60 % 60));
    setHours(Math.floor(elapsedTime / 1000 / 60 / 60));
    if (currentEntryStart === "not_date") {
      setShownTime("00:00");
    } else {
      recalculateShownTime();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    entries.then(entries => setDailyEntries(entries[today]));
  }, []);

  return (
    <>
      <Flex direction="column" align="center" gap="3vh">
        <Heading>
          {timerTitle}
        </Heading>
        <Heading size="md">
          {shownTime === "NaN:NaN" ? "00:00" : shownTime}
        </Heading>
      </Flex>
    </>
  );
}
