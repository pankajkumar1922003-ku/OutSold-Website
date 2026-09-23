import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  UserRound,
} from "lucide-react";
import logo from "/Outsold Logo.png";

const navLinks = [
  { name: "Home", id: "home" },
  { name: "Discover Events", id: "events" },
  { name: "List Your Events", id: "organizerCTA" },
];

const STORAGE_KEY = "outsold_user_profile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState("Select location");

  const navigate = useNavigate();
  const location = useLocation();

  // ------------------------------------------
  // LOAD SAVED LOCATION
  // ------------------------------------------

  useEffect(() => {
    const loadSavedLocation = () => {
      try {
        const savedProfile = localStorage.getItem(STORAGE_KEY);

        if (!savedProfile) {
          setSelectedLocation("Select location");
          return;
        }

        const profile = JSON.parse(savedProfile);

        setSelectedLocation(
          profile?.location || "Select location"
        );
      } catch (error) {
        console.error("Location reload error:", error);
        setSelectedLocation("Select location");
      }
    };

    loadSavedLocation();

    window.addEventListener(
      "locationChanged",
      loadSavedLocation
    );

    return () => {
      window.removeEventListener(
        "locationChanged",
        loadSavedLocation
      );
    };
  }, []);

  // ------------------------------------------
  // NAVBAR SCROLL
  // ------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ------------------------------------------
  // OPEN LOCATION ONBOARDING
  // ------------------------------------------

  const openLocationOnboarding = () => {
    // Dropdown ki jagah onboarding modal open hoga
    window.dispatchEvent(
      new Event("openLocationOnboarding")
    );
  };

  // ------------------------------------------
  // SCROLL TO SECTION
  // ------------------------------------------

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);

      if (element) {
        const yOffset = -90;

        const y =
          element.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    } else {
      navigate("/", {
        state: {
          scrollTo: id,
        },
      });
    }
  };

  // ------------------------------------------
  // HANDLE SCROLL AFTER NAVIGATION
  // ------------------------------------------

  useEffect(() => {
    if (
      location.pathname === "/" &&
      location.state?.scrollTo
    ) {
      const id = location.state.scrollTo;

      setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          const yOffset = -90;

          const y =
            element.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }

        navigate("/", {
          replace: true,
          state: null,
        });
      }, 100);
    }
  }, [location, navigate]);

  // ------------------------------------------
  // RENDER
  // ------------------------------------------

  return (
    <header className="pointer-events-none fixed left-0 top-0 z-50 w-full px-0 pt-0 sm:px-4 sm:pt-1 md:px-6 md:pt-1 lg:px-8">
      <motion.nav
        layout
        transition={{
          duration: 0.35,
          ease: "easeInOut",
        }}
        className={`pointer-events-auto relative flex w-full max-w-7xl sm:mx-auto rounded-none sm:rounded-2xl border border-[#182322]/10 bg-[#fffdf5]/95 shadow-[0_10px_35px_rgba(24,35,34,0.08)] backdrop-blur-xl transition-all duration-300 ${isScrolled || location.pathname !== "/"
          ? "px-1 py-1 sm:px-4 sm:py-1 md:px-5"
          : "px-1 py-1 sm:px-4 sm:py-2 md:px-5"
          }`}
      >
        {/* ====================================================== */}
        {/* DESKTOP */}
        {/* ====================================================== */}

        <div className="hidden w-full items-center md:flex">

          {/* LOGO */}

          <motion.button
            onClick={() => scrollToSection("home")}
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="group flex shrink-0 cursor-pointer items-center"
          >
            <img
              src={logo}
              alt="OutSold Logo"
              className="h-14 w-24 object-contain transition-transform duration-300 group-hover:scale-[1.03] lg:h-16 lg:w-28"
            />
          </motion.button>

          {/* ====================================================== */}
          {/* LOCATION */}
          {/* ====================================================== */}

          <div className="relative ml-4 lg:ml-7">
            <button
              type="button"
              onClick={openLocationOnboarding}
              className="group flex min-w-[150px] cursor-pointer items-center gap-2.5 rounded-xl border border-[#44807F]/20 bg-white px-3.5 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#44807F]/50 hover:shadow-[0_8px_20px_rgba(68,128,127,0.10)]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#44807F]/10 transition-colors group-hover:bg-[#FEDF24]">
                <MapPin
                  size={16}
                  className="text-[#44807F]"
                />
              </div>

              <div className="min-w-0 flex-1 leading-tight">
                <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-[#182322]/40">
                  Your location
                </span>

                <span className="mt-0.5 block max-w-[105px] truncate text-xs font-bold text-[#182322]">
                  {selectedLocation}
                </span>
              </div>
            </button>
          </div>

          {/* ====================================================== */}
          {/* NAVIGATION */}
          {/* ====================================================== */}

          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.name}
                onClick={() =>
                  scrollToSection(link.id)
                }
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + index * 0.07,
                }}
                className="group relative cursor-pointer rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#182322]/60 transition-all duration-200 hover:bg-[#44807F]/10 hover:text-[#182322] lg:px-4"
              >
                {link.name}

                <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#FEDF24] transition-all duration-300 group-hover:w-6" />
              </motion.button>
            ))}

            <motion.button
              type="button"
              onClick={() => { }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Profile"
              className="ml-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#182322] text-[#FEDF24] shadow-[0_8px_22px_rgba(24,35,34,0.12)] transition-all duration-200 hover:bg-[#44807F] hover:text-white"
            >
              <UserRound size={18} strokeWidth={2.2} />
            </motion.button>
          </div>
        </div>

        {/* ====================================================== */}
        {/* MOBILE */}
        {/* ====================================================== */}

        <div className="w-full md:hidden">

          {/* TOP ROW */}

          <div className="relative flex h-[54px] w-full items-center justify-between px-1">

            {/* LOCATION */}

            <div className="relative z-[60] shrink-0">
              <button
                type="button"
                onClick={openLocationOnboarding}
                className="flex h-[40px] max-w-[102px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#44807F]/20 bg-white px-2 text-[#44807F] shadow-sm transition-all duration-200 hover:border-[#44807F]/40 active:scale-95"
                aria-label="Change location"
              >
                <MapPin
                  size={16}
                  strokeWidth={2.2}
                  className="shrink-0"
                />

                <span className="max-w-[52px] truncate text-[9px] font-bold text-[#182322]/65">
                  {selectedLocation}
                </span>
              </button>
            </div>

            {/* CENTER LOGO */}

            <motion.button
              onClick={() =>
                scrollToSection("home")
              }
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            >
              <img
                src={logo}
                alt="OutSold Logo"
                className="h-12 w-[88px] min-[400px]:h-[52px] min-[400px]:w-[96px] object-contain"
              />
            </motion.button>

            <button
              type="button"
              onClick={() => { }}
              aria-label="Profile"
              className="ml-auto flex h-[40px] w-[40px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#182322] text-[#FEDF24] shadow-[0_7px_18px_rgba(24,35,34,0.12)] transition-all duration-200 hover:bg-[#44807F] active:scale-95"
            >
              <UserRound size={18} strokeWidth={2.2} />
            </button>
          </div>

          {/* MOBILE NAV LINKS */}
          <div className="flex w-full items-center justify-center gap-1 border-t border-[#182322]/10 pt-0">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                initial={{
                  opacity: 0,
                  y: -6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + index * 0.06,
                }}
                className="flex h-[30px] cursor-pointer items-center justify-center rounded-lg px-2 text-[10.5px] font-bold text-[#182322]/55 transition-all duration-200 hover:bg-[#44807F]/10 hover:text-[#182322] active:scale-95 min-[380px]:text-[11px]"
              >
                {link.name}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;