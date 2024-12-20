import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ITContent from "./components/ITContent";
import Contact from "./components/Contact";
import About from "./components/About";
import Login from "./components/Login";
import GATEContent from "./components/gateContent";
import Profile from "./components/profile";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      {/* Navbar always visible */}
      <Navbar />

      {/* Routes for navigation */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Content" element={<Content />} />
        <Route path="/Content/ITContent" element={<ITContent />} />
        <Route path="/Content/GateContent" element={<GATEContent />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // You can switch to "dark" if needed
        toastClassName={() =>
          "relative flex p-3 rounded-lg justify-between overflow-hidden cursor-pointer shadow-lg"
        }
        bodyClassName={() => "text-sm font-semibold"}
      />

      {/* Footer Component */}
      <Footer />
    </>
  );
};

export default App;
