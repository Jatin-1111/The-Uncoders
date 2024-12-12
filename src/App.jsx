import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Content from "./components/Content";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ITContent from "./components/ITContent";

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
      </Routes>

      {/* Footer Component */}
      <Footer />
    </>
  );
};

export default App;
