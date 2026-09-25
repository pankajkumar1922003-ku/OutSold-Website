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
            className="relative overflow-hidden bg-[#FFF9E8] py-14 text-[#17302E]"
        >
            {/* Background Atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-56 top-[-80px] h-[560px] w-[560px] rounded-full bg-[#FEDF24]/18 blur-[150px]" />

                <div className="absolute -right-56 top-[15%] h-[620px] w-[620px] rounded-full bg-[#44807F]/12 blur-[170px]" />

                <div className="absolute bottom-[-280px] left-[35%] h-[520px] w-[520px] rounded-full bg-[#FEDF24]/10 blur-[150px]" />

                <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[120px]" />
            </div>

            {/* Decorative Grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(68,128,127,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(68,128,127,0.8) 1px, transparent 1px)",
                    backgroundSize: "70px 70px",
                }}
            />

            {/* Accent Lines */}
            <div className="pointer-events-none absolute left-0 top-[22%] h-px w-32 bg-gradient-to-r from-transparent to-[#44807F]/30 sm:w-52" />

            <div className="pointer-events-none absolute right-0 top-[22%] h-px w-32 bg-gradient-to-l from-transparent to-[#FEDF24]/40 sm:w-52" />

            <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-4xl text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#44807F]/20 bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#44807F] shadow-sm backdrop-blur-md sm:text-xs"
                    >
                        <Sparkles size={14} />
                        The Journey Has Just Begun
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                        className="mt-7 text-4xl font-black leading-[1.25] tracking-[-0.05em] sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        We&apos;re Building
                        <span className="block bg-gradient-to-r from-[#FEDF24] via-[#b9d477] to-[#44807F] bg-clip-text text-transparent">
                            Something Bigger.
                        </span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35, duration: 0.7 }}
                        className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#17302E]/55 sm:text-base sm:leading-8 md:text-lg"
                    >
                        OutSold is growing with every event, organizer and
                        experience we help bring to life. Soon, these numbers
                        will tell the story of everything we build together.
                    </motion.p>
                </motion.div>

                {/* CENTER VISUAL */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: 0.45,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative mx-auto mt-12 flex h-28 w-28 items-center justify-center sm:mt-14 sm:h-32 sm:w-32"
                >
                    {/* Outer Glow */}
                    <div className="absolute inset-0 rounded-full bg-[#FEDF24]/20 blur-2xl" />

                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border border-[#44807F]/20" />

                    {/* Inner Ring */}
                    <div className="absolute inset-3 rounded-full border border-dashed border-[#44807F]/25" />

                    {/* Icon */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FEDF24] to-[#44807F] shadow-xl shadow-[#44807F]/15 sm:h-20 sm:w-20">
                        <TrendingUp
                            size={30}
                            strokeWidth={2}
                            className="text-[#17302E] sm:h-9 sm:w-9"
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
                        className="absolute right-1 top-2 h-3 w-3 rounded-full bg-[#44807F] shadow-[0_0_15px_rgba(68,128,127,0.5)]"
                    />
                </motion.div>

                {/* COMING SOON MESSAGE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="mt-8 text-center"
                >
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#17302E]/35">
                        Platform statistics
                    </p>

                    <h3 className="mt-3 text-2xl font-black text-[#17302E] sm:text-3xl">
                        The numbers are
                        <span className="ml-2 bg-gradient-to-r from-[#44807F] to-[#6d9b7f] bg-clip-text text-transparent">
                            coming soon.
                        </span>
                    </h3>
                </motion.div>

                {/* MILESTONE CARDS */}
                <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">

                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.65, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="group relative overflow-hidden rounded-2xl border border-[#44807F]/15 bg-white/75 p-5 shadow-lg shadow-[#17302E]/[0.04] backdrop-blur-md transition sm:p-6"
                    >
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FEDF24]/15 blur-3xl" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FEDF24]/15 text-[#b19400] transition group-hover:bg-[#FEDF24] group-hover:text-[#17302E]">
                                <CalendarDays size={21} />
                            </div>

                            <div>
                                <p className="text-sm font-black text-[#17302E]">
                                    More Events
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#17302E]/45">
                                    New experiences are joining the platform.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.72, duration: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="group relative overflow-hidden rounded-2xl border border-[#44807F]/15 bg-white/75 p-5 shadow-lg shadow-[#17302E]/[0.04] backdrop-blur-md transition sm:p-6"
                    >
                        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#44807F]/12 blur-3xl" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10 text-[#44807F] transition group-hover:bg-[#44807F] group-hover:text-white">
                                <Users size={21} />
                            </div>

                            <div>
                                <p className="text-sm font-black text-[#17302E]">
                                    Growing Community
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#17302E]/45">
                                    More organizers and audiences are coming.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Progress Line */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.85, duration: 0.8 }}
                    className="mx-auto mt-12 flex max-w-md items-center gap-3"
                >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#44807F]/30" />

                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FEDF24]" />
                        <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-[#FEDF24] to-[#44807F]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#44807F]" />
                    </div>

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FEDF24]/30" />
                </motion.div>

                {/* Bottom Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-[#17302E]/35"
                >
                    <Ticket size={14} className="text-[#44807F]" />
                    <span>Big things are being built.</span>
                    <ArrowUpRight
                        size={14}
                        className="text-[#FEDF24]"
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default PlatformStatistics;