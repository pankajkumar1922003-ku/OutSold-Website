import Hero from "./Components/Hero";
import EventDiscovery from "./Components/EventDiscovery";
import CreateEventSection from "./Components/CreateEventSection";
import WhyChooseUs from "./Components/WhyChooseUs";
import PlatformStatistics from "./Components/PlatformStatistics";
import Testimonials from "./Components/Testimonials";
import { FaWhatsapp } from "react-icons/fa6";

function App() {
  return (
    <>
      <main>
        <Hero />
        <EventDiscovery />
        <CreateEventSection />
        <WhyChooseUs />
        <PlatformStatistics />
        <Testimonials />
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919818815838"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-10 md:bottom-14 md:right-7 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl sm:bottom-6 sm:right-6"
      >
        <FaWhatsapp size={30} />
      </a>
    </>
  );
}

export default App;