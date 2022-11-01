import { Divider } from "@chakra-ui/react";
import "./App.css";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {

  return (
    <div className="container">
      <LeftPanel />
      <Divider orientation="vertical" colorScheme="teal" />
      <RightPanel />
    </div>
  );
}

export default App;
