import { Divider, Flex, Spacer } from "@chakra-ui/react";
import { Timer, TimerProps } from "./Timer";
import { ActualTimer } from "./ActualTimer";
import { ResumeButton } from "./ResumeButton";
import { PauseButton } from "./PauseButton";
import { useColorMode } from "@chakra-ui/react";
import { ThemeToggler } from "./ThemeToggler";
import { useActualElapsedTimeStore } from "../utils/GlobalState";
import { SaveStatsButton } from "./SaveStatsButton";
import { ShowStatsButton } from "./ShowStatsButton";

const RightPanel = () => {
  const [isRunning, setIsRunning] = useActualElapsedTimeStore(state =>
    [state.isRunning, state.setIsRunning]);
  const { colorMode, toggleColorMode } = useColorMode();
  const [pushResumeTime, pushStopTime] = useActualElapsedTimeStore(state =>
    [state.pushResumeTime, state.pushPauseTime]);

  const setResumed = () => {
    if (!isRunning) {
      pushResumeTime(new Date());
      setIsRunning();
    }
  }

  const setPaused = () => {
    if (isRunning) {
      pushStopTime(new Date());
      setIsRunning();
    }
  }

  let timerProps = {
    timerTitle: "Elapsed",
  } as TimerProps;

  let timerPropsActual = {
    timerTitle: "Actual",
  } as TimerProps;

  return (
    <div className="right-panel panel">
      <Spacer />
      <Flex direction="row" gap="3vw">
        <Timer {...timerProps} />
        <ActualTimer {...timerPropsActual} />
      </Flex>
      <Flex direction="row" gap="3vw" mt={50} align="center">
        <ResumeButton onClick={setResumed} />
        <PauseButton onClick={setPaused} />
      </Flex>
      <Spacer />
      <Spacer />
      <Divider />
      <Flex direction="row" gap="3vw" align="center">
        <SaveStatsButton />
        <ShowStatsButton />
      </Flex>
      <ThemeToggler onClick={toggleColorMode} colorMode={colorMode} />
    </div>
  );
}

export default RightPanel;
