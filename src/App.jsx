import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Everest from "./pages/Everest.jsx";
import Blogs from "./pages/Blogs.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import PackageDetail from "./pages/PackageDetail.jsx";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Blogs" element={<Blogs />} />
          <Route path="/everest" element={<Everest />} />
          <Route path="/packages/:slug" element={<PackageDetail />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
