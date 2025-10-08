import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider >
      <Provider store={store}>
        <App />
      </Provider>
    </MantineProvider>
  </StrictMode>
);
