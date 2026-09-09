import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    CircleDollarSign,
    Ticket,
    Users,
    WalletCards,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";

const organizerFeatures = [
    {
        icon: Ticket,
        title: "Sell Tickets Online",
        description:
            "Create ticket types, set pricing, manage availability and start selling instantly.",
    },
    {
        icon: Users,
        title: "Manage Attendees",
        description:
            "Track registrations, attendee details and event check-ins from one dashboard.",
    },
    {
        icon: BarChart3,
        title: "Track Performance",
        description:
            "Monitor ticket sales, revenue and event performance with real-time insights.",
    },
    {
        icon: WalletCards,
        title: "Manage Payments",
        description:
            "Keep track of transactions, revenue and event earnings in one organized place.",
    },
];

const CreateEventSection = () => {
    return (
        <section
            id="createEvents"
            className="relative overflow-hidden bg-[#EEF1F3] py-14 text-[#102B2A] sm:py-20"
        >
            {/* Soft Background Effects */}
            <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[#007A78]/10 blur-[160px]" />

            <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-slate-400/10 blur-[160px]" />

            <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#007A78]/20 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
                    
                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {/* Badge */}
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#007A78]/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#007A78] shadow-sm">
                            <TrendingUp size={15} />
                            Built for Organizers
                        </div>

                        {/* Heading */}
                        <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#1D2B2B] sm:text-5xl lg:text-6xl">
                            Create.
                            
                            <span className="text-[#1D2B2B]/40">
                                {" "}Manage.
                            </span>

                            <span className="mt-2 block bg-gradient-to-r from-[#006E6B] via-[#008985] to-[#1AA39E] bg-clip-text text-transparent">
                                Sell Out Your Event.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mt-6 max-w-xl text-base leading-8 text-[#1D2B2B]/65 sm:text-lg">
                            From creating your event to selling the last ticket,
                            manage everything from one powerful dashboard built
                            for modern event organizers.
                        </p>

                        {/* Benefits */}
                        <div className="mt-7 space-y-4">
                            {[
                                "Create unlimited event listings",
                                "Manage tickets and attendees",
                                "Track revenue and performance",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-[#1D2B2B]/75 sm:text-base"
                                >
                                    <CheckCircle2
                                        size={19}
                                        className="shrink-0 text-[#007A78]"
                                    />

                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.a
                            href="https://app.outsold.in/login"
                            target="_blank"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#007A78] px-7 py-4 text-base font-semibold text-white shadow-xl shadow-[#007A78]/20 transition hover:bg-[#006966]"
                        >
                            Create Your Event

                            <ArrowRight
                                size={19}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </motion.a>
                    </motion.div>

                    {/* RIGHT SIDE DASHBOARD */}
                    <motion.div
                        initial={{ opacity: 0, x: 60, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.9,
                            delay: 0.15,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative"
                    >
                        {/* Main Dashboard */}
                        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-400/15 sm:p-6">
                            
                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.15em] text-[#1D2B2B]/40">
                                        Organizer Dashboard
                                    </p>

                                    <h3 className="mt-1 text-lg font-semibold text-[#1D2B2B] sm:text-xl">
                                        Summer Music Festival
                                    </h3>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#007A78]/10 text-[#007A78]">
                                    <CalendarDays size={21} />
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className="rounded-2xl border border-slate-200 bg-[#F7F8F9] p-4 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#1D2B2B]/50">
                                            Revenue
                                        </span>

                                        <CircleDollarSign
                                            size={18}
                                            className="text-[#007A78]"
                                        />
                                    </div>

                                    <h4 className="mt-3 text-2xl font-bold text-[#1D2B2B] sm:text-3xl">
                                        ₹2.48L
                                    </h4>

                                    <p className="mt-2 text-xs font-medium text-[#007A78]">
                                        +18.2% this week
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className="rounded-2xl border border-slate-200 bg-[#F7F8F9] p-4 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#1D2B2B]/50">
                                            Tickets Sold
                                        </span>

                                        <Ticket
                                            size={18}
                                            className="text-[#007A78]"
                                        />
                                    </div>

                                    <h4 className="mt-3 text-2xl font-bold text-[#1D2B2B] sm:text-3xl">
                                        1,284
                                    </h4>

                                    <p className="mt-2 text-xs text-[#1D2B2B]/45">
                                        of 2,000 tickets
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className="rounded-2xl border border-slate-200 bg-[#F7F8F9] p-4 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#1D2B2B]/50">
                                            Attendees
                                        </span>

                                        <Users
                                            size={18}
                                            className="text-[#007A78]"
                                        />
                                    </div>

                                    <h4 className="mt-3 text-2xl font-bold text-[#1D2B2B] sm:text-3xl">
                                        1,126
                                    </h4>

                                    <p className="mt-2 text-xs text-[#1D2B2B]/45">
                                        87.6% confirmed
                                    </p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ y: -4 }}
                                    className="rounded-2xl border border-slate-200 bg-[#F7F8F9] p-4 transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-[#1D2B2B]/50">
                                            Conversion
                                        </span>

                                        <TrendingUp
                                            size={18}
                                            className="text-[#007A78]"
                                        />
                                    </div>

                                    <h4 className="mt-3 text-2xl font-bold text-[#1D2B2B] sm:text-3xl">
                                        64.2%
                                    </h4>

                                    <p className="mt-2 text-xs font-medium text-[#007A78]">
                                        +7.4% growth
                                    </p>
                                </motion.div>
                            </div>

                            {/* Sales Chart */}
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-[#F7F8F9] p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1D2B2B]">
                                            Ticket Sales
                                        </p>

                                        <p className="mt-1 text-xs text-[#1D2B2B]/45">
                                            Last 7 days
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-[#007A78]/10 px-3 py-1 text-xs font-medium text-[#007A78]">
                                        Live
                                    </span>
                                </div>

                                <div className="mt-6 flex h-32 items-end gap-2 sm:gap-3">
                                    {[36, 52, 46, 70, 58, 84, 100].map(
                                        (height, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ height: 0 }}
                                                whileInView={{
                                                    height: `${height}%`,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.7,
                                                    delay: 0.3 + index * 0.08,
                                                }}
                                                className="relative flex-1 overflow-hidden rounded-t-lg bg-gradient-to-t from-[#006E6B] to-[#48D1CC]"
                                            />
                                        )
                                    )}
                                </div>

                                <div className="mt-3 flex justify-between text-[10px] text-[#1D2B2B]/40">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>
                            </div>

                            {/* Recent Sale */}
                            <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#007A78]/10 bg-[#007A78]/5 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007A78]/10">
                                        <Ticket
                                            size={18}
                                            className="text-[#007A78]"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-[#1D2B2B]">
                                            New Ticket Sale
                                        </p>

                                        <p className="text-xs text-[#1D2B2B]/45">
                                            VIP Pass • 2 tickets
                                        </p>
                                    </div>
                                </div>

                                <span className="text-sm font-semibold text-[#007A78]">
                                    +₹3,998
                                </span>
                            </div>
                        </div>

                        {/* Floating Revenue Card */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -right-3 -top-6 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-400/15 sm:block lg:-right-8"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007A78]/10">
                                    <WalletCards
                                        size={18}
                                        className="text-[#007A78]"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-[#1D2B2B]/45">
                                        Today's Revenue
                                    </p>

                                    <p className="mt-1 font-bold text-[#1D2B2B]">
                                        ₹34,850
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Attendee Card */}
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{
                                duration: 4.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -bottom-7 -left-3 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-400/15 sm:block lg:-left-8"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007A78]/10">
                                    <Users
                                        size={18}
                                        className="text-[#007A78]"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-[#1D2B2B]/45">
                                        New Attendees
                                    </p>

                                    <p className="mt-1 font-bold text-[#1D2B2B]">
                                        +128 this week
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* FEATURES */}
                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {organizerFeatures.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                whileHover={{ y: -7 }}
                                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-400/10 transition hover:border-[#007A78]/20 hover:shadow-xl"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#007A78]/10 text-[#007A78] transition duration-300 group-hover:bg-[#007A78] group-hover:text-white">
                                    <Icon size={22} />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-[#1D2B2B]">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-[#1D2B2B]/55">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CreateEventSection;

