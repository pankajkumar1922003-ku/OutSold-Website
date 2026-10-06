import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaPhone,
  FaHeart,
} from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "/Outsold Logo.png";
import { motion } from "framer-motion";
import ListYourEventModal from "../Components/ListYourEventModal";
import { useAuth } from "../context/AuthContext";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap');";

const FONT_STYLE = {
  fontFamily:
    "'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isListEventOpen, setIsListEventOpen] = useState(false);

  const { profile } = useAuth();

  const scrollToElement = (id, smooth = true) => {
    if (!id) return false;

    const element = document.getElementById(id);

    if (!element) return false;

    const yOffset = -100;

    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset +
      yOffset;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: smooth ? "smooth" : "auto",
    });

    return true;
  };

  const scrollToHomeSection = (id) => {
    if (!id) return;

    if (location.pathname === "/") {
      requestAnimationFrame(() => {
        scrollToElement(id, true);
      });

      return;
    }

    navigate("/", {
      state: {
        scrollTo: id,
      },
    });
  };

  const handleRouteLink = (link) => {
    if (!link) return;

    // LIST YOUR EVENT
    if (link.action === "listEvent") {
      setIsListEventOpen(true);
      return;
    }

    const targetRoute = link.route;
    const targetSection = link.scrollTo;

    // ROUTE + SECTION
    if (targetRoute && targetSection) {
      if (location.pathname === targetRoute) {
        setTimeout(() => {
          let attempts = 0;
          const maxAttempts = 30;

          const retryScroll = () => {
            const success = scrollToElement(targetSection, true);

            if (success) return;

            attempts++;

            if (attempts < maxAttempts) {
              setTimeout(retryScroll, 100);
            }
          };

          retryScroll();
        }, 50);

        return;
      }

      navigate(targetRoute, {
        state: {
          scrollTo: targetSection,
        },
      });

      return;
    }

    // NORMAL ROUTE
    if (targetRoute) {
      navigate(targetRoute);
      return;
    }

    // HOME SECTION
    if (link.id) {
      scrollToHomeSection(link.id);
    }
  };

  useEffect(() => {
    const scrollTarget = location.state?.scrollTo;

    if (scrollTarget) {
      let attempts = 0;
      const maxAttempts = 30;

      const findAndScroll = () => {
        const success = scrollToElement(scrollTarget, true);

        if (success) {
          navigate(location.pathname, {
            replace: true,
            state: null,
          });

          return;
        }

        attempts++;

        if (attempts < maxAttempts) {
          setTimeout(findAndScroll, 100);
        }
      };

      const timer = setTimeout(findAndScroll, 100);

      return () => clearTimeout(timer);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [location.pathname, navigate]);

  const footerLinks = {
    Platform: [
      {
        name: "Discover Events",
        route: "/all-events",
      },
      {
        name: "List Your Events",
        action: "listEvent",
      },
      {
        name: "Featured Event",
        route: "/all-events",
      },
      {
        name: "Are You an Organizer?",
        id: "organizerCTA",
      },
    ],

    Company: [
      {
        name: "Testimonials",
        route: "/explore",
        scrollTo: "testimonials",
      },
      {
        name: "Privacy Policy",
        route: "/privacy-policy",
      },
      {
        name: "Terms & Conditions",
        route: "/terms-Conditions",
      },
    ],
  };

  return (
    <>
      <footer
        id="footer"
        style={FONT_STYLE}
        className="relative overflow-hidden bg-[#182322] pt-5 text-[#fffdf5] sm:pt-20"
      >
        <style>{FONT_IMPORT}</style>

        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#44807F]/20 blur-[120px]" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FEDF24]/10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-2 sm:px-8 lg:px-10">
          <div className="grid gap-10 border-b border-[#fffdf5]/10 pb-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-x-16">

            {/* BRAND */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <motion.button
                onClick={() => scrollToHomeSection("home")}
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

              <div className="mt-6 flex items-center gap-3">
                {/* LIST YOUR EVENT BUTTON */}
                <motion.button
                  type="button"
                  onClick={() => setIsListEventOpen(true)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#FEDF24] px-5
    text-sm font-bold text-[#182322]
    shadow-sm transition
    hover:bg-[#ffe84f]
  "
                >
                  <span className="whitespace-nowrap">
                    List your event
                  </span>

                  <FaArrowUpRightFromSquare size={12} />
                </motion.button>

                {/* SOCIAL ICONS */}
                <a
                  href="https://www.instagram.com/outsold.in?stkn=YWlocjRpaGFhN29u"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
                >
                  <FaInstagram size={17} />
                </a>

                <a
                  href="https://www.youtube.com/@getoutsold"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
                >
                  <FaYoutube size={17} />
                </a>

                <a
                  href="https://www.facebook.com/people/Outsoldin/61595180038409/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
                >
                  <FaFacebookF size={17} />
                </a>
              </div>
            </div>

            {/* PLATFORM + COMPANY */}
            <div className="ml-6 grid grid-cols-2 gap-4 lg:contents">

              {/* PLATFORM */}
              <div>
                <h3 className="text-base font-semibold text-[#fffdf5]">
                  Platform
                </h3>

                <ul className="mt-5 space-y-3">
                  {footerLinks.Platform.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => handleRouteLink(link)}
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

              {/* COMPANY */}
              <div>
                <h3 className="text-base font-semibold text-[#fffdf5]">
                  Company
                </h3>

                <ul className="mt-5 space-y-3">
                  {footerLinks.Company.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => handleRouteLink(link)}
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

            {/* GET IN TOUCH */}
            <div className="flex flex-col items-center text-center -mt-2 md:mt-0 md:items-start md:text-left">
              <h3 className="text-base font-semibold text-[#fffdf5]">
                Get In Touch
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#fffdf5]/60">
                Have questions about our platform? We'd love to hear from you.
              </p>

              <div className="mx-auto mt-3 flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-3">

                <a
                  href="mailto:sellarsuite@gmail.com"
                  className="flex items-center gap-2 text-sm text-[#fffdf5]/60 transition hover:text-[#FEDF24]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fffdf5]/5 text-[#FEDF24] shadow-sm">
                    <FaEnvelope size={16} />
                  </span>

                  <span className="whitespace-nowrap">
                    getoutsold@gmail.com
                  </span>
                </a>

                <a
                  href="tel:9818815838"
                  className="flex items-center gap-2 text-sm text-[#fffdf5]/60 transition hover:text-[#FEDF24]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fffdf5]/5 text-[#FEDF24] shadow-sm">
                    <FaPhone size={16} />
                  </span>

                  <span className="whitespace-nowrap">
                    9818815838
                  </span>
                </a>
              </div>
              {/* WHATSAPP */}
              <a
                href="https://wa.me/9818815838?text=Hi%2C%20I%20would%20like%20to%20do%20ticketing%20for%20my%20event%3F"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="mt-5 flex w-full max-w-[235px] items-center gap-3 rounded-lg bg-[#25D366] px-3 py-2.5 text-[#182322] transition-all duration-300 hover:scale-[1.02] hover:bg-[#20c75a]"
              >
                {/* WhatsApp Icon */}
                <FaWhatsapp className="shrink-0 text-[28px]" />

                {/* Text */}
                <span className="flex min-w-0 flex-1 flex-col text-left leading-tight">
                  <span className="text-sm font-bold">
                    Chat on WhatsApp
                  </span>

                  <span className="mt-0.5 text-[11px] font-medium opacity-80">
                    Message us, we reply on WhatsApp
                  </span>
                </span>

                {/* Arrow */}
                <FaArrowUpRightFromSquare
                  size={12}
                  className="shrink-0"
                />
              </a>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col items-center justify-center gap-5 py-3 text-center text-sm text-[#fffdf5]/50 sm:flex-row sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} OutSold. All rights reserved.
            </p>

            <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-x-6 sm:gap-y-2">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <span className="flex items-center justify-center gap-1 whitespace-nowrap">
                  Made with
                  <FaHeart size={14} className="text-[#FEDF24]" />
                  for events
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* LIST YOUR EVENT MODAL */}
      <ListYourEventModal
        isOpen={isListEventOpen}
        onClose={() => setIsListEventOpen(false)}
        companyId={profile?.companyId}
      />
    </>
  );
};

export default Footer;