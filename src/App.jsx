import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Everest from "./pages/Everest";
import Blogs from "./pages/Blogs";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Blogs" element={<Blogs/>} />
        <Route path="/everest" element={<Everest />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;