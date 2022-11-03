import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useElapsedTimeStore } from "../utils/GlobalState";

export type ActualTimerProps = {
  timerTitle: string,
  isRunning: boolean,
};

export const ActualTimer = ({ timerTitle, isRunning }: ActualTimerProps): JSX.Element => {
  const [elapsedTime, setElapsedTime] = useElapsedTimeStore(state =>
    [state.elapsedTime, state.setElapsedTime])
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [shownTime, setShownTime] = useState("00:00");

  const recalculateShownTime = () => {
    let shownHours = hours > 0 ? hours > 10 ? "0" + hours + ":" : hours + ":" : "";
    let shownMinutes = minutes < 10 ? "0" + minutes : minutes;
    let shownSeconds = seconds < 10 ? "0" + seconds : seconds;
    let time = `${shownHours}${shownMinutes}:${shownSeconds}`;
    setShownTime(time);
  };

  const getTime = () => {
    if (isRunning) {
      setElapsedTime(elapsedTime + 1);
      setSeconds(Math.floor(elapsedTime % 60));
      setMinutes(Math.floor(elapsedTime / 60 % 60));
      setHours(Math.floor(elapsedTime / 60 / 60));
      recalculateShownTime();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  });


  return (
    <>
      <Flex direction="column" align="center" gap="3vh">
        <Heading>
          {timerTitle}
        </Heading>
        <Heading size="md">
          {shownTime}
        </Heading>
      </Flex>
    </>
  );
}
