import { motion } from "framer-motion";
import {
    CalendarDays,
    Ticket,
    Users,
    IndianRupee,
    TrendingUp,
    Sparkles,
} from "lucide-react";

const statistics = [
    {
        icon: CalendarDays,
        value: "10K+",
        label: "Events Created",
    },
    {
        icon: Ticket,
        value: "500K+",
        label: "Tickets Sold",
    },
    {
        icon: Users,
        value: "250K+",
        label: "Happy Attendees",
    },
    {
        icon: IndianRupee,
        value: "₹10Cr+",
        label: "Revenue Generated",
    },
];

const PlatformStatistics = () => {
    return (
        <section
            id="statistics"
            className="relative overflow-hidden bg-[#EEF1F3] py-14 sm:py-20"
        >
            {/* Background Decorations */}
            <div className="absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-[#007A78]/10 blur-[150px]" />

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
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#007A78]/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#007A78] shadow-sm">
                        <Sparkles size={15} />
                        Platform Growth
                    </div>

                    <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#16302E] sm:text-5xl lg:text-6xl">
                        Numbers That Tell

                        <span className="mt-2 block text-[#007A78]">
                            Our Story.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#16302E]/60 sm:text-lg">
                        Empowering organizers to create memorable experiences
                        and helping thousands of people discover events they
                        truly love.
                    </p>
                </motion.div>

                {/* Statistics Cards */}
                <div className="md:mt-16 mt-10 grid gap-2 md:gap-5 grid-cols-2 md:grid-cols-4">
                    {statistics.map((stat, index) => {
                        const Icon = stat.icon;

                        return (
                            <motion.div
                                key={stat.label}
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
                                    delay: index * 0.1,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group relative overflow-hidden rounded-lg border border-[#007A78]/10 bg-white p-7 shadow-lg shadow-[#007A78]/5 transition hover:border-[#007A78]/25 hover:shadow-xl"
                            >
                                {/* Hover Glow */}
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#007A78]/5 blur-[60px] transition group-hover:bg-[#007A78]/10" />

                                {/* Icon */}
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#007A78]/10 text-[#007A78] transition duration-300 group-hover:scale-110 group-hover:bg-[#007A78] group-hover:text-white">
                                    <Icon size={25} />
                                </div>

                                {/* Number */}
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.3 + index * 0.1,
                                    }}
                                    className="relative mt-5 text-2xl md:text-4xl font-bold tracking-tight text-[#16302E]"
                                >
                                    {stat.value}
                                </motion.h3>

                                {/* Label */}
                                <h4 className="relative mt-2 text-md md:text-lg font-semibold text-[#007A78]">
                                    {stat.label}
                                </h4>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Growth Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative mt-16 overflow-hidden rounded-[32px] border border-[#007A78]/15 bg-white p-8 shadow-xl shadow-[#007A78]/5 sm:p-10"
                >
                    {/* Decorative Background */}
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#007A78]/10 to-transparent" />

                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                        {/* Left */}
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#007A78]">
                                <TrendingUp size={18} />
                                GROWING EVERY DAY
                            </div>

                            <h3 className="mt-4 text-2xl font-bold text-[#16302E] sm:text-3xl">
                                One Platform. Thousands of Experiences.
                            </h3>

                            <p className="mt-3 leading-7 text-[#16302E]/60">
                                Our platform brings organizers and attendees
                                together, making event creation, ticket sales
                                and event management simpler than ever.
                            </p>
                        </div>

                        {/* Mini Stats */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-5">
                            <div className="rounded-2xl border border-[#007A78]/10 bg-[#F7FAF9] px-6 py-5 text-center">
                                <p className="text-2xl font-bold text-[#007A78]">
                                    99.9%
                                </p>

                                <p className="mt-1 text-xs text-[#16302E]/50">
                                    Platform Uptime
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#007A78]/10 bg-[#F7FAF9] px-6 py-5 text-center">
                                <p className="text-2xl font-bold text-[#007A78]">
                                    24/7
                                </p>

                                <p className="mt-1 text-xs text-[#16302E]/50">
                                    Always Available
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PlatformStatistics;

