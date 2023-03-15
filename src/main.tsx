import React from "react";
import ReactDOM from "react-dom/client";
import { store, StoreProvider } from "./app/services";
import { Root } from "./app/ui/Root";
import "./app/ui/styles/main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider value={store}>
      <Root />
    </StoreProvider>
  </React.StrictMode>
);
