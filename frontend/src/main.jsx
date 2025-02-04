import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
// import QueueTest from "./TestComponents/QueueTest.jsx";
// import NotifTest from "./TestComponents/NotifTest.jsx";
// import QueueTest from "./TestComponents/QueueTimeTest.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <StrictMode>
      <App />
    </StrictMode>

    {/* <QueueTest /> */}
    {/* <NotifTest /> */}
  </>,
);
