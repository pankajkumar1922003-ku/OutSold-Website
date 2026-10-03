import { motion } from "framer-motion";
import {
    CalendarDays,
    Ticket,
    Users,
    ArrowUpRight,
    Sparkles,
    TrendingUp,
} from "lucide-react";

const PlatformStatistics = () => {
    return (
        <section
            id="statistics"
            className="relative overflow-hidden bg-[#071B18] py-10 text-white"
        >
            {/* =========================
                BACKGROUND ATMOSPHERE
            ========================== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Left Teal Glow */}
                <div className="absolute -left-64 top-[-100px] h-[600px] w-[600px] rounded-full bg-[#44807F]/20 blur-[170px]" />

                {/* Right Teal Glow */}
                <div className="absolute -right-64 top-[10%] h-[650px] w-[650px] rounded-full bg-[#2F7775]/20 blur-[180px]" />

                {/* Bottom Green Glow */}
                <div className="absolute bottom-[-320px] left-[25%] h-[600px] w-[600px] rounded-full bg-[#0E4F49]/30 blur-[180px]" />

                {/* Small Yellow Accent */}
                <div className="absolute left-[45%] top-[5%] h-[220px] w-[220px] rounded-full bg-[#FEDF24]/[0.06] blur-[100px]" />

                {/* Center Teal Atmosphere — NO WHITE */}
                <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0E4F49]/20 blur-[150px]" />
            </div>

            {/* =========================
                DECORATIVE GRID
            ========================== */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.045]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(68,128,127,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(68,128,127,0.8) 1px, transparent 1px)",
                    backgroundSize: "70px 70px",
                }}
            />

            {/* =========================
                ACCENT LINES
            ========================== */}
            <div className="pointer-events-none absolute left-0 top-[22%] h-px w-32 bg-gradient-to-r from-transparent to-[#44807F]/50 sm:w-52" />

            <div className="pointer-events-none absolute right-0 top-[22%] h-px w-32 bg-gradient-to-l from-transparent to-[#FEDF24]/40 sm:w-52" />

            {/* =========================
                MAIN CONTENT
            ========================== */}
            <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
                {/* =========================
                    HEADER
                ========================== */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-4xl text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#44807F]/30 bg-[#102F2B]/80 px-4 py-2 text-xs font-bold text-[#8FC8C5] shadow-lg shadow-black/10 backdrop-blur-md">
                        <Sparkles
                            size={14}
                            className="text-[#FEDF24]"
                        />

                        The journey has just begun
                    </div>

                    {/* Heading */}
                    <h2 className="mt-7 text-4xl font-black leading-[1.2] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        We&apos;re building
                        <span className="block bg-gradient-to-r from-[#FEDF24] via-[#7FC5C1] to-[#44807F] bg-clip-text text-transparent">
                            something bigger.
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8 md:text-lg">
                        OutSold is growing with every event, organizer and
                        experience we help bring to life. Soon, these numbers
                        will tell the story of everything we build together.
                    </p>
                </motion.div>

                {/* =========================
                    CENTER VISUAL
                ========================== */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: 0.15,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative mx-auto mt-12 flex h-28 w-28 items-center justify-center sm:mt-14 sm:h-32 sm:w-32"
                >
                    {/* Outer Teal Glow */}
                    <div className="absolute inset-0 rounded-full bg-[#44807F]/20 blur-3xl" />

                    {/* Secondary Green Glow */}
                    <div className="absolute inset-4 rounded-full bg-[#0E4F49]/30 blur-2xl" />

                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border border-[#44807F]/30" />

                    {/* Inner Ring */}
                    <div className="absolute inset-3 rounded-full border border-dashed border-[#44807F]/35" />

                    {/* Icon */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#7FC5C1]/20 bg-gradient-to-br from-[#44807F] to-[#1F5551] shadow-xl shadow-[#44807F]/20 sm:h-20 sm:w-20">
                        <TrendingUp
                            size={30}
                            strokeWidth={2}
                            className="text-white sm:h-9 sm:w-9"
                        />
                    </div>

                    {/* Floating Dot */}
                    <motion.span
                        animate={{
                            scale: [1, 1.35, 1],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="absolute right-1 top-2 h-3 w-3 rounded-full bg-[#FEDF24] shadow-[0_0_18px_rgba(254,223,36,0.45)]"
                    />
                </motion.div>

                {/* =========================
                    COMING SOON MESSAGE
                ========================== */}
                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-white/40">
                        Platform statistics
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                        The numbers are
                        <span className="ml-2 bg-gradient-to-r from-[#7FC5C1] to-[#44807F] bg-clip-text text-transparent">
                            coming soon.
                        </span>
                    </h3>
                </div>

                {/* =========================
                    MILESTONE CARDS
                ========================== */}
                <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:gap-5">
                    {/* Card 1 */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="group relative overflow-hidden rounded-2xl border border-[#44807F]/20 bg-[#0D2925]/80 p-5 shadow-xl shadow-black/10 backdrop-blur-md transition sm:p-6"
                    >
                        {/* Card Glow */}
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FEDF24]/10 blur-3xl" />

                        <div className="relative flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FEDF24]/10 bg-[#FEDF24]/10 text-[#FEDF24] transition group-hover:bg-[#FEDF24] group-hover:text-[#102522]">
                                <CalendarDays size={21} />
                            </div>

                            <div>
                                <p className="text-sm font-black text-white">
                                    More events
                                </p>

                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="group relative overflow-hidden rounded-2xl border border-[#44807F]/20 bg-[#0D2925]/80 p-5 shadow-xl shadow-black/10 backdrop-blur-md transition sm:p-6"
                    >
                        {/* Card Glow */}
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#44807F]/20 blur-3xl" />

                        <div className="relative flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#44807F]/15 bg-[#44807F]/10 text-[#7FC5C1] transition group-hover:bg-[#44807F] group-hover:text-white">
                                <Users size={21} />
                            </div>

                            <div>
                                <p className="text-sm font-black text-white">
                                    Growing community
                                </p>

                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* =========================
                    PROGRESS LINE
                ========================== */}
                <div className="mx-auto mt-12 flex max-w-md items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#44807F]/40" />

                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FEDF24]" />

                        <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-[#FEDF24] to-[#44807F]" />

                        <span className="h-1.5 w-1.5 rounded-full bg-[#44807F]" />
                    </div>

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FEDF24]/30" />
                </div>

                {/* =========================
                    BOTTOM MESSAGE
                ========================== */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-white/40">
                    <Ticket
                        size={14}
                        className="text-[#44807F]"
                    />

                    <span>Big things are being built.</span>

                    <ArrowUpRight
                        size={14}
                        className="text-[#FEDF24]"
                    />
                </div>
            </div>
        </section>
    );
};

export default PlatformStatistics;