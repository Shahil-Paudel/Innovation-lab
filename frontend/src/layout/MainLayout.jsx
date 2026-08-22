import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  const location = useLocation();

  const isPackageDetail = location.pathname.startsWith("/packages/");

  return (
    <div>
      <Navbar />

      <main className={isPackageDetail ? "pt-20" : ""}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;