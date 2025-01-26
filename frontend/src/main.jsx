// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import App from "./App.jsx";
// import QueueTest from "./QueueTest.jsx";
// import NotifTest from "./NotifTest.jsx";
import QueueTest from "./QueueTimeTest.jsx";

createRoot(document.getElementById("root")).render(
  <>
    {/* <App /> */}
    <QueueTest />
  </>,
);
