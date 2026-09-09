
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "/Outsold Logo.png";

const navLinks = [
  { name: "Events", id: "events" },
  { name: "Create Events", id: "createEvents" },
  { name: "Why Choose Us", id: "why-choose-us" },
  { name: "About", id: "about" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isInnerPage =
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-conditions";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      const yOffset = -100;

      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="pointer-events-none fixed left-0 top-0 z-50 flex w-full justify-center md:pt-2">
      <motion.nav
        layout
        transition={{
          duration: 0.45,
          ease: "easeInOut",
        }}
        className={`pointer-events-auto flex flex-col items-center justify-between transition-all duration-500 ease-in-out ${isScrolled || isInnerPage
            ? `
      w-full border-b border-white/10
      bg-[#062b2a]/95
      px-5 py-4
      shadow-lg shadow-black/10
      backdrop-blur-xl
      md:w-[900px] md:rounded-2xl md:border md:border-white/20 md:px-6 md:py-3
    `
            : `
      w-full max-w-7xl
      border border-transparent
      bg-transparent
      px-5 py-4
      md:px-8 md:py-5
    `
          }`}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollToSection("home")}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="group mb-3 flex cursor-pointer items-center gap-2 select-none md:mb-0"
        >
          <img
            src={logo}
            alt="OutSold Logo"
            className="h-9 w-9 object-contain"
          />

          <span className="text-3xl font-bold tracking-tight text-white">
            Out<span className="text-[#48D1CC]">Sold</span>
          </span>
        </motion.button>

        {/* Navigation Links */}
        <div className="flex w-full min-w-0 items-center justify-center gap-2 md:w-auto md:gap-2">
          {navLinks.map((link, index) => (
            <motion.button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.08,
              }}
              className="group cursor-pointer relative flex-1 whitespace-nowrap rounded-md px-1 py-1 text-[13px] font-medium text-white/85 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-95 min-[400px]:px-2 min-[400px]:text-[11px] sm:flex-none sm:px-3 sm:text-xs md:px-4 md:py-2 md:text-sm"
            >
              {link.name}

              <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-[#48D1CC] transition-all duration-300 group-hover:w-5" />
            </motion.button>
          ))}

          {/* Desktop Get Started Button */}
          <div className="ml-2 hidden md:block">
            <motion.a
              href="https://app.outsold.in/login"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#007A78] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f3ffff] hover:shadow-md active:translate-y-0"
            >
              Get Started

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.a>
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
