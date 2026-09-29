import { useEffect } from "react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaPhone,
  FaHeart,
} from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "/Outsold Logo.png";
import { motion } from "framer-motion";

// Same font import as EventsHome
const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap');";

const FONT_STYLE = {
  fontFamily:
    "'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

        navigate("/", {
          replace: true,
          state: null,
        });
      }, 100);
    }
  }, [location, navigate]);

  const footerLinks = {
    Platform: [
      { name: "Discover Events", id: "events" },
      { name: "Create Event", id: "createEvents" },
      { name: "Features", id: "why-choose-us" },
      { name: "Statistics", id: "statistics" },
    ],

    Company: [
      { name: "About Us", id: "home" },
      { name: "Testimonials", id: "testimonials" },
      { name: "Contact Us", id: "contact" },
    ],
  };

  return (
    <footer
      id="footer"
      style={FONT_STYLE}
      className="relative overflow-hidden bg-[#182322] pt-5 text-[#fffdf5] sm:pt-20"
    >
      <style>{FONT_IMPORT}</style>

      {/* Background Glow */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#44807F]/20 blur-[120px]" />

      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FEDF24]/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* ================= TOP SECTION ================= */}
        <div className="grid gap-10 border-b border-[#fffdf5]/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-x-16">
          {/* ================= BRAND SECTION ================= */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <motion.button
              onClick={() => scrollToSection("home")}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group flex cursor-pointer select-none items-center"
            >
              <img
                src={logo}
                alt="OutSold Logo"
                className="h-16 w-20 object-contain md:h-20 md:w-28"
              />
            </motion.button>

            <p className="mt-2 max-w-sm text-sm leading-7 text-[#fffdf5]/60 md:mt-5">
              Everything you need to create, manage and grow unforgettable
              events all in one powerful platform.
            </p>

            {/* ================= SOCIAL ICONS ================= */}
            <div className="mt-6 flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/sellar.in?igsh=MXhobzJrMzIzbGdlaQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
              >
                <FaInstagram size={18} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/sellar-in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
              >
                <FaLinkedinIn size={18} />
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/people/Sellarin/61583546437046/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
              >
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>

          {/* ================= PLATFORM & COMPANY ================= */}
          <div className="ml-6 grid grid-cols-2 gap-8 lg:contents">
            {/* Platform */}
            <div>
              <h3 className="text-base font-semibold text-[#fffdf5]">
                Platform
              </h3>

              <ul className="mt-5 space-y-3">
                {footerLinks.Platform.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="group flex cursor-pointer items-center gap-2 text-left text-sm text-[#fffdf5]/60 transition hover:text-[#FEDF24]"
                    >
                      {link.name}

                      <FaArrowUpRightFromSquare
                        size={11}
                        className="shrink-0 opacity-0 transition group-hover:opacity-100"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-base font-semibold text-[#fffdf5]">
                Company
              </h3>

              <ul className="mt-5 space-y-3">
                {footerLinks.Company.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="group flex cursor-pointer items-center gap-2 text-left text-sm text-[#fffdf5]/60 transition hover:text-[#FEDF24]"
                    >
                      {link.name}

                      <FaArrowUpRightFromSquare
                        size={11}
                        className="shrink-0 opacity-0 transition group-hover:opacity-100"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ================= GET IN TOUCH ================= */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="text-base font-semibold text-[#fffdf5]">
              Get In Touch
            </h3>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#fffdf5]/60">
              Have questions about our platform? We'd love to hear from you.
            </p>

            <div className="mx-auto mt-5 flex flex-col items-start justify-center gap-3 md:gap-4">
              {/* Email */}
              <a
                href="mailto:sellarsuite@gmail.com"
                className="flex items-center gap-2 text-sm text-[#fffdf5]/60 transition hover:text-[#FEDF24]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fffdf5]/5 text-[#FEDF24] shadow-sm">
                  <FaEnvelope size={16} />
                </span>

                <span className="break-all">
                  sellarsuite@gmail.com
                </span>
              </a>

              {/* Phone */}
              <a
                href="tel:9818815838"
                className="flex items-center gap-2 text-sm text-[#fffdf5]/60 transition hover:text-[#FEDF24]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fffdf5]/5 text-[#FEDF24] shadow-sm">
                  <FaPhone size={16} />
                </span>

                <span>9818815838</span>
              </a>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="flex flex-col items-center justify-center gap-5 py-7 text-center text-sm text-[#fffdf5]/50 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} OutSold. All rights reserved.</p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-x-6 sm:gap-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {/* Privacy Policy */}
              <a
                href="/privacy-policy"
                className="transition hover:text-[#FEDF24]"
              >
                Privacy Policy
              </a>

              {/* Terms & Conditions */}
              <a
                href="/terms-Conditions"
                className="transition hover:text-[#FEDF24]"
              >
                Terms & Conditions
              </a>
            </div>

            {/* Made With Love */}
            <span className="flex items-center justify-center gap-1 whitespace-nowrap">
              Made with
              <FaHeart size={14} className="text-[#FEDF24]" />
              for events
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;