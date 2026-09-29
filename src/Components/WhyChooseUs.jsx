import { motion } from "framer-motion";
import {
    Layers3,
    Users,
    BarChart3,
    Wallet,
    QrCode,
    ShieldCheck,
    Ticket,
    FileText,
    CheckCircle2,
    ArrowRight,
    Sparkles,
} from "lucide-react";

const features = [
    {
        icon: Layers3,
        title: "All-in-One Management",
        description: "Run your entire event from one organized workspace.",
    },
    {
        icon: Users,
        title: "Smart Attendee Management",
        description: "Keep registrations, attendees and entries organized.",
    },
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
        description: "See ticket sales and event performance as it happens.",
    },
    {
        icon: Wallet,
        title: "Profit & Loss Tracking",
        description:
            "Understand your revenue, expenses and event profitability.",
    },
    {
        icon: QrCode,
        title: "Flexible UPI Payments",
        description:
            "Accept payments with the flexibility your event needs.",
        highlight: true,
    },
    {
        icon: ShieldCheck,
        title: "Team Access",
        description:
            "Give your team the right access without losing control.",
    },
    {
        icon: Ticket,
        title: "Smart Ticket Control",
        description:
            "Create, manage and track your ticketing with ease.",
    },
    {
        icon: FileText,
        title: "Powerful Reports",
        description:
            "Get the insights you need after every event.",
    },
];

const WhyChooseUs = () => {
    return (
        <section
            id="why-choose-us"
            className="relative overflow-hidden bg-[#102725] py-16 text-white sm:py-24 lg:py-28"
        >
            {/* ================= BACKGROUND GLOW ================= */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Yellow glow */}
                <div className="absolute -left-52 top-10 h-[520px] w-[520px] rounded-full bg-[#FEDF24]/10 blur-[150px]" />

                {/* Teal glow */}
                <div className="absolute -right-52 top-[25%] h-[600px] w-[600px] rounded-full bg-[#44807F]/20 blur-[160px]" />

                {/* Bottom yellow glow */}
                <div className="absolute bottom-[-220px] left-[25%] h-[500px] w-[500px] rounded-full bg-[#FEDF24]/8 blur-[150px]" />

                {/* Center teal glow */}
                <div className="absolute left-[48%] top-[30%] h-[300px] w-[300px] rounded-full bg-[#44807F]/10 blur-[120px]" />
            </div>

            {/* ================= TOP ACCENT ================= */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FEDF24]/70 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* ================= HEADER ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#44807F]/30 bg-white/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FEDF24] shadow-sm backdrop-blur-md sm:text-xs">
                        <Sparkles size={14} />
                        Built For Organizers
                    </div>

                    {/* Heading */}
                    <h2 className="mt-6 text-4xl font-black leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
                        Everything You Need.
                        <span className="mt-2 block bg-gradient-to-r from-[#FEDF24] via-[#8caf82] to-[#44807F] bg-clip-text text-transparent">
                            Nothing You Don't.
                        </span>
                    </h2>

                    {/* Paragraph */}
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8 md:text-lg">
                        From your first ticket sale to the final event report,
                        OutSold brings your entire event operation together in
                        one simple, powerful platform.
                    </p>
                </motion.div>

                {/* ================= FEATURE GRID ================= */}
                <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 sm:gap-5 lg:grid-cols-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.55,
                                    delay: index * 0.07,
                                }}
                                whileHover={{ y: -7 }}
                                className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 sm:p-6 ${
                                    feature.highlight
                                        ? "border-[#44807F]/40 bg-gradient-to-br from-[#44807F] to-[#306866] text-white shadow-xl shadow-black/20"
                                        : "border-white/10 bg-white/[0.06] text-white shadow-lg shadow-black/10 backdrop-blur-md hover:border-[#44807F]/40 hover:bg-white/[0.10] hover:shadow-xl"
                                }`}
                            >
                                {/* ================= CARD GLOW ================= */}
                                <div
                                    className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-[55px] ${
                                        feature.highlight
                                            ? "bg-[#FEDF24]/20"
                                            : "bg-[#FEDF24]/10"
                                    }`}
                                />

                                {/* ================= NUMBER ================= */}
                                <span
                                    className={`absolute right-5 top-5 text-[10px] font-black tracking-widest ${
                                        feature.highlight
                                            ? "text-white/25"
                                            : "text-white/20"
                                    }`}
                                >
                                    0{index + 1}
                                </span>

                                {/* ================= ICON ================= */}
                                <div
                                    className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 sm:h-14 sm:w-14 ${
                                        feature.highlight
                                            ? "bg-white/15 text-[#FEDF24]"
                                            : "bg-gradient-to-br from-[#FEDF24]/15 to-[#44807F]/15 text-[#FEDF24] group-hover:bg-gradient-to-br group-hover:from-[#FEDF24] group-hover:to-[#44807F] group-hover:text-[#17302E]"
                                    }`}
                                >
                                    <Icon size={22} />
                                </div>

                                {/* ================= CONTENT ================= */}
                                <h3
                                    className={`relative mt-5 text-sm font-black leading-5 sm:text-base ${
                                        feature.highlight
                                            ? "text-white"
                                            : "text-white"
                                    }`}
                                >
                                    {feature.title}
                                </h3>

                                <p
                                    className={`relative mt-2 text-[11px] leading-5 sm:text-xs sm:leading-6 ${
                                        feature.highlight
                                            ? "text-white/65"
                                            : "text-white/55"
                                    }`}
                                >
                                    {feature.description}
                                </p>

                                {/* ================= BOTTOM ACCENT ================= */}
                                <div
                                    className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FEDF24] to-[#44807F] transition-all duration-500 group-hover:w-full ${
                                        feature.highlight
                                            ? "opacity-0"
                                            : ""
                                    }`}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* ================= BOTTOM CTA ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative mt-12 overflow-hidden rounded-[28px] border border-[#44807F]/25 bg-white/[0.06] shadow-xl shadow-black/20 backdrop-blur-md sm:mt-16 sm:rounded-[36px]"
                >
                    {/* ================= CTA BACKGROUND ================= */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -left-20 -top-32 h-72 w-72 rounded-full bg-[#FEDF24]/10 blur-[100px]" />

                        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-[#44807F]/20 blur-[100px]" />

                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#44807F]/[0.08] to-transparent" />
                    </div>

                    <div className="relative flex flex-col gap-8 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">

                        {/* ================= CTA CONTENT ================= */}
                        <div className="max-w-3xl">

                            {/* Small Label */}
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FEDF24] sm:text-xs">
                                <span className="h-2 w-2 rounded-full bg-[#FEDF24] shadow-[0_0_10px_rgba(254,223,36,0.6)]" />
                                One Platform. Complete Control.
                            </div>

                            {/* CTA Heading */}
                            <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                                Stop Juggling Tools.
                                <span className="block bg-gradient-to-r from-[#FEDF24] to-[#6c9d83] bg-clip-text text-transparent">
                                    Start Running Better Events.
                                </span>
                            </h3>

                            {/* CTA Description */}
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                                Create your event, manage your audience, track
                                your numbers and stay in control — without
                                jumping between different platforms.
                            </p>

                            {/* Benefits */}
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {[
                                    "No mandatory payment gateway",
                                    "Google Forms & Excel attendee import",
                                    "Automatic profit & loss tracking",
                                    "Real-time ticket sales analytics",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2.5 text-xs font-medium text-white/65 sm:text-sm"
                                    >
                                        <CheckCircle2
                                            size={17}
                                            className="shrink-0 text-[#FEDF24]"
                                        />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ================= CTA BUTTON ================= */}
                        <motion.a
                            href="https://app.outsold.in/login"
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            className="group flex shrink-0 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#FEDF24] via-[#dce982] to-[#44807F] px-6 py-4 text-sm font-black text-[#17302E] shadow-[0_15px_35px_rgba(68,128,127,0.25)] transition sm:px-7"
                        >
                            Get Started

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17302E]/10">
                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </span>
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;