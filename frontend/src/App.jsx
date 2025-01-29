// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
// filepath: /d:/Proj/virtual-queue/frontend/src/App.jsx
// filepath: /d:/Proj/virtual-queue/frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import CustomerView from "./Components/CustomerView";
import RideQueue from "./Components/RideQueue";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import useMessageListener from "./Hooks/useMessageListener";
import { Toaster } from "react-hot-toast";

function App() {
  useMessageListener(); // Initialize the message listener

  return (
    <SocketProvider>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerView />} />
          <Route path="/queue/:rideId" element={<RideQueue />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </SocketProvider>
  );
}

export default App;
