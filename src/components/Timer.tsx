import { Flex, Heading } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { useCalendarEntriesStore, useShouldRefreshStore, useTodayStore, useElapsedTimeStore, useActualElapsedTimeStore } from "../utils/GlobalState";

export type TimerProps = {
  timerTitle: string,
};

export const Timer = ({ timerTitle }: TimerProps): JSX.Element => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shownTime, setShownTime] = useState("00:00");
  const [dailyEntries, setDailyEntries] = useState([]);
  const [shouldSaveStats, setShouldSaveStats] = useState(false);
  const [entries, currentEntry, currentEntryStart, currentEntryEnd, setCurrentEntry] = useCalendarEntriesStore(state =>
    [state.calendarEntries, state.currentEntry, state.currentEntryStart, state.currentEntryEnd, state.setCurrentEntry]);
  const shouldRefresh = useShouldRefreshStore(state => state.shouldRefresh);
  const todayShowable = useTodayStore(state => state.todayShowable);
  const [elapsedTime, setElapsedTime] = useElapsedTimeStore(state =>
    [state.elapsedTime, state.setElapsedTime]);
  const [actualElapsedTime,
    setActualElapsedTime,
    calculateActualElapsedTime,
    isRunning,
    setIsRunning,
    resumeTimes,
    pauseTimes,
    clearResumeTimes,
    clearPauseTimes] =
    useActualElapsedTimeStore(state =>
      [state.actualElapsedTime,
      state.setActualElapsedTime,
      state.calculateActualElapsedTime,
      state.isRunning,
      state.setIsRunning,
      state.resumeTimes,
      state.pauseTimes,
      state.clearResumeTimes,
      state.clearPauseTimes]);

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
    dailyEntries !== undefined ? dailyEntries.forEach(entry => {
      const start = new Date(entry["start"]).getTime();
      const end = new Date(entry["end"]).getTime();
      const now = new Date().getTime();
      const shouldBeActive = start < now && now < end;
      isActive.push(shouldBeActive);
      shouldBeActive ? setCurrentEntry(entry["id"], entry["start"], entry["end"]) : () => { };
    }) : {};
    const shouldAnyBeActive = !checker(isActive);
    shouldAnyBeActive ? () => { } : setCurrentEntry(0, "not_date", "not_date");

    setShouldSaveStats((new Date(currentEntryEnd).getTime() - Date.now()) / 1000 < 2);
    setElapsedTime(Date.now() - startDate.getTime());
    calculateActualElapsedTime();
    setSeconds(Math.floor(elapsedTime / 1000 % 60));
    setMinutes(Math.floor(elapsedTime / 1000 / 60 % 60));
    setHours(Math.floor(elapsedTime / 1000 / 60 / 60));
    if (currentEntryStart === "not_date") {
      setShownTime("00:00");
    } else {
      recalculateShownTime();
    }
  };

  interface Statistics {
    id: number,
    total_duration: number,
    total_actual_duration: number,
    efficiency: number,
    resume_times: Date[],
    pause_times: Date[],
  }
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const saveStatistics = async () => {
    if (currentEntry === 0) {
      return;
    }
    const statistics: Statistics = {
      id: currentEntry,
      total_duration: Math.floor(elapsedTime / 1000) + 2,
      total_actual_duration: actualElapsedTime + 2,
      efficiency: actualElapsedTime / Math.floor(elapsedTime / 1000),
      resume_times: resumeTimes,
      pause_times: pauseTimes,
    };
    await invoke("add_stats_for_date", { date: todayShowable, stats: statistics });
    const resetActualTimer = async () => {
      if (isRunning) {
        await sleep(2000);
        setIsRunning();
        setActualElapsedTime(0);
        clearResumeTimes();
        clearPauseTimes();
      }
    };
    resetActualTimer();
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    entries.then((entries: any) => setDailyEntries(entries[todayShowable]));
  }, [todayShowable, shouldRefresh]);

  useEffect(() => {
    const execute = shouldSaveStats ? async () => {
      await saveStatistics();
    } : () => { };
    execute();
  }, [shouldSaveStats]);

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
