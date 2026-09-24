import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import LocationOnboarding from '../Components/LocationOnboarding'

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <LocationOnboarding/>
    </>
  );
};

export default Layout;