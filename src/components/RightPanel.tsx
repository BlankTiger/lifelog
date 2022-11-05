import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Timer, TimerProps } from "./Timer";
import { ActualTimer, ActualTimerProps } from "./ActualTimer";
import { ResumeButton } from "./ResumeButton";
import { PauseButton } from "./PauseButton";
import { useColorMode } from "@chakra-ui/react";
import { ThemeToggler } from "./ThemeToggler";
import { useElapsedTimeStore } from "../utils/GlobalState";

const RightPanel = () => {
  const [isRunning, setRunning] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const [pushResumeTime, pushStopTime] = useElapsedTimeStore(state =>
    [state.pushResumeTime, state.pushPauseTime]);

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

  return (
    <div className="right-panel panel">
      <Flex direction="row" gap="3vw">
        <Timer {...timerProps} />
        <ActualTimer {...timerPropsActual} />
      </Flex>
      <Flex direction="row" gap="3vw" align="center">
        <ResumeButton onClick={setResumed} />
        <PauseButton onClick={setPaused} />
      </Flex>
      <ThemeToggler onClick={toggleColorMode} colorMode={colorMode} />
    </div>
  );
}

export default RightPanel;
