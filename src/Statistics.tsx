import { Center, Flex, Spacer, Stat, Text, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, Button, Divider, Heading } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { SetStateAction, useEffect, useState } from "react";
import { useTodayStore } from "./utils/GlobalState";
import { sleep, Statistics } from "./components/Timer";
import { Today } from "./components/Today";
import "./App.css";
import { CalendarEntry } from "./components/CalendarEntry";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

interface EntryWithStats {
  stats: Statistics;
  entry: CalendarEntry;
}

const Stats = () => {
  const [entriesWithStats, setEntriesWithStats] = useState<EntryWithStats[]>([] as EntryWithStats[]);
  const [today, todayShowable, setToday] = useTodayStore(state =>
    [state.today, state.todayShowable, state.setToday]);
  const [expectedHours, setExpectedIncome] = useState(0.0);
  const [actualHours, setActualIncome] = useState(0.0);

  const setNextDay = () => {
    let nextDay = new Date(today.setHours(today.getHours() + 24));
    setToday(nextDay);
  }

  const setPrevDay = () => {
    let prevDay = new Date(today.setHours(today.getHours() - 24));
    setToday(prevDay);
  }

  const backToCurrentDate = () => {
    setToday(new Date());
  }

  useEffect(() => {
    const collectedEntriesWithStats: EntryWithStats[] = [];
    (async () => {
      const stats: Awaited<Statistics[]> = await Promise.resolve(
        invoke("get_stats_for_date", { date: todayShowable })
          .then(statistics => statistics)
          .catch(error => {
            console.error(error);
            return [] as Statistics[]
          }) as Promise<Statistics[]>);

      let income: Awaited<number[]> = await invoke("calculate_work_hours");
      setExpectedIncome(income.pop() as SetStateAction<number>);
      setActualIncome(income.pop() as SetStateAction<number>);

      stats.map(async (stat) => {
        const foundEntry: Awaited<CalendarEntry> = await Promise.resolve(
          invoke("get_entry_by_id", { id: stat.id })
            .then(entry => entry)
            .catch(error => {
              console.error(error);
              return {} as CalendarEntry;
            }) as Promise<CalendarEntry>);

        const entryWithStats: EntryWithStats = {
          stats: stat,
          entry: foundEntry,
        };
        collectedEntriesWithStats.push(entryWithStats);
      })
    })().then(async () => { await sleep(60); setEntriesWithStats(collectedEntriesWithStats); });
  }, [todayShowable]);

  const formatTime = (secs: number) => {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor((secs - (hours * 3600)) / 60);
    let seconds = Math.floor(secs - (hours * 3600) - (minutes * 60));

    let shownHours = hours >= 10 ? hours : "0" + hours;
    let shownMinutes = minutes >= 10 ? minutes : "0" + minutes;
    let shownSeconds = seconds >= 10 ? seconds : "0" + seconds;
    return `${shownHours}:${shownMinutes}:${shownSeconds}`;
  }

  return (
    <Flex direction="column" height="100vh" width="100vw" align="center">
      <Spacer />
      <Flex className="day-switcher" direction="row" width="80vw" align="center" gap="4vw" justify="center">
        <Button size="sm" onClick={setPrevDay} colorScheme="red">
          <ArrowLeftIcon />
        </Button>
        <Today today={todayShowable} onClick={backToCurrentDate} />
        <Button size="sm" onClick={setNextDay} colorScheme="red">
          <ArrowRightIcon />
        </Button>
      </Flex>
      <Spacer />
      <StatGroup fontSize="lg" className="stats-group">
        {entriesWithStats.map(entryWithStats =>
          <Stat>
            <Flex direction="column" align="center">
              <StatLabel width={60}>
                <Text align="center" fontWeight="bold" fontSize="md">
                  {entryWithStats.entry.summary}
                </Text>
              </StatLabel>
              {
                formatTime(entryWithStats.stats.total_actual_duration)
                + " / " +
                formatTime(entryWithStats.stats.total_duration)
              }
              <StatHelpText>
                <Flex direction="row" align="center">
                  <StatArrow type={entryWithStats.stats.efficiency < 75 ? "decrease" : "increase"} />
                  {entryWithStats.stats.efficiency.toPrecision(4) + "%"}
                </Flex>
              </StatHelpText>
            </Flex>
          </Stat>
        )}
      </StatGroup>
      <Spacer />
      <Divider />
      <Flex direction="row" align="start" justify="center">
        <Flex direction="column" width="50vw" align="center" my={5} justify="center">
          <Stat>
            <Flex direction="column" align="center">
              <StatLabel fontWeight="semibold">{"Expected income"}</StatLabel>
              <StatNumber fontSize="md">{(expectedHours * 28).toFixed(2)}{" PLN"}</StatNumber>
              <StatHelpText>
                <Flex direction="row" align="center">
                  <StatArrow type="increase" />
                  {expectedHours.toFixed(0) + " h"}
                </Flex>
              </StatHelpText>
            </Flex>
          </Stat>
          <Divider my={2} mt={4} />
          <Text fontWeight="semibold" fontSize="sm">{"Resume times"}</Text>
          {entriesWithStats.map(entryWithStats => {
            return entryWithStats.stats.resume_times.map(time => {
              const shownTime = new Date(time).toLocaleString().split(",")[1];
              return <Text>{shownTime}</Text>
            })
          })}
        </Flex>
        <Flex height="100%">
          <Divider orientation="vertical" />
        </Flex>
        <Flex direction="column" width="50vw" align="center" my={5} justify="center">
          <Stat>
            <Flex direction="column" align="center">
              <StatLabel fontWeight="semibold">{"Actual income"}</StatLabel>
              <StatNumber fontSize="md">{(actualHours * 28).toFixed(2)}{" PLN"}</StatNumber>
              <StatHelpText>
                <Flex direction="row" align="center">
                  <StatArrow type="decrease" />
                  {actualHours.toFixed(0) + " h"}
                </Flex>
              </StatHelpText>
            </Flex>
          </Stat>
          <Divider my={2} mt={4} />
          <Text fontWeight="semibold" fontSize="sm">{"Pause times"}</Text>
          {entriesWithStats.map(entryWithStats => {
            return entryWithStats.stats.pause_times.map(time => {
              const shownTime = new Date(time).toLocaleString().split(",")[1];
              return <Text>{shownTime}</Text>
            })
          })}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Stats;
