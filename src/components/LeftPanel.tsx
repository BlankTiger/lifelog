import { Accordion, Divider } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import React, { SetStateAction, useEffect, useState } from "react";
import { Entry, EntryProps } from "./Entry";

const LeftPanel = () => {
  const [entries, setEntries] = useState<EntryProps[]>([]);

  useEffect(() => {
    invoke("generate_from_file")
      .then((entries) => setEntries(entries as SetStateAction<EntryProps[]>))
      .catch((error) => console.log(error));
  }, []);

  let calendarEntries = entries.map((entry) => {
    return (
      <React.Fragment key={entry.id}>
        <Entry {...entry} />
      </React.Fragment>
    );
  });

  return (
    <div className="left-panel panel">
      <Accordion allowToggle>
        {calendarEntries}
      </Accordion>
    </div>
  );
}

export default LeftPanel;
