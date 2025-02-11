import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./Contexts/SocketProvider";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CustomerView from "./Pages/CustomerView";
import RideQueue from "./Pages/RideQueue";
import AdminPanel from "./Pages/AdminPanel"; // Import AdminPanel
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import useMessageListener from "./Hooks/useMessageListener";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Contexts/AuthProvider";
import { QueueProvider } from "./Contexts/QueueContext";
import { GeolocationProvider } from "./Contexts/GeolocationContext";

function App() {
  useMessageListener();

  return (
    <div id="root">
      <BrowserRouter>
        <GeolocationProvider>
          <AuthProvider>
            <SocketProvider>
              <QueueProvider>
                <div className="main-content">
                  <Header />
                  <Toaster position="top-right" reverseOrder={false} />
                  <Routes>
                    <Route path="/" element={<CustomerView />} />
                    <Route path="/queue/:rideId" element={<RideQueue />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<AdminPanel />} />{" "}
                    {/* Add AdminPanel route */}
                  </Routes>
                </div>
                <Footer />
              </QueueProvider>
            </SocketProvider>
          </AuthProvider>
        </GeolocationProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
