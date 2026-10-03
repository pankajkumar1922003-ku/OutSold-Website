import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    FileText,
    Layers3,
    Sparkles,
    Ticket,
    Users,
    Wallet,
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

const floatingFeatures = [
    {
        icon: Layers3,
        title: "All-in-One Management",
        yellow: true,
        position: "left-0 top-[8%]",
    },
    {
        icon: Users,
        title: "Smart Attendees",
        yellow: false,
        position: "right-0 top-[25%]",
    },
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
        yellow: true,
        position: "left-0 top-[44%]",
    },
    {
        icon: Wallet,
        title: "UPI Payments",
        yellow: false,
        position: "right-0 bottom-[25%]",
    },
    {
        icon: FileText,
        title: "Powerful Reports",
        yellow: true,
        position: "left-0 bottom-[7%]",
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
            className="relative overflow-hidden bg-[#FFFBEA] text-[#142522]"
        >
            {/* LIGHT TOP AREA */}
            <div className="relative overflow-hidden py-6">
                {/* Background Glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-52 top-10 h-[520px] w-[520px] rounded-full bg-[#FEDF24]/25 blur-[150px]" />

                    <div className="absolute -right-52 top-[20%] h-[600px] w-[600px] rounded-full bg-[#44807F]/15 blur-[160px]" />

                    <div className="absolute bottom-[-250px] left-[25%] h-[500px] w-[500px] rounded-full bg-[#FEDF24]/20 blur-[150px]" />

                    <div className="absolute left-[50%] top-[35%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-white/80 blur-[120px]" />
                </div>

                {/* Top Glow Line */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#44807F]/40 to-transparent" />

                <div className="relative z-10 mx-auto mt-20 max-w-7xl px-5 md:mt-32 sm:px-8 lg:px-10">
                    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

                        {/* DESKTOP IMAGE */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="relative order-2 hidden md:-mt-16 md:block lg:order-1"
                        >
                            <img
                                src="/Dashboard.png"
                                alt="OutSold Organizer Dashboard"
                                className="mx-auto h-auto w-[60%] object-contain"
                            />

                            {/* Desktop Floating Feature Cards */}
                            {floatingFeatures.map((feature, index) => {
                                const Icon = feature.icon;

                                return (
                                    <motion.div
                                        key={feature.title}
                                        animate={{
                                            y: [
                                                0,
                                                index % 2 === 0 ? -7 : 7,
                                                0,
                                            ],
                                        }}
                                        transition={{
                                            duration: 4 + index * 0.2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className={`absolute ${feature.position} z-20 flex items-center gap-3 rounded-2xl border border-[#44807F]/10 bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(68,128,127,0.12)] backdrop-blur-xl`}
                                    >
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.yellow
                                                    ? "bg-[#FEDF24]/20"
                                                    : "bg-[#44807F]/10"
                                                }`}
                                        >
                                            <Icon
                                                size={18}
                                                className="text-[#44807F]"
                                            />
                                        </div>

                                        <span className="whitespace-nowrap text-xs font-bold text-[#142522]">
                                            {feature.title}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* CONTENT */}
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
                            <div className="mt-2 flex items-center justify-center">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#44807F]/15 bg-white/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#44807F] shadow-sm backdrop-blur-md sm:text-xs">
                                    <Sparkles size={14} />
                                    Built for Event Organizers
                                </div>
                            </div>

                            {/* Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.15,
                                    duration: 0.7,
                                }}
                                className="max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.045em] text-[#142522] sm:text-5xl md:text-6xl"
                            >
                                Turn your event into
                                <span className="relative mt-2 inline-block text-[#44807F]">
                                    an Experience.
                                    <span className="absolute -bottom-2 left-0 h-[4px] w-full rounded-full bg-[#FEDF24]" />
                                </span>
                            </motion.h2>

                            {/* MOBILE IMAGE */}
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


                                {/* Mobile Floating Feature Cards */}
                                {floatingFeatures.map((feature, index) => {
                                    const Icon = feature.icon;

                                    // Mobile-only positions and compact badge sizing
                                    const mobilePositions = [
                                        "left-0 top-[5%]",
                                        "right-0 top-[24%]",
                                        "left-0 top-[43%]",
                                        "right-0 bottom-[24%]",
                                        "left-0 bottom-[5%]",
                                    ];

                                    return (
                                        <motion.div
                                            key={feature.title}
                                            animate={{
                                                y: [0, index % 2 === 0 ? -3 : 3, 0],
                                            }}
                                            transition={{
                                                duration: 4 + index * 0.2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className={`absolute ${mobilePositions[index]} z-20 flex w-fit max-w-[44%] items-center gap-2 rounded-xl border border-[#44807F]/10 bg-white/95 px-2 py-2 shadow-[0_12px_30px_rgba(68,128,127,0.12)] backdrop-blur-xl`}
                                        >
                                            <div
                                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${feature.yellow
                                                        ? "bg-[#FEDF24]/20"
                                                        : "bg-[#44807F]/10"
                                                    }`}
                                            >
                                                <Icon
                                                    size={14}
                                                    className="text-[#44807F]"
                                                />
                                            </div>

                                            <span className="min-w-0 whitespace-normal break-words text-[9px] font-bold leading-tight text-[#142522] sm:text-[10px]">
                                                {feature.title}
                                            </span>
                                        </motion.div>
                                    );
                                })}
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
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* DARK TEAL SECTION */}
            <div className="relative overflow-hidden bg-[#0B1512] px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:px-10">
                {/* Dark Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {/* Smooth Light to Dark Transition */}
                    <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-b from-[#FFFBEA] via-[#13251F] to-[#0B1512]" />

                    {/* Left Teal Glow */}
                    <div className="absolute -left-52 top-10 h-[520px] w-[520px] rounded-full bg-[#2F7775]/25 blur-[160px]" />

                    {/* Right Teal Glow */}
                    <div className="absolute -right-52 top-[15%] h-[600px] w-[600px] rounded-full bg-[#44807F]/20 blur-[170px]" />

                    {/* Center Green Glow */}
                    <div className="absolute left-1/2 top-[35%] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#173A35]/70 blur-[140px]" />

                    {/* Yellow Atmosphere */}
                    <div className="absolute bottom-[-220px] left-[25%] h-[500px] w-[500px] rounded-full bg-[#FEDF24]/[0.06] blur-[150px]" />
                </div>

                {/* Faint Grid */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(143,199,168,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(143,199,168,0.9) 1px, transparent 1px)",
                        backgroundSize: "70px 70px",
                    }}
                />

                {/* Section Accent */}
                <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[75%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FEDF24]/35 to-transparent" />

                <div className="relative z-10 mx-auto max-w-7xl">
                    {/* Mini Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid max-w-lg grid-cols-3 border-t border-white/10 pt-6"
                    >
                        <div>
                            <p className="text-xl font-black text-white sm:text-2xl">
                                1K+
                            </p>

                            <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
                                Events Created
                            </p>
                        </div>

                        <div className="border-l border-white/10 pl-4 sm:pl-6">
                            <p className="text-xl font-black text-white sm:text-2xl">
                                50K+
                            </p>

                            <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
                                Tickets Sold
                            </p>
                        </div>

                        <div className="border-l border-white/10 pl-4 sm:pl-6">
                            <p className="text-xl font-black text-white sm:text-2xl">
                                24/7
                            </p>

                            <p className="mt-1 text-[10px] text-white/40 sm:text-xs">
                                Event Control
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature Cards */}
                    <div className="mt-10 grid grid-cols-3 gap-2 sm:mt-16 sm:gap-4">
                        {organizerFeatures.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ y: -5 }}
                                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] p-3 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 hover:border-[#44807F]/40 hover:bg-white/[0.09] sm:p-5"
                                >
                                    {/* Card Glow */}
                                    <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#FEDF24]/10 blur-[50px] transition-all duration-300 group-hover:bg-[#FEDF24]/15" />

                                    <div className="relative flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEDF24]/15 to-[#44807F]/15 text-[#FEDF24] transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#FEDF24] group-hover:to-[#44807F] group-hover:text-[#17302E]">
                                            <Icon size={20} />
                                        </div>

                                        <div>
                                            <h3 className="text-xs font-bold text-white sm:text-base">
                                                {feature.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Bottom Accent */}
                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FEDF24] to-[#44807F] transition-all duration-500 group-hover:w-full" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateEventSection;