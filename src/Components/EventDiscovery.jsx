import { motion } from "framer-motion";
import {
    Ticket,
    Sparkles,
    CalendarDays,
    ArrowRight,
} from "lucide-react";

const EventDiscovery = () => {
    return (
        <section
            id="events"
            className="relative min-h-[75vh] overflow-hidden bg-[#050909] text-white"
        >
            {/* ================= BACKGROUND EFFECTS ================= */}

            {/* Main teal glow */}
            <div className="pointer-events-none absolute left-1/2 top-[20%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#007A78]/20 blur-[150px]" />

            {/* Side glow */}
            <div className="pointer-events-none absolute -left-32 bottom-0 h-[300px] w-[300px] rounded-full bg-[#20B2AA]/10 blur-[120px]" />

            <div className="pointer-events-none absolute -right-32 top-20 h-[300px] w-[300px] rounded-full bg-[#007A78]/10 blur-[120px]" />

            {/* Subtle grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* ================= CONTENT ================= */}

            <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-5 py-20 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mx-auto w-full max-w-3xl text-center"
                >
                    {/* Small Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#20B2AA]/20 bg-[#007A78]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#48D1CC] backdrop-blur-md sm:px-5 sm:py-2.5"
                    >
                        <Sparkles size={14} />
                        <span>Something Exciting Is Coming</span>
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: 0.35,
                            duration: 0.7,
                            type: "spring",
                            stiffness: 120,
                        }}
                        className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-[28px] bg-[#20B2AA]/20 blur-2xl" />

                        {/* Icon Box */}
                        <div className="relative flex h-full w-full items-center justify-center rounded-[26px] border border-[#20B2AA]/20 bg-[#0b1515]/80 shadow-2xl shadow-[#007A78]/20 backdrop-blur-xl">
                            <Ticket
                                size={38}
                                strokeWidth={1.5}
                                className="text-[#48D1CC] sm:h-11 sm:w-11"
                            />
                        </div>

                        {/* Floating dot */}
                        <motion.span
                            animate={{
                                scale: [1, 1.25, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#48D1CC] shadow-lg shadow-[#48D1CC]/50"
                        />
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.7 }}
                        className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        Events Are
                        <span className="mt-2 block bg-gradient-to-r from-white via-[#48D1CC] to-[#20B2AA] bg-clip-text text-transparent">
                            Coming Soon.
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                        className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/50 sm:text-base sm:leading-8 md:text-lg"
                    >
                        We&apos;re building a better way to discover and
                        experience local events. Concerts, parties, comedy
                        nights, workshops and more are on the way.
                    </motion.p>

                    {/* ================= INFO CARDS ================= */}

                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75, duration: 0.7 }}
                        className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        {/* Card 1 */}
                        <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left backdrop-blur-xl transition duration-300 hover:border-[#20B2AA]/25 hover:bg-[#007A78]/5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#007A78]/15 text-[#48D1CC]">
                                <CalendarDays size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Local Events
                                </p>

                                <p className="mt-1 text-xs text-white/40">
                                    Discover what&apos;s happening nearby
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left backdrop-blur-xl transition duration-300 hover:border-[#20B2AA]/25 hover:bg-[#007A78]/5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#007A78]/15 text-[#48D1CC]">
                                <Ticket size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Easy Booking
                                </p>

                                <p className="mt-1 text-xs text-white/40">
                                    Find and book experiences effortlessly
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ================= COMING SOON LINE ================= */}

                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{
                            delay: 0.9,
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                        className="mx-auto mt-10 flex max-w-xs items-center gap-3"
                    >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#20B2AA]/30" />

                        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.25em] text-[#48D1CC]/60">
                            Stay Tuned
                        </span>

                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#20B2AA]/30" />
                    </motion.div>

                    {/* Animated dots */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="mt-6 flex justify-center gap-2"
                    >
                        {[0, 1, 2].map((dot) => (
                            <motion.span
                                key={dot}
                                animate={{
                                    y: [0, -5, 0],
                                    opacity: [0.35, 1, 0.35],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: dot * 0.18,
                                }}
                                className="h-1.5 w-1.5 rounded-full bg-[#48D1CC]"
                            />
                        ))}
                    </motion.div>

                    {/* Bottom hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.25 }}
                        className="mt-8 flex items-center justify-center gap-2 text-xs text-white/30"
                    >
                        <span>We&apos;ll be live soon</span>

                        <ArrowRight
                            size={14}
                            className="text-[#20B2AA]"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default EventDiscovery;