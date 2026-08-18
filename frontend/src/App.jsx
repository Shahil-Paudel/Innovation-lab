import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Everest from "./pages/Everest.jsx";
import Blogs from "./pages/Blogs.jsx";


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