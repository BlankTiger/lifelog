import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Timer, TimerProps } from "./Timer";
import { ActualTimer, ActualTimerProps } from "./ActualTimer";
import { ResumeButton } from "./ResumeButton";
import { PauseButton } from "./PauseButton";
import { useColorMode } from "@chakra-ui/react";
import { ThemeToggler } from "./ThemeToggler";

const RightPanel = () => {
  const [isRunning, setRunning] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  const setResumed = () => {
    setRunning(true);
  }

  const setPaused = () => {
    setRunning(false);
  }

  let timerProps = {
    timerTitle: "Elapsed",
    startTime: "2022-11-01T20:50:00.511Z",
  } as TimerProps;

  let timerPropsActual = {
    timerTitle: "Actual",
    isRunning: isRunning,
  } as ActualTimerProps;

  return (
    <>
      <div className="right-panel panel">
        <Flex direction="row" gap="3vw">
          <Timer {...timerProps} />
          <ActualTimer {...timerPropsActual} />
        </Flex>
        <Flex direction="row" gap="3vw">
          <ResumeButton onClick={setResumed} />
          <PauseButton onClick={setPaused} />
        </Flex>
        <ThemeToggler onClick={toggleColorMode} colorMode={colorMode} />
      </div>
    </>
  );
}

export default RightPanel;
