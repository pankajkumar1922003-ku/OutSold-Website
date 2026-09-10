import { motion } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    ChevronDown,
} from "lucide-react";

const Hero = () => {
    const scrollToJourney = () => {
        document
            .getElementById("journey")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="home"
            className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
            {/* Background Video */}
            <motion.div
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 1.8,
                    ease: "easeOut",
                }}
                className="absolute inset-0"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                >
                    <source src="/HeroVid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </motion.div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/70" />

            {/* Teal Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#007A78]/30 via-transparent to-[#001817]/80" />

            {/* Left Teal Glow */}
            <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-[#007A78]/30 blur-[120px]" />

            {/* Right Color Glow */}
            <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-[150px]" />

            {/* Main Content */}
            <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-2 text-center sm:px-8 lg:px-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/90 backdrop-blur-md sm:text-sm"
                >
                    <Sparkles size={16} className="text-[#48D1CC]" />
                    All-in-One Event Management
                </motion.div>

                {/* Main Heading */}
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.9,
                            delay: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mx-auto max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                    >
                        From One Idea.
                    </motion.h1>
                </div>

                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.9,
                            delay: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mx-auto max-w-6xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
                    >
                        <span className="text-white">To An </span>

                        <span className="bg-gradient-to-r from-[#48D1CC] via-[#20B2AA] to-[#7DE2D1] bg-clip-text text-transparent">
                            Unforgettable Event.
                        </span>
                    </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 }}
                    className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg md:text-xl"
                >
                    Plan, create, manage attendees, sell tickets, track payments,
                    and measure success — everything your event needs in one
                    powerful platform.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.1 }}
                    className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    {/* Primary Button */}
                    <a
                        href="https://app.outsold.in/login"
                        target="_blank"
                        className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#007A78] px-7 py-4 text-base font-semibold text-white shadow-xl shadow-[#007A78]/30 transition duration-300 hover:scale-105 hover:bg-[#00918E] sm:w-auto"
                    >
                        Start Your Journey

                        <ArrowRight
                            size={19}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </a>
                </motion.div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#001817] to-transparent" />

            {/* Scroll Indicator */}
            <motion.button
                onClick={scrollToJourney}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition hover:text-white"
            >
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-xs">
                    Begin the Journey
                </span>

                <motion.div
                    animate={{ y: [0, 7, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <ChevronDown size={22} />
                </motion.div>
            </motion.button>
        </section>
    );
};

export default Hero;