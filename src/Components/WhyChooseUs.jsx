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
    },
    {
        icon: Users,
        title: "Smart Attendee Management",
    },
    {
        icon: BarChart3,
        title: "Real-Time Analytics",
    },
    {
        icon: Wallet,
        title: "Built-In Profit & Loss",
    },
    {
        icon: QrCode,
        title: "Flexible UPI Payments",
        highlight: true,
    },
    {
        icon: ShieldCheck,
        title: "Role-Based Team Access",
    },
    {
        icon: Ticket,
        title: "Smart Ticket Control",
    },
    {
        icon: FileText,
        title: "Powerful Reports",
    },
];

const WhyChooseUs = () => {
    return (
        <section
            id="why-choose-us"
            className="relative overflow-hidden bg-[#F7FAF9] py-14 sm:py-20"
        >
            {/* Background Decorative Elements */}
            <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#007A78]/10 blur-[150px]" />

            <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#20B2AA]/10 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#007A78]/15 bg-[#007A78]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#007A78]">
                        <Sparkles size={15} />
                        Why Choose Us
                    </div>

                    <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#16302E] sm:text-5xl lg:text-6xl">
                        Everything Your Event Needs.

                        <span className="mt-2 block text-[#007A78]">
                            All In One Platform.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#16302E]/60 sm:text-lg">
                        From your first event idea to the final report, manage
                        every part of your event journey without switching
                        between multiple tools.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="md:mt-16 mt-10 grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{
                                    opacity: 0,
                                    y: 40,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.08,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className={`group relative overflow-hidden rounded-lg border p-6 transition duration-300 ${
                                    feature.highlight
                                        ? "border-[#007A78]/25 bg-[#007A78] shadow-xl shadow-[#007A78]/20"
                                        : "border-[#007A78]/10 bg-white shadow-lg shadow-[#007A78]/5 hover:border-[#007A78]/25 hover:shadow-xl"
                                }`}
                            >
                                {/* Decorative Glow */}
                                <div
                                    className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-[60px] ${
                                        feature.highlight
                                            ? "bg-white/10"
                                            : "bg-[#007A78]/5"
                                    }`}
                                />

                                {/* Icon */}
                                <div
                                    className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 ${
                                        feature.highlight
                                            ? "bg-white/15 text-white"
                                            : "bg-[#007A78]/10 text-[#007A78] group-hover:bg-[#007A78] group-hover:text-white"
                                    }`}
                                >
                                    <Icon size={22} />
                                </div>

                                {/* Content */}
                                <h3
                                    className={`relative mt-6 text-lg font-semibold ${
                                        feature.highlight
                                            ? "text-white"
                                            : "text-[#16302E]"
                                    }`}
                                >
                                    {feature.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Highlight Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative mt-10 md:mt-16 overflow-hidden rounded-[32px] border border-[#007A78]/15 bg-white p-8 shadow-xl shadow-[#007A78]/5 sm:p-12"
                >
                    {/* Green Side Background */}
                    <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-transparent to-[#007A78]/10" />

                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#007A78]">
                                <Sparkles size={17} />
                                OUR BIGGEST ADVANTAGE
                            </div>

                            <h3 className="mt-4 text-2xl font-bold text-[#16302E] sm:text-3xl lg:text-4xl">
                                Stop Managing Events With Multiple Tools.
                            </h3>

                            <p className="mt-4 leading-7 text-[#16302E]/60">
                                Event creation, attendees, ticket sales,
                                payments, expenses, analytics and reports —
                                everything works together in one seamless
                                platform.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {[
                                    "No mandatory payment gateway",
                                    "Google Forms & Excel attendee import",
                                    "Automatic profit & loss tracking",
                                    "Real-time ticket sales analytics",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 text-sm text-[#16302E]/70"
                                    >
                                        <CheckCircle2
                                            size={18}
                                            className="shrink-0 text-[#007A78]"
                                        />

                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <motion.a
                            href="https://app.outsold.in/login"
                            target="_blank"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#007A78] px-7 py-4 font-semibold text-white shadow-xl shadow-[#007A78]/20 transition hover:bg-[#00918E]"
                        >
                            Get Started

                            <ArrowRight
                                size={19}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

