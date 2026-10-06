import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  const phoneNumber = "9818815838";

  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("footer");

    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.05,
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi, I would like to do ticketing for my event?"
    );

    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  // Footer visible hone par floating button hide
  if (isFooterVisible) {
    return null;
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="
        fixed bottom-6 right-4 z-50
        flex h-14 w-14
        items-center justify-center
        rounded-full
        bg-[#25D366]
        text-white
        shadow-lg
        transition-all duration-300
        hover:scale-110
      "
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-3xl" />
    </button>
  );
};

export default FloatingWhatsApp;