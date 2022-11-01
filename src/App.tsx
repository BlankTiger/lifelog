import "./App.css";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {
  /* async function greet() { */
  /*   setGreetMsg(await invoke("greet", { name })); */
  /* } */

  return (
    <div className="container">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default App;
