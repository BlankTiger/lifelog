import { Divider } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { SetStateAction, useEffect, useState } from "react";
import { Entry, EntryProps } from "./Entry";

const LeftPanel = () => {
  const [entries, setEntries] = useState<EntryProps[]>([]);

  useEffect(() => {
    invoke("generate_from_file")
      .then((entries) => setEntries(entries as SetStateAction<EntryProps[]>))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="left-panel panel">
      {entries.map((entry) => {
        return (
          <>
            <Entry {...entry} />
            <Divider />
          </>
        );
      })}
    </div>
  );
}

export default LeftPanel;
