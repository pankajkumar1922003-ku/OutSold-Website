import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    Sparkles,
    Ticket,
    Users,
} from "lucide-react";
import { useLayoutEffect } from "react";

const organizerFeatures = [
    {
        icon: CalendarDays,
        title: "Create Events",
        description: "Build and launch your event in minutes.",
    },
    {
        icon: Ticket,
        title: "Sell Tickets",
        description: "Manage ticket sales from one place.",
    },
    {
        icon: Users,
        title: "Manage Attendees",
        description: "Keep your audience and bookings organized.",
    },
];

const CreateEventSection = () => {
    useLayoutEffect(() => {
        window.history.scrollRestoration = "manual";

        document.documentElement.style.scrollBehavior = "auto";
        document.body.style.scrollBehavior = "auto";

        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        return () => {
            document.documentElement.style.scrollBehavior = "";
            document.body.style.scrollBehavior = "";
        };
    }, []);

    return (
        <section
            id="createEvents"
            className="relative overflow-hidden bg-[#FFFBEA] py-16 text-[#142522]"
        >
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-52 top-10 h-[520px] w-[520px] rounded-full bg-[#FEDF24]/25 blur-[150px]" />

                <div className="absolute -right-52 top-[20%] h-[600px] w-[600px] rounded-full bg-[#44807F]/15 blur-[160px]" />

                <div className="absolute bottom-[-250px] left-[25%] h-[500px] w-[500px] rounded-full bg-[#FEDF24]/20 blur-[150px]" />

                <div className="absolute left-[50%] top-[35%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-white/80 blur-[120px]" />
            </div>

            {/* Top Glow Line */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#44807F]/40 to-transparent" />

            <div className="md:mt-10 mt-16  relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

                    {/* =========================
                        DESKTOP IMAGE
                    ========================== */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative order-2 hidden md:block lg:order-1 md:-mt-16"
                    >
                        <img
                            src="/Dashboard.png"
                            alt="OutSold Organizer Dashboard"
                            className="mx-auto h-auto w-[60%] object-contain"
                        />

                        {/* Floating Revenue Card */}
                        <motion.div
                            animate={{ y: [0, -7, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -right-8 -top-10 rounded-2xl border border-[#44807F]/10 bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(68,128,127,0.12)] backdrop-blur-xl sm:block md:right-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEDF24]/20">
                                    <BarChart3
                                        size={18}
                                        className="text-[#44807F]"
                                    />
                                </div>

                                <div>
                                    <p className="text-[10px] text-[#142522]/45">
                                        Event Revenue
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-[#142522]">
                                        +24.8%
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Ticket Card */}
                        <motion.div
                            animate={{ y: [0, 7, 0] }}
                            transition={{
                                duration: 4.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -bottom-5 -left-3 rounded-2xl border border-[#44807F]/10 bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(68,128,127,0.12)] backdrop-blur-xl sm:block lg:left-10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#44807F]/10">
                                    <Ticket
                                        size={18}
                                        className="text-[#44807F]"
                                    />
                                </div>

                                <div>
                                    <p className="text-[10px] text-[#142522]/45">
                                        Tickets Sold
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-[#142522]">
                                        1,284
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* =========================
                        CONTENT
                    ========================== */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="order-1 lg:order-2"
                    >
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#44807F]/15 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#44807F] shadow-sm backdrop-blur-md sm:text-xs">
                            <Sparkles size={14} />
                            Built for Event Organizers
                        </div>

                        {/* Heading */}
                        <h2 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-[-0.045em] text-[#142522] sm:text-5xl md:text-6xl">
                            Your Event.

                            <span className="block text-[#142522]/35">
                                Your Audience.
                            </span>

                            <span className="mt-2 block bg-gradient-to-r from-[#FEDF24] via-[#b8c957] to-[#44807F] bg-clip-text text-transparent">
                                Your Growth.
                            </span>
                        </h2>

                        {/* =========================
                            MOBILE IMAGE
                            ========================== */}
                        {/* MOBILE IMAGE + FLOATING CARDS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="relative mt-4 md:hidden"
                        >
                            <img
                                src="/Dashboard.png"
                                alt="OutSold Organizer Dashboard"
                                className="mx-auto h-auto w-full object-contain"
                            />

                            {/* Mobile Revenue Card */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute right-0 top-2 rounded-xl border border-[#44807F]/10 bg-white/95 px-3 py-2 shadow-[0_12px_30px_rgba(68,128,127,0.12)] backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEDF24]/20">
                                        <BarChart3
                                            size={15}
                                            className="text-[#44807F]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[8px] text-[#142522]/45">
                                            Event Revenue
                                        </p>

                                        <p className="text-xs font-bold text-[#142522]">
                                            +24.8%
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Mobile Ticket Card */}
                            <motion.div
                                animate={{ y: [0, 5, 0] }}
                                transition={{
                                    duration: 4.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute bottom-2 left-0 rounded-xl border border-[#44807F]/10 bg-white/95 px-3 py-2 shadow-[0_12px_30px_rgba(68,128,127,0.12)] backdrop-blur-xl"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#44807F]/10">
                                        <Ticket
                                            size={15}
                                            className="text-[#44807F]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[8px] text-[#142522]/45">
                                            Tickets Sold
                                        </p>

                                        <p className="text-xs font-bold text-[#142522]">
                                            1,284
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Description */}
                        <p className="mt-6 max-w-xl text-sm leading-7 text-[#142522]/60 sm:text-base sm:leading-8">
                            Everything you need to create, manage and grow
                            successful events — all from one powerful
                            organizer dashboard.
                        </p>

                        {/* Benefits */}
                        <div className="mt-7 space-y-3.5">
                            {[
                                "Create and publish events effortlessly",
                                "Manage tickets, bookings and attendees",
                                "Track sales and event performance",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-[#142522]/75 sm:text-base"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#44807F]/10">
                                        <CheckCircle2
                                            size={15}
                                            className="text-[#44807F]"
                                        />
                                    </span>

                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <motion.a
                                href="https://app.outsold.in/login"
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.97 }}
                                className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#FEDF24] via-[#dce982] to-[#44807F] px-6 py-3.5 text-sm font-black text-[#142522] shadow-[0_15px_40px_rgba(68,128,127,0.18)] transition sm:px-7 sm:py-4"
                            >
                                Create Your Event

                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/10">
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </span>
                            </motion.a>

                            <span className="text-xs text-[#142522]/40 sm:text-sm">
                                Start creating in minutes
                            </span>
                        </div>

                        {/* Mini Stats */}
                        <div className="mt-10 grid max-w-lg grid-cols-3 border-t border-[#44807F]/15 pt-6">
                            <div>
                                <p className="text-xl font-black text-[#142522] sm:text-2xl">
                                    1K+
                                </p>

                                <p className="mt-1 text-[10px] text-[#142522]/40 sm:text-xs">
                                    Events Created
                                </p>
                            </div>

                            <div className="border-l border-[#44807F]/15 pl-4 sm:pl-6">
                                <p className="text-xl font-black text-[#142522] sm:text-2xl">
                                    50K+
                                </p>

                                <p className="mt-1 text-[10px] text-[#142522]/40 sm:text-xs">
                                    Tickets Sold
                                </p>
                            </div>

                            <div className="border-l border-[#44807F]/15 pl-4 sm:pl-6">
                                <p className="text-xl font-black text-[#142522] sm:text-2xl">
                                    24/7
                                </p>

                                <p className="mt-1 text-[10px] text-[#142522]/40 sm:text-xs">
                                    Event Control
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* =========================
                    BOTTOM FEATURE CARDS
                ========================== */}
                <div className="mt-10 grid gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4">
                    {organizerFeatures.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                whileHover={{ y: -5 }}
                                className="group rounded-2xl border border-[#44807F]/10 bg-white/65 p-4 shadow-[0_15px_40px_rgba(68,128,127,0.06)] backdrop-blur-md transition hover:border-[#44807F]/25 hover:bg-white sm:p-5"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEDF24]/25 to-[#44807F]/15 text-[#44807F] transition group-hover:from-[#FEDF24] group-hover:to-[#44807F] group-hover:text-[#142522]">
                                        <Icon size={20} />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-[#142522] sm:text-base">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-[#142522]/45">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CreateEventSection;