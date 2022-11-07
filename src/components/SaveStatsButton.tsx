import { Button } from "@chakra-ui/react"
import { useActualElapsedTimeStore, useCalendarEntriesStore, useElapsedTimeStore, useTodayStore } from "../utils/GlobalState";
import { sleep, Statistics } from "./Timer";
import { invoke } from "@tauri-apps/api";

interface Props {

}


export const SaveStatsButton = ({ }: Props) => {
  const currentEntry = useCalendarEntriesStore(state => state.currentEntry);
  const elapsedTime = useElapsedTimeStore(state => state.elapsedTime);
  const todayShowable = useTodayStore(state => state.todayShowable);
  const [
    actualElapsedTime,
    resumeTimes,
    pauseTimes,
  ] = useActualElapsedTimeStore(
    state =>
      [
        state.actualElapsedTime,
        state.resumeTimes,
        state.pauseTimes,
      ]
  );

  const saveStatistics = async () => {
    if (currentEntry === 0) {
      return;
    }
    const statistics: Statistics = {
      id: currentEntry,
      total_duration: elapsedTime / 1000 + 2,
      total_actual_duration: actualElapsedTime + 2,
      efficiency: 100 * (actualElapsedTime / (elapsedTime / 1000)),
      resume_times: resumeTimes,
      pause_times: pauseTimes,
    };
    await invoke("add_stats_for_date", { date: todayShowable, stats: statistics });
  };

  return <Button onClick={saveStatistics}>{"Save statistics"}</Button>;
}
