import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import EventDiscovery from "./Components/EventDiscovery";
import CreateEventSection from "./Components/CreateEventSection";
import WhyChooseUs from "./Components/WhyChooseUs";
import PlatformStatistics from "./Components/PlatformStatistics";
import Testimonials from "./Components/Testimonials";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <main>
        <Hero />
        <EventDiscovery/>
        <CreateEventSection/>
        <WhyChooseUs/>
        <PlatformStatistics/> 
        <Testimonials/>
      </main>
    </>
  );
}

export default App;