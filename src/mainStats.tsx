import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./style.css";
import Stats from "./Statistics";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <Stats />
    </ChakraProvider>
  </React.StrictMode>
);
