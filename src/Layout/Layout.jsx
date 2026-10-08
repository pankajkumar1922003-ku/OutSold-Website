import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import LocationOnboarding from "../Components/LocationOnboarding";

const Layout = () => {
  const location = useLocation();

  const isEventDetailsPage = location.pathname.startsWith("/event/");

  return (
    <>
      {!isEventDetailsPage && <Navbar />}

      <main>
        <Outlet />
      </main>

      <Footer />

      <LocationOnboarding />
    </>
  );
};

export default Layout;