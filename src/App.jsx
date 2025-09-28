import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Navbar from "./Navbar";
import "./App.css";
import Footer from "./pages/Footer/footer";

function App() {
  return (
    <>
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/candidates" element={<Candidates />} />
      </Routes>


      <Footer/>
    </>
  );
}

export default App;
