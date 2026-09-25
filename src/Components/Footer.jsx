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

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap');";

const FONT_STYLE = {
  fontFamily:
    "'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

    const targetRoute = link.route;
    const targetSection = link.scrollTo;

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

    if (targetRoute) {
      navigate(targetRoute);
      return;
    }

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
        route:"/",
        scrollTo: "home",
      },
      {
        name: "List Your Events",
        id: "organizerCTA",
      },
      {
        name: "Features",
        route: "/explore",
        scrollTo: "why-choose-us",
      },
      {
        name: "Statistics",
        route: "/explore",
        scrollTo: "statistics",
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
    <footer
      id="footer"
      style={FONT_STYLE}
      className="relative overflow-hidden bg-[#182322] pt-5 text-[#fffdf5] sm:pt-20"
    >
      <style>{FONT_IMPORT}</style>

      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#44807F]/20 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#FEDF24]/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-2 sm:px-8 lg:px-10">
        <div className="grid gap-10 border-b border-[#fffdf5]/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-x-16">
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
              <a
                href="https://www.instagram.com/outsold.in?stkn=YWlocjRpaGFhN29u"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.linkedin.com/company/sellar-in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fffdf5]/15 bg-[#fffdf5]/5 text-[#fffdf5] transition hover:border-[#FEDF24] hover:bg-[#FEDF24] hover:text-[#182322]"
              >
                <FaLinkedinIn size={18} />
              </a>

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

          <div className="ml-6 grid grid-cols-2 gap-4 lg:contents">
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

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="text-base font-semibold text-[#fffdf5]">
              Get In Touch
            </h3>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#fffdf5]/60">
              Have questions about our platform? We'd love to hear from you.
            </p>

            <div className="mx-auto mt-5 flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4">
              <a
                href="mailto:sellarsuite@gmail.com"
                className="flex items-center gap-2 text-[#fffdf5]/60 transition hover:text-[#FEDF24] text-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fffdf5]/5 text-[#FEDF24] shadow-sm">
                  <FaEnvelope size={16} />
                </span>

                <span className="whitespace-nowrap">sellarsuite@gmail.com</span>
              </a>

              <a
                href="tel:9818815838"
                className="flex items-center gap-2 text-sm text-[#fffdf5]/60 transition hover:text-[#FEDF24]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fffdf5]/5 text-[#FEDF24] shadow-sm">
                  <FaPhone size={16} />
                </span>

                <span className="whitespace-nowrap">9818815838</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-5 py-7 text-center text-sm text-[#fffdf5]/50 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} OutSold. All rights reserved.</p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-x-6 sm:gap-y-2">
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
  );
};

export default Footer;