import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export type TimerProps = {
  timerTitle: String,
  startTime: String,
  isRunning: Boolean,
};

export const Timer = (props: TimerProps): JSX.Element => {
  const [timePassed, setTimePassed] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);


  const getTime = () => {
    let startDate = new Date(props.startTime);

    let timePassed = (Date.now() - startDate.getTime());
    setSeconds(Math.floor(timePassed / 1000 % 60));
    setMinutes(Math.floor(timePassed / 1000 / 60 % 60));
    setHours(Math.floor(timePassed / 1000 / 60 / 60));
  };

  useEffect(() => {
    if (props.isRunning) {
      const interval = setInterval(() => getTime(), 1000);
      return () => clearInterval(interval);
    }
  }, [props.isRunning]);

  let shownHours = hours > 0 ? hours > 10 ? "0" + hours + ":" : hours + ":" : "";
  let shownMinutes = minutes < 10 ? "0" + minutes : minutes;
  let time = `${shownHours}${shownMinutes}:${seconds < 10 ? "0" + seconds : seconds}`;

  return (
    <>
      <Flex direction="column" align="center" gap="3vh">
        <Heading>
          {props.timerTitle}
        </Heading>
        <Heading size="md">
          {time}
        </Heading>
      </Flex>
    </>
  );
}
