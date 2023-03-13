import React from "react";
import ReactDOM from "react-dom/client";
import { ApplicationProvider, app } from "./app/services";
import { Root } from "./app/ui/Root";
import "./app/ui/styles/main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApplicationProvider value={app}>
      <Root />
    </ApplicationProvider>
  </React.StrictMode>
);
