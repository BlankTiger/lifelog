import { Center, Divider } from "@chakra-ui/react";
import "./App.css";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {

  return (
    <div className="container">
      <LeftPanel />
      <Center height="100vh">
        <Divider orientation="vertical" colorScheme="teal" />
      </Center>
      <RightPanel />
    </div>
  );
}

export default App;
