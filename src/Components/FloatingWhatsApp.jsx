import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
    const phoneNumber = "9818815838";

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("Hi, I would like to do ticketing for my event?");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };


    return (
        <button
            onClick={handleWhatsAppClick}
            className="fixed bottom-15 right-4 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300
      "
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp className="text-3xl" />
        </button>
    );
};

export default FloatingWhatsApp;