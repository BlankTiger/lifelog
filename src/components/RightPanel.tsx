import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Timer, TimerProps } from "./Timer";
import { ActualTimer, ActualTimerProps } from "./ActualTimer";
import { ResumeButton } from "./ResumeButton";
import { PauseButton } from "./PauseButton";
import { useColorMode } from "@chakra-ui/react";
import { ThemeToggler } from "./ThemeToggler";
import { useShouldRefreshStore, useCalendarEntriesStore, useElapsedTimeStore, useTodayStore } from "../utils/GlobalState";
import { AddEntryButton } from "./AddEntryButton";
import { RemoveEntryButton } from "./RemoveEntryButton";

const RightPanel = () => {
  const [isRunning, setRunning] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const setShouldRefresh = useShouldRefreshStore(state => state.setShouldRefresh);
  const [pushResumeTime, pushStopTime] = useElapsedTimeStore(state =>
    [state.pushResumeTime, state.pushPauseTime]);
  const [addCalendarEntry, removeCalendarEntry] = useCalendarEntriesStore(state =>
    [state.addCalendarEntry, state.removeCalendarEntry]
  );
  const today = useTodayStore(state =>
    state.todayShowable
  );

  const setResumed = () => {
    if (!isRunning) {
      pushResumeTime(new Date());
    }
    setRunning(true);
  }

  const setPaused = () => {
    if (isRunning) {
      pushStopTime(new Date());
    }
    setRunning(false);
  }

  let timerProps = {
    timerTitle: "Elapsed",
  } as TimerProps;

  let timerPropsActual = {
    timerTitle: "Actual",
    isRunning: isRunning,
  } as ActualTimerProps;

  const addEntry = () => {
    setShouldRefresh();
    let end = new Date().setHours(23, 0, 0);
    let entry = {
      id: 111111,
      start: new Date(),
      end: new Date(end),
      summary: "new item",
      description: "test",
      location: "Home",
      status: "Confirmed",
      entry_type: "Work",
    };
    addCalendarEntry(today, entry);
  };

  const removeEntry = () => {
    setShouldRefresh();
    removeCalendarEntry(111111);
  }

  return (
    <div className="right-panel panel">
      <Flex direction="row" gap="3vw">
        <Timer {...timerProps} />
        <ActualTimer {...timerPropsActual} />
      </Flex>
      <Flex direction="column" gap="1vw" align="center">
        <ResumeButton onClick={setResumed} />
        <PauseButton onClick={setPaused} />
        <AddEntryButton onClick={addEntry} />
        <RemoveEntryButton onClick={removeEntry} />
      </Flex>
      <ThemeToggler onClick={toggleColorMode} colorMode={colorMode} />
    </div>
  );
}

export default RightPanel;
