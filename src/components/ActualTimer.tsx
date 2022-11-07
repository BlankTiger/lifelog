import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useActualElapsedTimeStore } from "../utils/GlobalState";
import { TimerProps } from "./Timer";

export const ActualTimer = ({ timerTitle }: TimerProps): JSX.Element => {
  const actualElapsedTime = useActualElapsedTimeStore(state => state.actualElapsedTime);
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

  useEffect(() => {
    setSeconds(Math.floor(actualElapsedTime % 60));
    setMinutes(Math.floor(actualElapsedTime / 60 % 60));
    setHours(Math.floor(actualElapsedTime / 60 / 60));
    recalculateShownTime();
    if (actualElapsedTime === 0) {
      setShownTime("00:00");
    }
  }, [actualElapsedTime]);

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
