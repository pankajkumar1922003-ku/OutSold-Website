import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaXTwitter,
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaLocationDot,
  FaHeart,
} from "react-icons/fa6";

const Footer = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

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
      className="relative overflow-hidden bg-[#123331] pt-14 text-white sm:pt-20"
    >
      {/* Background Glow */}
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#007A78]/20 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#48D1CC]/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Top Section */}
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-x-16">

          {/* Brand Section */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <button
              onClick={() => scrollToSection("home")}
              className="text-3xl font-bold tracking-tight"
            >
              Out<span className="text-[#48D1CC]">Sold</span>
            </button>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              Everything you need to create, manage and grow unforgettable
              events all in one powerful platform.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/sellar.in?igsh=MXhobzJrMzIzbGdlaQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#48D1CC]/40 hover:bg-[#007A78] hover:text-white"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://www.linkedin.com/company/sellar-in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#48D1CC]/40 hover:bg-[#007A78] hover:text-white"
              >
                <FaLinkedinIn size={18} />
              </a>

              <a
                href="https://www.facebook.com/people/Sellarin/61583546437046/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#48D1CC]/40 hover:bg-[#007A78] hover:text-white"
              >
                <FaFacebookF size={18} />
              </a>
            </div>
          </div>

          {/* Platform & Company */}
          <div className="grid grid-cols-2 gap-8 lg:contents">

            {/* Platform */}
            <div>
              <h3 className="text-base font-semibold text-white">
                Platform
              </h3>

              <ul className="mt-5 space-y-3">
                {footerLinks.Platform.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="group flex items-center gap-2 text-left text-sm text-white/55 transition hover:text-[#48D1CC] cursor-pointer"
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
              <h3 className="text-base font-semibold text-white">
                Company
              </h3>

              <ul className="mt-5 space-y-3">
                {footerLinks.Company.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="group flex items-center gap-2 text-left text-sm text-white/55 cursor-pointer transition hover:text-[#48D1CC]"
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

          {/* Get In Touch */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h3 className="text-base font-semibold text-white">
              Get In Touch
            </h3>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              Have questions about our platform? We'd love to hear from you.
            </p>

            <a
              href="mailto:hello@OutSold.com"
              className="mt-5 flex items-center gap-3 text-sm text-white/70 transition hover:text-[#48D1CC]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#48D1CC]">
                <FaEnvelope size={16} />
              </span>

              sellarsuite@gmail.com
            </a>

            <div className="mt-4 flex items-center gap-3 text-sm text-white/60">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#48D1CC]">
                <FaLocationDot size={17} />
              </span>

              India
            </div>
          </div>

        </div>
        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-center gap-5 py-7 text-center text-sm text-white/45 sm:flex-row sm:justify-between sm:text-left">

          <p>
            © {new Date().getFullYear()} OutSold. All rights reserved.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-x-6 sm:gap-y-2">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a
                href="/privacy-policy"
                className="transition hover:text-[#48D1CC]"
              >
                Privacy Policy
              </a>

              <a
                href="/terms-Conditions"
                className="transition hover:text-[#48D1CC]"
              >
                Terms & Conditions
              </a>
            </div>

            {/* Made With Love - Centered */}
            <span className="flex items-center justify-center gap-1 whitespace-nowrap">
              Made with

              <FaHeart
                size={14}
                className="text-[#48D1CC]"
              />

              for events
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

