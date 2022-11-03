import create from "zustand";
import { invoke } from "@tauri-apps/api";

let now = new Date().toLocaleString("pl-PL");
let day = new Date().getDay();
const today = day < 10 ? "0" + now.split(",")[0] : now.split(",")[0];

const generateDailyEntries = async () => {
  return await invoke("generate_from_file")
    .then(entries => entries)
    .catch((error) => {
      console.log(error);
      return {};
    })
};

interface CurrentEntryState {
  currentEntry: number;
  currentEntryStart: string;
  setCurrentEntry: (newEntry: number, newEntryStart: string) => void;
}

export const useEntryStore = create<CurrentEntryState>()((set) => ({
  currentEntry: 0,
  currentEntryStart: new Date().toLocaleString(),
  setCurrentEntry: (newEntry, newEntryStart) =>
    set(() => ({ currentEntry: newEntry, currentEntryStart: newEntryStart })),
}));

interface DailyEntriesState {
  dailyEntries: Object;
  setDailyEntries: (newEntries: Object) => void;
}

export const useDailyEntriesStore = create<DailyEntriesState>()((set) => ({
  dailyEntries: generateDailyEntries(),
  setDailyEntries: (newEntries) => set(() => ({ dailyEntries: newEntries })),
}));

interface TodayState {
  today: string;
  setToday: (newToday: string) => void;
}

export const useTodayStore = create<TodayState>()((set) => ({
  today: today,
  setToday: (newToday) => set(() => ({ today: newToday })),
}));

interface ElapsedTimeState {
  elapsedTime: number;
  resumeTimes: Date[];
  pauseTimes: Date[];
  setElapsedTime: (newElapsedTime: number) => void;
  pushResumeTime: (resumeTime: Date) => void;
  clearResumeTimes: () => void;
  pushPauseTime: (pauseTime: Date) => void;
  clearPauseTimes: () => void;
}

export const useElapsedTimeStore = create<ElapsedTimeState>()((set) => ({
  elapsedTime: 0,
  resumeTimes: [],
  pauseTimes: [],
  setElapsedTime: (newElapsedTime) => set(() => ({ elapsedTime: newElapsedTime })),
  pushResumeTime: (resumeTime) => set((state) => ({ resumeTimes: [...state.resumeTimes, resumeTime] })),
  clearResumeTimes: () => set(() => ({ resumeTimes: [] })),
  pushPauseTime: (pauseTime) => set((state) => ({ pauseTimes: [...state.pauseTimes, pauseTime] })),
  clearPauseTimes: () => set(() => ({ pauseTimes: [] })),
}));

