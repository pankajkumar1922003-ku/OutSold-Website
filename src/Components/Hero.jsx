import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Music, Sparkles, Users, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "outsold_user_profile";

// Decorative preview cards (not linked to real data, edit text freely)
const PREVIEW_CARDS = [
    {
        icon: Music,
        title: "Live Music Night",
        time: "Sat, 7:00 PM",
        place: "Open-air stage",
        tile: "bg-emerald-100 text-emerald-600",
        position: "left-0 top-0",
        rotate: -4,
    },
    {
        icon: Users,
        title: "Startup Meetup",
        time: "Sun, 11:00 AM",
        place: "City co-work hub",
        tile: "bg-teal-100 text-teal-600",
        position: "right-0 top-[150px]",
        rotate: 3,
    },
    {
        icon: UtensilsCrossed,
        title: "Street Food Fest",
        time: "Fri, 5:30 PM",
        place: "Central park",
        tile: "bg-green-100 text-green-600",
        position: "left-8 top-[300px]",
        rotate: -2,
    },
];

const Hero = () => {
    const [userName, setUserName] = useState("");

    // Read user name from localStorage
    useEffect(() => {
        const readUserProfile = () => {
            try {
                const savedProfile = localStorage.getItem(STORAGE_KEY);

                if (!savedProfile) {
                    setUserName("");
                    return;
                }
                const profile = JSON.parse(savedProfile);
                const name = profile?.name?.trim();
                setUserName(name || "");
            } catch (error) {
                console.error("User profile read error:", error);
                setUserName("");
            }
        };
        readUserProfile();
        window.addEventListener("locationChanged", readUserProfile);
        return () => {
            window.removeEventListener("locationChanged", readUserProfile);
        };
    }, []);

    const handleExplore = () => {
        const eventsSection = document.getElementById("events");

        if (eventsSection) {
            eventsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const greetingText = userName
        ? `Hey! ${userName}`
        : "Hey! Event Explorer";

    return (
        <section
            id="home"
            className="
                relative flex min-h-screen
                items-center
                overflow-hidden
                bg-gradient-to-br from-[#f2fdf8] via-white to-[#eefbf8]
                px-5 py-24
                sm:px-8
            "
        >
            {/* Soft background glows */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-emerald-200/40 blur-[120px]" />
                <div className="absolute -bottom-32 right-0 h-[480px] w-[480px] rounded-full bg-teal-200/45 blur-[130px]" />
            </div>

            <div
                className="
                    relative z-10 mx-auto
                    grid w-full max-w-6xl
                    items-center gap-14
                    lg:grid-cols-[1.1fr_0.9fr]
                "
            >
                {/* LEFT: text */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="
                            mb-6 flex items-center gap-2
                            rounded-full
                            border border-teal-100
                            bg-white/80
                            py-1.5 pl-3 pr-4
                            text-sm font-medium text-teal-700
                            shadow-[0_2px_12px_rgba(13,148,136,0.08)]
                            backdrop-blur-md
                        "
                    >
                        <Sparkles size={15} className="text-teal-500" />
                        Discover what's happening nearby
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
                            max-w-full break-words
                            text-[42px] font-extrabold
                            leading-[1.08] tracking-[-0.035em]
                            text-slate-800
                            sm:text-6xl
                            lg:text-[68px]
                        "
                    >
                        {greetingText}

                        <motion.span
                            className="ml-2 inline-block"
                            style={{ originX: 0.7, originY: 0.7 }}
                            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                            transition={{ duration: 1.4, delay: 0.9, ease: "easeInOut" }}
                        >
                            👋
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="mt-5 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg"
                    >
                        Ready to find something fun happening around you?
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleExplore}
                        className="
                            group mt-9 cursor-pointer
                            flex items-center gap-3
                            rounded-full bg-teal-600
                            py-2.5 pl-7 pr-2.5
                            text-sm font-semibold text-white
                            shadow-[0_10px_30px_rgba(13,148,136,0.25)]
                            transition-all duration-300
                            hover:-translate-y-0.5 hover:bg-teal-700
                            hover:shadow-[0_14px_36px_rgba(13,148,136,0.32)]
                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-200
                            sm:text-base
                        "
                    >
                        Explore Events

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white/30">
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                        </span>
                    </motion.button>
                </div>

                {/* RIGHT: decorative event cards (desktop only) */}
                <div
                    aria-hidden="true"
                    className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block"
                >
                    {/* Soft circle behind the cards */}
                    <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-80" />

                    {PREVIEW_CARDS.map((card, index) => {
                        const Icon = card.icon;

                        return (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30, rotate: 0 }}
                                animate={{ opacity: 1, y: 0, rotate: card.rotate }}
                                transition={{
                                    duration: 0.7,
                                    delay: 0.35 + index * 0.15,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className={`
                                    absolute ${card.position}
                                    flex w-72 items-center gap-4
                                    rounded-3xl
                                    border border-teal-100/80
                                    bg-white
                                    p-4
                                    shadow-[0_18px_40px_rgba(13,148,136,0.12)]
                                `}
                            >
                                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${card.tile}`}>
                                    <Icon size={24} />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-[15px] font-semibold text-slate-800">
                                        {card.title}
                                    </p>
                                    
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Hero;