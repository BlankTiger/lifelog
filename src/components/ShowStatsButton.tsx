import { Button } from "@chakra-ui/react"
import { WebviewWindow } from "@tauri-apps/api/window";

interface Props { }

const showStats = () => {
  new WebviewWindow('stats', { title: "Statistics", url: "stats.html", height: 800, width: 600 });
};

export const ShowStatsButton = ({ }: Props) => {
  return <Button onClick={showStats}>{"Show statistics"}</Button>;
}
