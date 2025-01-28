// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
// filepath: /d:/Proj/virtual-queue/frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider"; // Updated import
import CustomerView from "./Components/CustomerView";
import RideQueue from "./Components/RideQueue";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  return (
    <SocketProvider>
      <Header />
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
