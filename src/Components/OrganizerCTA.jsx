import { motion } from "framer-motion";
import {
    CalendarPlus,
    ArrowUpRight,
    Ticket,
    BarChart3,
    Users,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrganizerCTA = () => {
    const navigate = useNavigate();

    const openOrganizerPages = () => {
        navigate("/explore");
    };

    return (
        <section id="organizerCTA" className="relative overflow-hidden bg-white py-20 text-white sm:py-28">

            <div className="absolute inset-0 bg-[#071312]" />

            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#44807F]/20 blur-[120px]" />
                <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#44807F]/15 blur-[140px]" />
                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FEDF24]/[0.04] blur-[100px]" />
            </div>

            {/* Curved Top */}
            <div className="absolute -top-1 left-1/2 h-24 w-[115%] -translate-x-1/2 rounded-[0_0_50%_50%] bg-white sm:h-32" />

            {/* Curved Bottom */}
            <div className="absolute -bottom-1 left-1/2 h-24 w-[115%] -translate-x-1/2 rounded-[50%_50%_0_0] bg-white sm:h-32" />

            {/* Decorative Lines */}
            <div className="pointer-events-none absolute left-0 top-[28%] hidden opacity-30 sm:block">
                <div className="h-px w-40 bg-gradient-to-r from-transparent to-[#44807F]" />
                <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent to-[#FEDF24]" />
            </div>

            <div className="pointer-events-none absolute right-0 top-[28%] hidden opacity-30 sm:block">
                <div className="ml-auto h-px w-40 bg-gradient-to-l from-transparent to-[#44807F]" />
                <div className="mt-4 ml-auto h-px w-24 bg-gradient-to-l from-transparent to-[#FEDF24]" />
            </div>

            {/* Decorative Corner Elements */}
            <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute left-3 top-24 flex h-11 w-11 rotate-12 items-center justify-center rounded-xl border border-[#44807F]/30 bg-[#44807F]/10 backdrop-blur-md sm:left-5 sm:top-28 sm:h-16 sm:w-16 sm:rounded-2xl"
            >
                <Ticket className="text-[#6eb6a8]" size={28} />
            </motion.div>

            <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute right-3 top-24 flex h-11 w-11 -rotate-12 items-center justify-center rounded-xl border border-[#FEDF24]/20 bg-[#FEDF24]/[0.06] backdrop-blur-md sm:right-5 sm:top-28 sm:h-16 sm:w-16 sm:rounded-2xl"
            >
                <CalendarPlus className="text-[#FEDF24]" size={28} />
            </motion.div>

            <motion.div
                animate={{ y: [0, -7, 0], rotate: [0, -4, 0] }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-24 left-[7%] flex h-10 w-10 rotate-6 items-center justify-center rounded-xl border border-[#FEDF24]/20 bg-[#FEDF24]/[0.05] backdrop-blur-md sm:bottom-28 sm:h-12 sm:w-12"
            >
                <Users className="text-[#FEDF24]" size={20} />
            </motion.div>

            <motion.div
                animate={{ y: [0, 7, 0], rotate: [0, 4, 0] }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-24 right-[7%] flex h-10 w-10 -rotate-6 items-center justify-center rounded-xl border border-[#44807F]/30 bg-[#44807F]/10 backdrop-blur-md sm:bottom-28 sm:h-12 sm:w-12"
            >
                <BarChart3 className="text-[#6eb6a8]" size={20} />
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Eyebrow */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#44807F]/25 bg-[#44807F]/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#6eb6a8] backdrop-blur-md sm:text-[10px]">
                        <Sparkles size={13} />
                        For Event Organizers
                    </div>

                    {/* Heading */}
                    <h2 className="mx-auto max-w-4xl text-4xl font-black leading-[1.25] tracking-[-0.045em] sm:text-6xl md:text-7xl">
                        Are You an
                        <span className="block bg-gradient-to-r from-[#FEDF24] via-[#b8e1a8] to-[#44807F] bg-clip-text text-transparent">
                            Organizer?
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-3 md:mt-4 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base md:text-lg">
                        Turn your next idea into an experience people
                        remember. Create, manage and grow your events with
                        OutSold.
                    </p>

                    {/* CTA */}
                    <div className="mt-8 flex justify-center">
                        <motion.button
                            type="button"
                            onClick={openOrganizerPages}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            className="group cursor-pointer relative flex items-center gap-3 overflow-hidden rounded-md bg-gradient-to-r from-[#FEDF24] via-[#d9e878] to-[#44807F] px-6 py-3.5 text-xs font-black text-[#071312] shadow-[0_15px_40px_rgba(68,128,127,0.25)] sm:px-8 sm:py-4 sm:text-sm"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <CalendarPlus size={17} />
                                Explore More
                            </span>

                            <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-md bg-[#071312]/10">
                                <ArrowUpRight
                                    size={15}
                                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </span>

                            <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-700 group-hover:translate-x-full" />
                        </motion.button>
                    </div>

                    {/* Mini Benefits */}
                    <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <span className="flex items-center gap-2 rounded-md border border-[#FEDF24]/15 bg-white/[0.06] px-4 py-2.5 text-[10px] font-bold text-white/85 backdrop-blur-sm sm:text-xs">
                            <span className="h-2 w-2 rounded-full bg-[#FEDF24] shadow-[0_0_10px_rgba(254,223,36,0.6)]" />
                            Create Events
                        </span>

                        <span className="flex items-center gap-2 rounded-md border border-[#44807F]/25 bg-white/[0.06] px-4 py-2.5 text-[10px] font-bold text-white/85 backdrop-blur-sm sm:text-xs">
                            <span className="h-2 w-2 rounded-full bg-[#6eb6a8] shadow-[0_0_10px_rgba(68,128,127,0.6)]" />
                            Manage Bookings
                        </span>

                        <span className="flex items-center gap-2 rounded-md border border-[#FEDF24]/15 bg-white/[0.06] px-4 py-2.5 text-[10px] font-bold text-white/85 backdrop-blur-sm sm:text-xs">
                            <span className="h-2 w-2 rounded-full bg-[#FEDF24] shadow-[0_0_10px_rgba(254,223,36,0.6)]" />
                            Grow Your Audience
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Glow */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-[#44807F]/10 blur-[90px]" />
        </section>
    );
};

export default OrganizerCTA;