import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
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
    } else {
      navigate("/", {
        state: { scrollTo: id },
      });
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const id = location.state.scrollTo;

      setTimeout(() => {
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

        navigate("/", { replace: true, state: null });
      }, 100);
    }
  }, [location, navigate]);

  return (
    <header className="fixed top-0 left-0 z-50 flex w-full justify-center pointer-events-none md:mt-0.5">
      <motion.nav
        layout
        transition={{
          duration: 0.45,
          ease: "easeInOut",
        }}
        className={`pointer-events-auto flex flex-col items-center justify-start md:flex-row md:justify-between
          transition-all duration-500 ease-in-out md:rounded-lg
          ${isScrolled
            ? `
                w-full md:w-225
                bg-[#062b2a]/70
                backdrop-blur-xl
                shadow-lg shadow-black/10
                border border-white/20
                px-6 py-2
              `
            : `
                w-full max-w-7xl
              ${location.pathname !== "/"
              ? "bg-[#062b2a]/90 backdrop-blur-xl"
              : "bg-transparent"
            }
          border border-transparent
          px-4 py-1 md:px-8`
          }
        `}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollToSection("home")}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="group flex cursor-pointer items-center select-none"
        >
          <img
            src={logo}
            alt="OutSold Logo"
            className="h-16 w-20 md:h-20 md:w-28 object-contain"
          />
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
              className="group relative flex-1 cursor-pointer whitespace-nowrap rounded-md
                px-1 py-1 text-[13px] font-medium text-white/85
                transition-all duration-300 hover:bg-white/10 hover:text-white
                active:scale-95 min-[400px]:px-2 min-[400px]:text-[11px]
                sm:flex-none sm:px-3 sm:text-xs md:px-4 md:py-2 md:text-sm"
            >
              {link.name}

              <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-[#48D1CC] transition-all duration-300 group-hover:w-5" />
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
              className="inline-flex items-center gap-2 rounded-xl
                bg-white px-5 py-2.5 text-sm font-semibold text-[#007A78]
                transition-all duration-300
                hover:-translate-y-0.5 hover:bg-[#f3ffff]
                hover:shadow-md active:translate-y-0"
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

