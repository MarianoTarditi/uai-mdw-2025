import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple,
} from "@mantine/core";
import "./index.css";
import { Toaster } from "sonner";

import { AppWithObserver } from "./AppWithObserver";

const myColor: MantineColorsTuple = [
  "#f5f5f5",
  "#e7e7e7",
  "#cdcdcd",
  "#b2b2b2",
  "#9a9a9a",
  "#8b8b8b",
  "#848484",
  "#717171",
  "#656565",
  "#000000",
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={theme}>
    <Provider store={store}>
      <Toaster position="top-center" richColors closeButton />
      <AppWithObserver />
    </Provider>
  </MantineProvider>
);
