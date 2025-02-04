import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import CustomerView from "./Pages/CustomerView";
import RideQueue from "./Pages/RideQueue";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import useMessageListener from "./Hooks/useMessageListener";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider";

function App() {
  useMessageListener(); // Initialize the message listener

  return (
    <AuthProvider>
      <SocketProvider>
        <Header />
        <Toaster position="top-right" reverseOrder={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CustomerView />} />
            <Route path="/queue/:rideId" element={<RideQueue />} />
          </Routes>
        </BrowserRouter>
        <Footer />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
